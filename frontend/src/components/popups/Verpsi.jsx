import fotoDefault from '../../assets/img/perfil-default.png'
import Calendario from '../perfilpage/Calendario';
import "../../assets/styles/popups/verpsi.css";

import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { listarTodosDoPsicologo } from "../../services/horarioService.js";
import { listarDoPsicologo as listarAgendasDoPsicologo } from "../../services/agendaService.js";
import { useAuth } from "../../context/AuthContext";
import { HiOutlineUser } from "react-icons/hi";
import { toast } from "react-toastify";

export default function VerPsi({ 
  open = false, 
  close = () => { }, 
  perfil ,
  onConfirm = () => {},
  modo
}) {
  const navigate = useNavigate();
  const { user, isPaciente } = useAuth();
  const inputRef = useRef(null);
  const [selecionadoData, setSelecionadoData] = useState("");
  const [selecionadoHorario, setSelecionadoHorario] = useState("");
  const [selecionadoHorarioId, setSelecionadoHorarioId] = useState("");
  const [selecionadoSemana, setSelecionadoSemana] = useState("");

  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [datasDisponiveis, setDatasDisponiveis] = useState([]);
  const [agenda, setAgenda] = useState([]);
  const [agendamentosExistentes, setAgendamentosExistentes] = useState([]);
  const diasUnicos = [...new Set(agenda.map(a => a.diaDaSemana))].sort((a, b) => {
    const ordem = {
      "Segunda": 1,
      "Terca": 2,
      "Quarta": 3,
      "Quinta": 4,
      "Sexta": 5,
      "Sabado": 6,
      "Domingo": 7
    };
    return (ordem[a] || 0) - (ordem[b] || 0);
  });

  const getDatasPorSemana = (diaSemana) => {
    const diasMap = {
      Domingo: 0,
      Segunda: 1,
      Terca: 2,
      Quarta: 3,
      Quinta: 4,
      Sexta: 5,
      Sabado: 6
    };

    const hoje = new Date(); // data atual (fixa)

    let data = new Date(hoje); // iterador
    const limite = new Date(hoje); 
    limite.setMonth(limite.getMonth() + 2); // até onde se quer buscar (limite de três meses)

    const datas = []; 

    while (data <= limite) {
      if (data.getDay() === diasMap[diaSemana]) {
        const formatada = data.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit"
        });
        const year = data.getFullYear();
        const month = String(data.getMonth() + 1).padStart(2, '0');
        const day = String(data.getDate()).padStart(2, '0');
        const iso = `${year}-${month}-${day}`; // YYYY-MM-DD
        datas.push({ label: formatada, value: iso });
      }
      data.setDate(data.getDate() + 1);
    }

    return datas;
  };

  useEffect(() => { // fetch das informações dos psicologos
    (async () => {
      try {
        if (perfil?.id) {
            const dataHorarios = await listarTodosDoPsicologo(perfil.id);
            const dataAgendas = await listarAgendasDoPsicologo(perfil.id);
            
            setAgendamentosExistentes(dataAgendas);
            setAgenda(
              dataHorarios.map(a => ({
                ...a,
                diaDaSemana: a.diaDaSemana,
                horaInicio: a.horaInicio,
                // ocupado: !a.disponivel, // Não usamos mais o ocupado global para bloqueio dinâmico
              }))
            );
        }
      } catch (err) {
          console.log(err)
          toast.error("Erro ao carregar horários do psicólogo");
      }
    })()
  }, [perfil?.id])

  useEffect(() => { // Datas apartir da semana selecionada
    if (!selecionadoSemana) return;

    const datas = getDatasPorSemana(selecionadoSemana);
    setDatasDisponiveis(datas);

  }, [selecionadoSemana]);

  useEffect(() => { // Horario selecionado
    if (!selecionadoSemana) {
      setHorariosDisponiveis([]);
      return;
    }

    const filtrados = agenda.filter(
      (h) => h.diaDaSemana.toLowerCase() === selecionadoSemana.toLowerCase()
    ).sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

    // Marcar como ocupado se houver agendamento na data selecionada ou se o horário já passou hoje
    const agora = new Date();
    const year = agora.getFullYear();
    const month = String(agora.getMonth() + 1).padStart(2, '0');
    const day = String(agora.getDate()).padStart(2, '0');
    const hojeIso = `${year}-${month}-${day}`;

    const horariosComStatus = filtrados.map(h => {
        // Verifica se o horário já passou para o dia de hoje
        let jaPassou = false;
        if (selecionadoData === hojeIso) {
            const [horas, minutos] = h.horaInicio.split(':').map(Number);
            const dataHoraSlot = new Date(agora);
            dataHoraSlot.setHours(horas, minutos, 0, 0);
            jaPassou = dataHoraSlot < agora;
        }

        const estaOcupado = agendamentosExistentes.some(ag => 
            ag.data === selecionadoData && 
            ag.horaInicio === h.horaInicio &&
            ag.status !== "CANCELADO"
        );
        return { ...h, ocupado: estaOcupado || !h.disponivel || jaPassou };
    });

    setHorariosDisponiveis(horariosComStatus);
  }, [selecionadoSemana, agenda, selecionadoData, agendamentosExistentes]);

  useEffect(() => { // Reset das informações
    setSelecionadoData("");
    setSelecionadoHorario("");
  }, [selecionadoSemana]);

  const handleAgendar = async () => {
    if (!isPaciente) {
      toast.error("Somente pacientes podem realizar agendamentos.");
      return;
    }

    if (!selecionadoData || !selecionadoHorario) {
      toast.warn("Selecione o dia e o horário");
      return;
    }

    try {
      const dados = {
        pacienteId: user.id,
        horarioId: selecionadoHorarioId,
        data: selecionadoData,
        diaDaSemana: selecionadoSemana,
        horaInicio: selecionadoHorario
      };

      setAgenda(prev =>
        prev.map(h =>
          h.id === selecionadoHorarioId
            ? { ...h, ocupado: true }
            : h
        )
      );

      onConfirm(dados)
      toast.success("Agendado com sucesso!");
    } catch (err) {
      toast.error(err.message || "Erro ao realizar agendamento");
    }
  }

  // Focus no pop-up
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  // Fechar com tecla esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [close]);

  // Scroll da página quando Pop-up aberto
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;

    if (open) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  // não renderiza se modal fechado ou sem perfil
  if (!open || !perfil) return null;

  const handleOpenProfile = () => {
    navigate(`/perfil/psicologo/${perfil.id}`, { state: { perfil } });
  };

  return (
    <>
    <div className="pop-up-backdrop" onClick={close} aria-hidden="true"></div>
    <div 
      className="container-ver-psi"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      ref={inputRef}
      aria-label={`Preview informações do psciologo: ${perfil.nome || "Sem nome"}`}
    >
      <div className="container-info-psi">

        <div className="preview-dados-psi">
          <div className="container-dados">
            <h2>{perfil.nome || "Não informado"}</h2>
            <p><b>Idade:</b> {perfil.idade || "Não informado"}</p>
            <p><b>Local:</b> {perfil.local || "Não informado"}</p>
            <div className="perfil-psi-all-info">
              <button
                className="icon-btn icon-ui"
                onClick={handleOpenProfile}
                aria-label="Ver perfil completo do psicólogo"
              >
                <HiOutlineUser />
              </button>
              <p>CRP: {perfil.crp || "0000-000"}</p>
            </div>
          </div>
          <hr />
          <div className="container-conhecimentos">
            <h2>Conhecimentos:</h2>
            <div>
              {perfil.tags?.length === 0 ? (
                <p style={{ margin: 0 }}>Nenhuma especialidade informada</p>
              ) : (
                perfil.tags?.map((t, i) => (
                  <span key={i} className="tag-chip" data-speciality={t}>{t}</span>
                ))
              )}
            </div>
          </div>
        </div>
        
        <img 
          src={perfil.foto || fotoDefault} 
          alt={`Foto de perfil - psicologo: ${perfil.nome || "Sem nome"}`} 
          onError={(e) => {
            e.target.src = fotoDefault;
        }}/>
      </div>

      {/* horarios e dinamicidade */}
      <section className="agenda-data-horario">
        <label htmlFor="semanas" className="label-agendamento">Dia da semana</label>
        <select 
          name="semanasAgendamento" 
          id="semanas"
          value={selecionadoSemana}
          onChange={(e) => setSelecionadoSemana(e.target.value)}
        >
          <option value="" disabled hidden>Escolher semana disponivel</option>
          {diasUnicos.map((semana, i) => (
            <option key={i} value={semana}>{
              (semana || "").charAt(0).toUpperCase() + (semana || "").slice(1)
            }{
              (semana === "Sabado" || semana === "Domingo") ? "" : "-feira"
            }</option>
          ))}

        </select>
      </section>

      <section className="agenda-data-horario">
        <h3 className="label-agendamento">Dias disponiveis</h3>
        <div>
          {datasDisponiveis.map((d, i) => (
            <button 
              key={i} 
              className={`btn-data-agenda 
                ${selecionadoData == d.value ? "selected" : ""}
              `}
              onClick={() => setSelecionadoData(d.value)} 
              aria-pressed={selecionadoData === d.value}>{d.label}</button>
          ))}
        </div>
      </section>

    <section className="agenda-data-horario">
        <h3 className="label-agendamento">Horários</h3>
        <div>
          {horariosDisponiveis.map((h, i) => (
            <button 
              key={i} 
              className={`btn-data-agenda 
                ${selecionadoHorario === h.horaInicio ? "selected" : ""} 
                ${h.ocupado ? "disabled" : ""}`}
              disabled={h.ocupado}
              onClick={() => {
                if (!h.ocupado) {
                  setSelecionadoHorario(h.horaInicio);
                  setSelecionadoHorarioId(h.id);
                }
              }}
              aria-pressed={selecionadoHorario === h.horaInicio}>{h.horaInicio}</button>
          ))}
        </div>
      </section>

      <div className="container-legenda-horarios">
        <div className="tag-legenda">
          <span className="color-tag-ocupado"></span>
          <p>Ocupado</p>
        </div>
        <div className="tag-legenda">
          <span className="color-tag-livre"></span>
          <p>Em aberto</p>
        </div>
        <div className="tag-legenda">
          <span className="color-tag-seleacionado"></span>
          <p>Selecionado</p>
        </div>
      </div>
      <div className="btn-agendar-cancelar">
        <button className="button-cancelar" onClick={close} aria-label="Fechar">Cancelar</button>
        <button className="button-confirm" onClick={() => handleAgendar()}>
          {modo === "remarcar" ? "Remarcar" : "Agendar"}
        </button>
      </div>
    </div>
    </>
  )
}
