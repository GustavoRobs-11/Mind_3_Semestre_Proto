import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import {
  HiChevronLeft,
  HiChevronRight
} from "react-icons/hi";

import "../../assets/styles/perfil/calendario.css";

import { useAuth } from "../../context/AuthContext";

import AgendaHistorico from "../popups/AgendaHistorico";
import AgendaHistoricoPsi from "../popups/AgendaHistoricoPsi";

import {
  listarDoPaciente,
  listarDoPsicologo,
  remarcarAgendamento,
  cancelarAgendamento
} from "../../services/agendaService";

import { listarTodosDoPsicologo } from "../../services/horarioService";

/* ========================================
   CONSTANTES
======================================== */

const DIAS_SEMANA = [
  "Dom",
  "Seg",
  "Ter",
  "Qua",
  "Qui",
  "Sex",
  "Sab"
];

const DIAS_MAP = [
  "domingo",
  "segunda",
  "terca",
  "quarta",
  "quinta",
  "sexta",
  "sabado"
];


const HORARIOS_INICIAIS = {
  domingo: [],
  segunda: [],
  terca: [],
  quarta: [],
  quinta: [],
  sexta: [],
  sabado: []
};

const MAPA_DIAS = {
  Domingo: "domingo",
  Segunda: "segunda",
  Terca: "terca",
  Quarta: "quarta",
  Quinta: "quinta",
  Sexta: "sexta",
  Sabado: "sabado"
};

/* ========================================
   HELPERS
======================================== */

function gerarSemana(data) {
  const start = new Date(data);

  const diaSemana = start.getDay();

  start.setDate(start.getDate() - diaSemana);

  return Array.from({ length: 7 }, (_, i) => {
    const dia = new Date(start);

    dia.setDate(start.getDate() + i);

    return dia;
  });
}

function parseDateBR(dateString) {
  const [ano, mes, dia] =
    dateString.split("-");

  return new Date(ano, mes - 1, dia);
}

function formatarStatus(status) {
  return (
    status.charAt(0).toUpperCase() +
    status.slice(1).toLowerCase()
  );
}

/* ========================================
   COMPONENTE
======================================== */

export default function Calendario() {
  const { user } = useAuth();

  const [dataAtual, setDataAtual] =
    useState(new Date());

  const [agendamentos, setAgendamentos] =
    useState([]);

  const [horariosPsi, setHorariosPsi] =
    useState(HORARIOS_INICIAIS);

  const [openAgenda, setOpenAgenda] =
    useState(false);

  const [agendaSelecionada,
    setAgendaSelecionada] =
    useState(null);

  const [daySelected, setDaySelected] =
    useState(null);

  const hoje = new Date();

  const diasSemanaAtual = useMemo(() => {
  return user.tipo === "psicologo"
    ? gerarSemana(dataAtual)
    : [];
}, [dataAtual, user.tipo]);

  /* ========================================
     LOAD DATA
  ======================================== */

  useEffect(() => {
    carregarDados();

    const interval = setInterval(
      carregarDados,
      10000
    );

    return () => clearInterval(interval);
  }, [user, dataAtual]);

  async function carregarDados() {
    try {
      if (!user?.id) return;

      if (user.tipo === "paciente") {
        carregarAgendasPaciente();
      }

      if (user.tipo === "psicologo") {
        carregarAgendasPsicologo();
      }
    } catch (error) {
      console.error(
        "Erro ao carregar calendário:",
        error
      );
    }
  }

  async function carregarAgendasPaciente() {
    const dados =
      await listarDoPaciente(user.id);

    setAgendamentos(
      mapearAgendamentos(dados)
    );
  }

  async function carregarAgendasPsicologo() {
    const [dadosAgendas, dadosHorarios] =
      await Promise.all([
        listarDoPsicologo(user.id),
        listarTodosDoPsicologo(user.id)
      ]);

    setAgendamentos(
      mapearAgendamentos(dadosAgendas)
    );

    setHorariosPsi(
      mapearHorarios(dadosHorarios)
    );
  }

  function mapearAgendamentos(dados) {
    return dados.map((a) => ({
      id_agendamento: a.id,

      horaAgendada: a.horaInicio,

      diaAgendado: a.data,

      status: formatarStatus(a.status),

      paciente: {
        id: a.pacienteId,
        nome: a.pacienteNome
      },

      psicologo: {
        id: a.psicologoId,
        nome: a.psicologoNome
      }
    }));
  }

  function mapearHorarios(dadosHorarios) {
    const novosHorarios = {
      ...HORARIOS_INICIAIS
    };

    dadosHorarios.forEach((h) => {
      const diaKey = MAPA_DIAS[h.diaDaSemana];

      if (!novosHorarios[diaKey]) return;

      // evita duplicados
      const jaExiste =
        novosHorarios[diaKey].includes(
          h.horaInicio
        );

      if (!jaExiste) {
        novosHorarios[diaKey].push(
          h.horaInicio
        );
      }
    });

    Object.keys(novosHorarios).forEach(
      (dia) => {
        novosHorarios[dia].sort();
      }
    );

    return novosHorarios;
  }

  /* ========================================
     HELPERS
  ======================================== */
  function getAgendamento(dia, hora) {
  const matches = agendamentos.filter((a) => {
    const data = parseDateBR(a.diaAgendado);

    const pertenceUsuario =
      user.tipo === "psicologo"
        ? a.psicologo?.id === user.id
        : a.paciente?.id === user.id;

    return (
      data.toDateString() === dia.toDateString() &&
      a.horaAgendada === hora &&
      pertenceUsuario
    );
  });

  const prioridadeStatus = [
    "confirmado",
    "pendente",
    "realizado",
    "cancelado",
    "recusado"
  ];

  for (const status of prioridadeStatus) {
    const encontrado = matches.find(
      (a) => a.status.toLowerCase() === status
    );

    if (encontrado) return encontrado;
  }

  return null;
}


  function isAgora(agenda) {
    if (!agenda) return false;

    const inicio = new Date(
      `${agenda.diaAgendado}T${agenda.horaAgendada}`
    );

    const inicioAntecipado = new Date(
      inicio.getTime() - 10 * 60000
    );

    const fim = new Date(
      inicio.getTime() + 50 * 60000
    );

    const agora = new Date();

    return (
      agora >= inicioAntecipado &&
      agora <= fim
    );
  }

  /* ========================================
     NAVEGAÇÃO
  ======================================== */

  function alterarSemana(valor) {
    const nova = new Date(dataAtual);

    nova.setDate(
      nova.getDate() + valor
    );

    setDataAtual(nova);
  }

  function alterarMes(valor) {
    const nova = new Date(dataAtual);

    nova.setMonth(
      nova.getMonth() + valor
    );

    setDataAtual(nova);
  }

  /* ========================================
     ACTIONS
  ======================================== */

  function abrirAgenda(agenda, dia) {
    setAgendaSelecionada(agenda);

    setDaySelected(dia);

    setOpenAgenda(true);
  }

  function changeStatus(novoStatus) {
    if (!agendaSelecionada) return;

    setAgendamentos((prev) =>
      prev.map((a) =>
        a.id_agendamento ===
          agendaSelecionada.id_agendamento
          ? {
            ...a,
            status: novoStatus
          }
          : a
      )
    );

    setAgendaSelecionada((prev) => ({
      ...prev,
      status: novoStatus
    }));
  }

  async function handleRemarcar(
    agendaAntiga,
    novosDados
  ) {
    try {
      await remarcarAgendamento(
        agendaAntiga.id_agendamento,
        novosDados
      );

      setAgendamentos((prev) =>
        prev.map((a) =>
          a.id_agendamento ===
            agendaAntiga.id_agendamento
            ? {
              ...a,
              diaAgendado:
                novosDados.data,

              horaAgendada:
                novosDados.horaInicio,

              status: "Pendente"
            }
            : a
        )
      );

      toast.success(
        "Solicitação de remarcação enviada!"
      );
    } catch (err) {
      console.error(err);

      alert(err.message);
    }
  }

  async function handleRemover(agenda) {
    try {
      await cancelarAgendamento(
        agenda.id_agendamento
      );

      setAgendamentos((prev) =>
        prev.filter(
          (a) =>
            a.id_agendamento !==
            agenda.id_agendamento
        )
      );

      setOpenAgenda(false);

      toast.success(
        "Agendamento cancelado!"
      );
    } catch (err) {
      console.error(err);

      alert(err.message);
    }
  }

  function gerarMes(data) {
    const ano = data.getFullYear();
    const mes = data.getMonth();

    const primeiroDia = new Date(
      ano,
      mes,
      1
    );

    const ultimoDia = new Date(
      ano,
      mes + 1,
      0
    );

    const inicioSemana =
      primeiroDia.getDay();

    const diasNoMes =
      ultimoDia.getDate();

    const dias = [];

    // dias mês anterior
    for (
      let i = inicioSemana - 1;
      i >= 0;
      i--
    ) {
      dias.push({
        data: new Date(
          ano,
          mes,
          -i
        ),
        atual: false
      });
    }

    // mês atual
    for (
      let dia = 1;
      dia <= diasNoMes;
      dia++
    ) {
      dias.push({
        data: new Date(
          ano,
          mes,
          dia
        ),
        atual: true
      });
    }

    // completar 42 (6 semanas)
    while (dias.length < 42) {
      const ultimo =
        dias[dias.length - 1].data;

      dias.push({
        data: new Date(
          ultimo.getFullYear(),
          ultimo.getMonth(),
          ultimo.getDate() + 1
        ),
        atual: false
      });
    }

    return dias;
  }

  const diasMesAtual = useMemo(
    () => gerarMes(dataAtual),
    [dataAtual]
  );

  function getStatusDia(dia) {
    const agendasDoDia =
      agendamentos.filter((a) => {
        const data = parseDateBR(
          a.diaAgendado
        );

        return (
          data.toDateString() ===
          dia.toDateString() &&
          a.paciente?.id === user.id
        );
      });

    if (!agendasDoDia.length)
      return "livre";

    const prioridade = [
      "confirmado",
      "pendente",
      "realizado",
      "cancelado",
      "recusado"
    ];

    for (const status of prioridade) {
      const tem =
        agendasDoDia.find(
          (a) =>
            a.status.toLowerCase() ===
            status
        );

      if (tem) return status;
    }

    return "livre";
  }



  /* ========================================
     RENDER
  ======================================== */

  function renderHorario(
    hora,
    dia,
    ag
  ) {
    const classe = ag
      ? ag.status.toLowerCase()
      : "livre";

    return (
      <div
        key={hora}
        className={`slot-horario ${classe}`}
        onClick={() =>
          ag && abrirAgenda(ag, dia)
        }
      >
        {hora}

        {ag &&
          ag.status.toLowerCase() ===
          "confirmado" &&
          isAgora(ag) && (
            <span className="dot-animated"></span>
          )}
      </div>
    );
  }

  function renderColunaDia(dia) {
    const key = DIAS_MAP[dia.getDay()];

    // remove duplicados e limita a no máximo 5 horários
    const horarios = [
      ...new Set(horariosPsi[key] || [])
    ].slice(0, 5);

    // quantidade fixa máxima
    const totalSlots = 5;

    // quantos slots vazios faltam
    const faltantes = totalSlots - horarios.length;

    return (
      <div
        key={dia.toISOString()}
        className="calendar-column"
      >
        {/* HORÁRIOS REAIS */}
        {horarios.map((hora) => {
          const ag =
            user.tipo === "psicologo"
              ? getAgendamento(dia, hora)
              : null;

          return renderHorario(
            hora,
            dia,
            ag
          );
        })}

        {/* COMPLETA COM VAZIOS */}
        {Array.from({
          length: faltantes > 0 ? faltantes : 0
        }).map((_, index) => (
          <div
            key={`vazio-${index}`}
            className="slot-horario vazio"
          />
        ))}
      </div>
    );
  }

  /* ========================================
     JSX
  ======================================== */

  return (
    <>
      <div className="container-calendario">

        {/* CONTEÚDO */}
        <div className="calendar-content">

          {/* SETA ESQUERDA */}
          <button
            className="side-arrow"
            onClick={() =>
              alterarSemana(-7)
            }
          >
            <HiChevronLeft />
          </button>

          {/* CENTRO */}
          <div className="calendar-center">

            {/* TOPO */}
            <div className="calendar-top">

              <button
                className="month-arrow"
                onClick={() =>
                  alterarMes(-1)
                }
              >
                <HiChevronLeft />
              </button>

              <h2 className="calendar-month">
                {dataAtual.toLocaleString(
                  "pt-BR",
                  {
                    month: "long"
                  }
                )}
              </h2>

              <button
                className="month-arrow"
                onClick={() =>
                  alterarMes(1)
                }
              >
                <HiChevronRight />
              </button>

            </div>

            {/* GRID */}
            <div className="calendar-grid-wrapper">

              {/* HEADER */}
              <div className="calendar-header-row">

                {diasSemanaAtual.map(
                  (dia, index) => (
                    <div
                      key={dia.toISOString()}
                      className="calendar-header-day"
                    >
                      <span className="day-name">
                        {
                          DIAS_SEMANA[
                          index
                          ]
                        }
                      </span>

                      <span
                        className={`day-number ${dia.toDateString() ===
                          hoje.toDateString()
                          ? "today"
                          : ""
                          }`}
                      >
                        {dia.getDate()}
                      </span>
                    </div>
                  )
                )}

              </div>

              {/* BODY */}
              {user.tipo === "psicologo" ? (
                <div className="calendar-body">
                  {diasSemanaAtual.map(
                    renderColunaDia
                  )}
                </div>
              ) : (
                renderCalendarioPaciente()
              )}

            </div>

          </div>

          {/* SETA DIREITA */}
          <button
            className="side-arrow"
            onClick={() =>
              alterarSemana(7)
            }
          >
            <HiChevronRight />
          </button>

        </div>

        {/* LEGENDA */}
        <div className="calendar-legend">

          <div className="legend-item">

            <span className="legend-color nao-confirmada"></span>

            <p>
              Consultas não confirmadas
            </p>

          </div>

          <div className="legend-item">

            <span className="legend-color confirmada"></span>

            <p>
              Consultas confirmadas
            </p>

          </div>

          <div className="legend-item">

            <span className="legend-color cancelada"></span>

            <p>
              Consultas canceladas
            </p>

          </div>

        </div>

      </div>

      {/* MODAIS */}
      {agendaSelecionada &&
        (user.tipo ===
          "psicologo" ? (
          <AgendaHistoricoPsi
            user={user}
            open={openAgenda}
            close={() =>
              setOpenAgenda(false)
            }
            dia={daySelected?.getDate()}
            mes={daySelected?.getMonth()}
            mesNome={daySelected?.toLocaleString(
              "pt-BR",
              {
                month: "long"
              }
            )}
            ano={daySelected?.getFullYear()}
            changeStatus={
              changeStatus
            }
            agenda={
              agendaSelecionada
            }
          />
        ) : (
          <AgendaHistorico
            user={user}
            open={openAgenda}
            close={() =>
              setOpenAgenda(false)
            }
            dia={daySelected?.getDate()}
            mes={daySelected?.getMonth()}
            mesNome={daySelected?.toLocaleString(
              "pt-BR",
              {
                month: "long"
              }
            )}
            ano={daySelected?.getFullYear()}
            agenda={
              agendaSelecionada
            }
            onRemarcar={(dados) =>
              handleRemarcar(
                agendaSelecionada,
                dados
              )
            }
            onDeletar={
              handleRemover
            }
          />
        ))}
    </>
  );
}