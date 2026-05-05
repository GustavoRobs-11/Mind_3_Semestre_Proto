import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../../assets/styles/perfil/calendario.css";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import AgendaHistorico from "../popups/AgendaHistorico";
import AgendaHistoricoPsi from "../popups/AgendaHistoricoPsi";
import { listarDoPaciente, listarDoPsicologo, remarcarAgendamento, cancelarAgendamento } from "../../services/agendaService";
import { listarTodosDoPsicologo } from "../../services/horarioService";

function gerarSemana(data) {
  const start = new Date(data);
  const diaSemana = start.getDay();
  start.setDate(start.getDate() - diaSemana);

  const semana = [];
  for (let i = 0; i < 7; i++) {
    const dia = new Date(start);
    dia.setDate(start.getDate() + i);
    semana.push(dia);
  }
  return semana;
}

export default function Calendario() {
  const { user } = useAuth();

  const [openAgenda, setOpenAgenda] = useState(false);
  const [agendaSelecionada, setAgendaSelecionada] = useState(null);
  const [daySelected, setDaySelected] = useState(null);

  const [dataAtual, setDataAtual] = useState(new Date());
  const diasSemanaAtual = gerarSemana(dataAtual);
  const hoje = new Date();

  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
  const diasMap = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];

  const [agendamentos, setAgendamentos] = useState([]);
  const [horariosPsi, setHorariosPsi] = useState({});

  async function carregarDados() {
    try {
      if (!user || !user.id) return;
      
      if (user.tipo === "paciente") {
        const dadosAgendas = await listarDoPaciente(user.id);
        const mapeados = dadosAgendas.map(a => ({
          id_agendamento: a.id,
          horaAgendada: a.horaInicio,
          diaAgendado: a.data,
          status: a.status.charAt(0).toUpperCase() + a.status.slice(1).toLowerCase(),
          paciente: { id: a.pacienteId, nome: a.pacienteNome },
          psicologo: { id: a.psicologoId, nome: a.psicologoNome }
        }));
        setAgendamentos(mapeados);
      } else if (user.tipo === "psicologo") {
        const [dadosAgendas, dadosHorarios] = await Promise.all([
          listarDoPsicologo(user.id),
          listarTodosDoPsicologo(user.id)
        ]);

        const mapeados = dadosAgendas.map(a => ({
          id_agendamento: a.id,
          horaAgendada: a.horaInicio,
          diaAgendado: a.data,
          status: a.status.charAt(0).toUpperCase() + a.status.slice(1).toLowerCase(),
          paciente: { id: a.pacienteId, nome: a.pacienteNome },
          psicologo: { id: a.psicologoId, nome: a.psicologoNome }
        }));
        setAgendamentos(mapeados);

        const mapaDias = {
          "Domingo": "domingo", "Segunda": "segunda", "Terca": "terca",
          "Quarta": "quarta", "Quinta": "quinta", "Sexta": "sexta", "Sabado": "sabado"
        };
        const novosHorarios = { domingo: [], segunda: [], terca: [], quarta: [], quinta: [], sexta: [], sabado: [] };
        dadosHorarios.forEach(h => {
          const diaKey = mapaDias[h.diaDaSemana];
          if (novosHorarios[diaKey]) {
            novosHorarios[diaKey].push(h.horaInicio);
          }
        });
        for (const dia in novosHorarios) {
          novosHorarios[dia].sort();
        }
        setHorariosPsi(novosHorarios);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do calendário:", error);
    }
  }

  useEffect(() => {
    carregarDados();

    // Polling automático a cada 30 segundos para sincronizar com o backend
    const interval = setInterval(() => {
      carregarDados();
    }, 30000);

    return () => clearInterval(interval);
  }, [user, dataAtual]);

  function parseDateBR(dateString) {
    const [ano, mes, dia] = dateString.split("-");
    return new Date(ano, mes - 1, dia);
  }

  function getAgendamento(dia, hora) {
    const STATUS_ATIVOS = ["pendente", "confirmado"];
    const matches = agendamentos.filter(a => {
      const data = parseDateBR(a.diaAgendado);
      return (
        data.toDateString() === dia.toDateString() &&
        a.horaAgendada === hora &&
        a.psicologo?.id === user.id
      );
    });
    const ativo = matches.find(a => STATUS_ATIVOS.includes(a.status.toLowerCase()));
    return ativo || matches[0] || null;
  }

  function semanaAnterior() {
    const nova = new Date(dataAtual);
    nova.setDate(nova.getDate() - 7);
    setDataAtual(nova);
  }

  function semanaProxima() {
    const nova = new Date(dataAtual);
    nova.setDate(nova.getDate() + 7);
    setDataAtual(nova);
  }

  function isAgora(agenda) {
    if (!agenda) return false;
    const inicio = new Date(`${agenda.diaAgendado}T${agenda.horaAgendada}`);
    const inicioAntecipado = new Date(inicio.getTime() - 10 * 60000);
    const fim = new Date(inicio.getTime() + 50 * 60000);
    const agora = new Date();
    return agora >= inicioAntecipado && agora <= fim;
  }

  function changeStatus(novoStatus) {
    if (!agendaSelecionada) return;
    const atualizados = agendamentos.map(a => 
      a.id_agendamento === agendaSelecionada.id_agendamento ? { ...a, status: novoStatus } : a
    );
    setAgendamentos(atualizados);
    setAgendaSelecionada(prev => ({ ...prev, status: novoStatus }));
  }

  async function handleRemarcar(agendaAntiga, novosDados) {
    try {
      await remarcarAgendamento(agendaAntiga.id_agendamento, novosDados);
      setAgendamentos(prev =>
        prev.map(a => {
          if (a.id_agendamento === agendaAntiga.id_agendamento){
            return {
              ...a,
              diaAgendado: novosDados.data,
              horaAgendada: novosDados.horaInicio,
              status: "Pendente"
            };
          }
          return a;
        })
      );
      toast.success("Solicitação de remarcação enviada!");
    } catch (err) {
      console.error(err);
      alert("Erro ao remarcar a consulta: " + err.message);
    }
  }

  async function handleRemover(agendaParaRemover) {
    try {
      await cancelarAgendamento(agendaParaRemover.id_agendamento);
      setAgendamentos(prev =>
        prev.filter(a => a.id_agendamento !== agendaParaRemover.id_agendamento)
      );
      setOpenAgenda(false);
      toast.success("Agendamento cancelado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao cancelar o agendamento: " + err.message);
    }
  }

  return (
    <>
      <div className="container-calendario">
        <h1>Agenda</h1>

        <div className="wrapper-content-calendar">
          <div className="header-calendario">
            <button
              className="button-seta-calendario"
              onClick={() => {
                const nova = new Date(dataAtual);
                nova.setMonth(nova.getMonth() - 1);
                setDataAtual(nova);
              }}
            >
              <HiChevronLeft />
            </button>
            <h2>
              {dataAtual.toLocaleString("pt-BR", { month: "long" })}
            </h2>
            <button
              className="button-seta-calendario"
              onClick={() => {
                const nova = new Date(dataAtual);
                nova.setMonth(nova.getMonth() + 1);
                setDataAtual(nova);
              }}
            >
              <HiChevronRight />
            </button>
          </div>

          <div className="calendar-unified-grid">
            {/* Linha 1: Labels (Colunas 2 a 8) */}
            <div className="grid-spacer"></div>
            {diasSemana.map(dia => (
              <div key={dia} className="dia-semana">{dia}</div>
            ))}
            <div className="grid-spacer"></div>

            {/* Linha 2: Setas e Números (Colunas 1, 2-8, 9) */}
            <button className="button-seta-calendario seta-semana" onClick={semanaAnterior}>
              <HiChevronLeft />
            </button>
            {diasSemanaAtual.map(dia => (
              <div key={dia.toISOString()} className="dia-numero-container">
                <div className={dia.toDateString() === hoje.toDateString() ? "dia-hoje" : ""}>
                  {dia.getDate()}
                </div>
              </div>
            ))}
            <button className="button-seta-calendario seta-semana" onClick={semanaProxima}>
              <HiChevronRight />
            </button>

            {/* Linha 3: Slots de Horário (Colunas 2 a 8) */}
            <div className="grid-spacer"></div>
            {user.tipo === "psicologo" ? (
              diasSemanaAtual.map(dia => {
                const key = diasMap[dia.getDay()];
                const horarios = horariosPsi[key] || [];
                return (
                  <div key={dia.toISOString()} className="coluna-dia">
                    {horarios.length > 0 &&
                      horarios.map(hora => {
                        const ag = getAgendamento(dia, hora);
                        return (
                          <div
                            key={hora}
                            className={`slot-horario ${ag ? ag.status.toLowerCase() : "livre"}`}
                            onClick={() => {
                              if (!ag) return;
                              setDaySelected(dia);
                              setAgendaSelecionada(ag);
                              setOpenAgenda(true);
                            }}
                          >
                            {hora}
                            {ag && ag.status.toLowerCase() === "confirmado" && isAgora(ag) && (
                              <span className="dot-animated"></span>
                            )}
                          </div>
                        );
                      })
                    }
                  </div>
                );
              })
            ) : (
              diasSemanaAtual.map(dia => {
                const STATUS_ATIVOS = ["pendente", "confirmado", "realizado"];
                const agsDoDia = agendamentos.filter(a => {
                  const data = parseDateBR(a.diaAgendado);
                  return data.toDateString() === dia.toDateString() && a.paciente?.id === user.id;
                });

                const horasVistas = new Map();
                agsDoDia.forEach(ag => {
                  const hora = ag.horaAgendada;
                  const existente = horasVistas.get(hora);
                  const agAtivo = STATUS_ATIVOS.includes(ag.status.toLowerCase());
                  const existenteAtivo = existente && STATUS_ATIVOS.includes(existente.status.toLowerCase());
                  if (!existente || (!existenteAtivo && agAtivo)) {
                    horasVistas.set(hora, ag);
                  }
                });
                const agsFiltrados = Array.from(horasVistas.values());

                return (
                  <div key={dia.toISOString()} className="coluna-dia">
                    {agsFiltrados.map(ag => (
                      <div
                        key={ag.id_agendamento}
                        className={`slot-horario ${ag.status.toLowerCase()}`}
                        onClick={() => {
                          setDaySelected(dia);
                          setAgendaSelecionada(ag);
                          setOpenAgenda(true);
                        }}
                      >
                        {ag.horaAgendada}
                        {ag.status.toLowerCase() === "confirmado" && isAgora(ag) && (
                          <span className="dot-animated"></span>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })
            )}
            <div className="grid-spacer"></div>
          </div>
        </div>

        <div className="container-legenda-calendario">
          <div className="block-legenda">
            <span className="consulta-marcada"></span>
            <p>Consulta marcada</p>
          </div>
          <div className="block-legenda">
            <span className="consulta-nao-confirmada"></span>
            <p>Consulta não confirmada</p>
          </div>
          <div className="block-legenda">
            <span className="consulta-cancelada"></span>
            <p>Consulta cancelada</p>
          </div>
        </div>
      </div>

      {agendaSelecionada && (
        user.tipo === "psicologo" ? (
          <AgendaHistoricoPsi
            user={user}
            open={openAgenda}
            close={() => setOpenAgenda(false)}
            dia={daySelected?.getDate()}
            mes={daySelected?.getMonth()}
            mesNome={daySelected?.toLocaleString("pt-BR", { month: "long" })}
            ano={daySelected?.getFullYear()}
            changeStatus={(e) => changeStatus(e)}
            agenda={agendaSelecionada}
          />
        ) : (
          <AgendaHistorico
            user={user}
            open={openAgenda}
            close={() => setOpenAgenda(false)}
            dia={daySelected?.getDate()}
            mes={daySelected?.getMonth()}
            mesNome={daySelected?.toLocaleString("pt-BR", { month: "long" })}
            ano={daySelected?.getFullYear()}
            agenda={agendaSelecionada}
            onRemarcar={(novosDados) => handleRemarcar(agendaSelecionada, novosDados)}
            onDeletar={(agenda) => handleRemover(agenda)}
          />
        )
      )}
    </>
  );
}
