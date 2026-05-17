import fotoDefault from '../../assets/img/perfil-default.png';
import '../../assets/styles/popups/verpsi.css';

import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { listarTodosDoPsicologo } from '../../services/horarioService.js';
import { listarDoPsicologo as listarAgendasDoPsicologo } from '../../services/agendaService.js';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineUser, HiOutlineX } from 'react-icons/hi';
import { toast } from 'react-toastify';

export default function VerPsi({
  open = false,
  close = () => { },
  perfil,
  onConfirm = () => { },
  modo
}) {
  const navigate = useNavigate();
  const { user, isPaciente } = useAuth();
  const modalRef = useRef(null);

  const [selecionadoData, setSelecionadoData] = useState('');
  const [selecionadoHorario, setSelecionadoHorario] = useState('');
  const [selecionadoHorarioId, setSelecionadoHorarioId] = useState('');
  const [selecionadoSemana, setSelecionadoSemana] = useState('');

  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [datasDisponiveis, setDatasDisponiveis] = useState([]);
  const [agenda, setAgenda] = useState([]);
  const [agendamentosExistentes, setAgendamentosExistentes] = useState([]);

  const diasUnicos = [...new Set(agenda.map(a => a.diaDaSemana))].sort((a, b) => {
    const ordem = {
      Segunda: 1,
      Terca: 2,
      Quarta: 3,
      Quinta: 4,
      Sexta: 5,
      Sabado: 6,
      Domingo: 7
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

    const hoje = new Date();
    const data = new Date(hoje);
    const limite = new Date(hoje);

    limite.setMonth(limite.getMonth() + 2);

    const datas = [];

    while (data <= limite) {
      if (data.getDay() === diasMap[diaSemana]) {
        const formatada = data.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit'
        });

        const year = data.getFullYear();
        const month = String(data.getMonth() + 1).padStart(2, '0');
        const day = String(data.getDate()).padStart(2, '0');

        datas.push({
          label: formatada,
          value: `${year}-${month}-${day}`
        });
      }

      data.setDate(data.getDate() + 1);
    }

    return datas;
  };

  useEffect(() => {
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
              horaInicio: a.horaInicio
            }))
          );
        }
      } catch (err) {
        console.log(err);
        toast.error('Erro ao carregar horários do psicólogo');
      }
    })();
  }, [perfil?.id]);

  useEffect(() => {
    if (!selecionadoSemana) return;

    setDatasDisponiveis(getDatasPorSemana(selecionadoSemana));
  }, [selecionadoSemana]);

  useEffect(() => {
    if (!selecionadoSemana) {
      setHorariosDisponiveis([]);
      return;
    }

    const filtrados = agenda
      .filter(h => h.diaDaSemana.toLowerCase() === selecionadoSemana.toLowerCase())
      .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

    const agora = new Date();

    const hojeIso = `${agora.getFullYear()}-${String(
      agora.getMonth() + 1
    ).padStart(2, '0')}-${String(agora.getDate()).padStart(2, '0')}`;

    const horariosComStatus = filtrados.map(h => {
      let jaPassou = false;

      if (selecionadoData === hojeIso) {
        const [horas, minutos] = h.horaInicio.split(':').map(Number);

        const dataHoraSlot = new Date(agora);
        dataHoraSlot.setHours(horas, minutos, 0, 0);

        jaPassou = dataHoraSlot < agora;
      }

      const estaOcupado = agendamentosExistentes.some(
        ag =>
          ag.data === selecionadoData &&
          ag.horaInicio === h.horaInicio &&
          ag.status !== 'CANCELADO' &&
          ag.status !== 'RECUSADO'
      );

      return {
        ...h,
        ocupado: estaOcupado || !h.disponivel || jaPassou
      };
    });

    setHorariosDisponiveis(horariosComStatus);
  }, [selecionadoSemana, agenda, selecionadoData, agendamentosExistentes]);

  useEffect(() => {
    setSelecionadoData('');
    setSelecionadoHorario('');
  }, [selecionadoSemana]);

  useEffect(() => {
    if (open) {
      modalRef.current?.focus();
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Escape') close();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [close]);

  const handleAgendar = async () => {
    if (!isPaciente) {
      toast.error('Somente pacientes podem realizar agendamentos.');
      return;
    }

    if (!selecionadoData || !selecionadoHorario) {
      toast.warn('Selecione um dia e horário');
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

      await onConfirm(dados);

      toast.success('Agendamento realizado com sucesso!');

      close(); // FECHA O POPUP
    } catch (err) {
      toast.error(err.message || 'Erro ao realizar agendamento');
    }
  };

  if (!open || !perfil) return null;

  const handleOpenProfile = () => {
    navigate(`/perfil/psicologo/${perfil.id}`, {
      state: { perfil }
    });
  };

  return (
    <>
      <div className='popup-backdrop' onClick={close}></div>

      <div
        className='container-ver-psi'
        role='dialog'
        aria-modal='true'
        tabIndex={-1}
        ref={modalRef}
      >
        <button
          className='btn-close-modal'
          onClick={close}
          aria-label='Fechar modal'
        >
          <HiOutlineX />
        </button>

        <aside className='sidebar-psi'>
          <div className="container-foto-dados">
            <div className="container-foto-button">
              <img
                src={perfil.foto || fotoDefault}
                alt={`Foto de ${perfil.nome}`}
                className='foto-psi'
                onError={e => {
                  e.target.src = fotoDefault;
                }}
              />
              <button
                className='button-confirm'
                onClick={handleOpenProfile}
                aria-label='Abrir perfil completo'
              >
                Ver Peril
              </button>
            </div>


            <div className='info-psi'>
              <h2>{perfil.nome || 'Não informado'}</h2>

              <p>
                <strong>Idade:</strong> {perfil.idade || 'Não informado'}
              </p>

              <p>
                <strong>Local:</strong> {perfil.local || 'Não informado'}
              </p>

              <p>
                <strong>CRP:</strong> {perfil.crp || '0000-000'}
              </p>
            </div>
          </div>




          <div className='container-tags'>
            {perfil.tags?.length > 0 ? (
              perfil.tags.map((tag, index) => (
                <span key={index} className='tag-chip'>
                  {tag}
                </span>
              ))
            ) : (
              <p>Nenhuma especialidade informada</p>
            )}
          </div>
        </aside>

        <main className='content-agendamento'>
          <section className='agenda-card'>
            <label htmlFor='semanas' className='label-agendamento'>
              Dia da semana
            </label>

            <select
              id='semanas'
              value={selecionadoSemana}
              onChange={e => setSelecionadoSemana(e.target.value)}
            >
              <option value='' disabled hidden>
                Escolher dia disponível
              </option>

              {diasUnicos.map((semana, index) => (
                <option key={index} value={semana}>
                  {semana.charAt(0).toUpperCase() + semana.slice(1)}
                  {semana === 'Sabado' || semana === 'Domingo'
                    ? ''
                    : '-feira'}
                </option>
              ))}
            </select>
          </section>

          <section className='agenda-card'>
            <h3 className='label-agendamento'>Dias disponíveis</h3>

            <div className='container-botoes'>
              {datasDisponiveis.map((d, index) => (
                <button
                  key={index}
                  className={`btn-data-agenda ${selecionadoData === d.value ? 'selected' : ''
                    }`}
                  onClick={() => setSelecionadoData(d.value)}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </section>

          <section className='agenda-card'>
            <h3 className='label-agendamento'>Horários</h3>

            <div className='container-botoes'>
              {horariosDisponiveis.map((h, index) => (
                <button
                  key={index}
                  disabled={h.ocupado}
                  className={`btn-data-agenda
                    ${selecionadoHorario === h.horaInicio ? 'selected' : ''}
                    ${h.ocupado ? 'disabled' : ''}`}
                  onClick={() => {
                    if (!h.ocupado) {
                      setSelecionadoHorario(h.horaInicio);
                      setSelecionadoHorarioId(h.id);
                    }
                  }}
                >
                  {h.horaInicio}
                </button>
              ))}
            </div>
          </section>

          <div className='container-legenda-horarios'>
            <div className='tag-legenda'>
              <span className='color-tag-selecionado'></span>
              <p>Selecionado</p>
            </div>

            <div className='tag-legenda'>
              <span className='color-tag-ocupado'></span>
              <p>Ocupado</p>
            </div>

            <div className='tag-legenda'>
              <span className='color-tag-livre'></span>
              <p>Em aberto</p>
            </div>
          </div>

          <div className='btn-agendar-cancelar'>
            <button className='button-confirm' onClick={handleAgendar}>
              {modo === 'remarcar' ? 'Remarcar' : 'Agendar'}
            </button>
          </div>
        </main>
      </div>
    </>
  );
}