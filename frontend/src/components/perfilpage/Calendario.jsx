import React, { useState } from "react";
import "../../assets/styles/perfil/calendario.css";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import AgendaHistorico from "../popups/AgendaHistorico";
import AgendaHistoricoPsi from "../popups/AgendaHistoricoPsi";

function gerarSemana(data) {
  const start = new Date(data);
  const diaSemana = start.getDay();
  console.log(start)
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

  // Mocks
  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

  const [agendamentos, setAgendamentos] = useState([
    {
      id_agendamento: "",
      paciente: "Luigi",
      horaAgendada: "13:00",
      diaAgendado: "2026-04-26",
      status: "Confirmado",
      psicologo: {
        id: "69e27b23ecfdc4d223d16522" ,
        nome: "Ana" 
      }
    },
    {
      id_agendamento: "",
      paciente: "Luigi",
      horaAgendada: "9:00",
      diaAgendado: "2026-04-26",
      status: "Pendente",
      psicologo: {
        id: "69e27b23ecfdc4d223d16522" ,
        nome: "Ana" 
      }
    },
    {
      id_agendamento: "",
      paciente: "Luigi",
      horaAgendada: "12:00",
      diaAgendado: "2026-04-26",
      status: "Confirmado",
      psicologo: {
        id: "69e27b23ecfdc4d223d16522" ,
        nome: "Ana" 
      }
    },
    {
      id_agendamento: "",
      paciente: "Maria",
      horaAgendada: "10:00",
      diaAgendado: "2026-04-27",
      status: "Pendente",
      psicologo: {
        id: "69e27b23ecfdc4d223d16522", 
        nome: "Carlos" 
      }
    },
    {
      id_agendamento: "",
      paciente: "Maria",
      horaAgendada: "10:00",
      diaAgendado: "2026-04-25",
      status: "Pendente",
      psicologo: {
        id: "69e27b23ecfdc4d223d16522", 
        nome: "Carlos" 
      }
    },
    {
      id_agendamento: "",
      paciente: "Maria",
      horaAgendada: "9:00",
      diaAgendado: "2026-04-25",
      status: "Confirmado",
      psicologo: {
        id: "69e27b23ecfdc4d223d16522", 
        nome: "Carlos" 
      }
    }
  ]);

  const horariosPsi = {
    domingo: ["9:00", "10:00", "11:00", "12:00", "13:00"],
    segunda: ["9:00", "10:00", "11:00", "13:00"],
    terca: ["9:00", "10:00", "11:00", "14:00"],
    quarta: ["9:00", "10:00", "11:00", "13:00"],
    quinta: ["9:00", "10:00", "11:00", "14:00", "15:00"],
    sexta: ["9:00", "10:00", "11:00"],
    sabado: ["9:00", "10:00"]
  };

  const diasMap = [
    "domingo",
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado"
  ];

  // Funções

  function parseDateBR(dateString) {
    const [ano, mes, dia] = dateString.split("-");
    return new Date(ano, mes - 1, dia);
  }

  function getAgendamento(dia, hora) {
    return agendamentos.find(a => {
      const data = parseDateBR(a.diaAgendado); // formatação do dia agendado
      return (
        data.toDateString() === dia.toDateString() &&
        a.horaAgendada === hora
      );
    });
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
    const inicioAntecipado = new Date(inicio.getTime() - 10 * 60000); // -10min
    const fim = new Date(inicio.getTime() + 50 * 60000); // +50min

    const agora = new Date();

    return agora >= inicioAntecipado && agora <= fim;
  }

  function changeStatus(novoStatus) {
    if (!agendaSelecionada) return;

    const atualizados = agendamentos.map(a => 
      a == agendaSelecionada 
        ? { ...a, status: novoStatus } 
        : a
    );

    setAgendamentos(atualizados);
    setAgendaSelecionada({ ...agendaSelecionada, status: novoStatus });
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

          <div className="linha-semana">
            {diasSemana.map(dia => (
              <div key={dia} className="dia-semana">
                {dia}
              </div>
            ))}
          </div>

          <div className="linha-dias-wrapper">
            <button className="button-seta-calendario" onClick={semanaAnterior}>
              <HiChevronLeft />
            </button>
            <div className="linha-dias">
              {diasSemanaAtual.map(dia => (
                <div
                  key={dia.toISOString()}
                  className={
                    dia.toDateString() === hoje.toDateString()
                      ? "dia-hoje"
                      : ""
                  }
                >
                  {dia.getDate()}
                </div>
              ))}
            </div>
            <button className="button-seta-calendario" onClick={semanaProxima}>
              <HiChevronRight />
            </button>
          </div>

          <div className="grid-semana">
            {diasSemanaAtual.map(dia => {
              const key = diasMap[dia.getDay()];
              const horarios = horariosPsi[key] || [];
              return (
                <div key={dia.toISOString()} className="coluna-dia">
                  {horarios.map(hora => {
                    const ag = getAgendamento(dia, hora);
                    return (
                      <div
                        key={hora}
                        className={`slot-horario ${
                          ag ? ag.status.toLowerCase() : "livre"
                        }`}
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
                  })}
                </div>
              );
            })}
          </div>
        </div>
        <div className="container-legenda-calendario">
          <div className="block-legenda">
            <span className="consulta-marcada"></span>
            <p>Consuta marcada</p>
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

      {agendaSelecionada &&
        (user.tipo === "psicologo" ? (
          <AgendaHistoricoPsi
            user={user}
            open={openAgenda}
            close={() => setOpenAgenda(false)}
            dia={daySelected?.getDate()}
            mes={daySelected?.getMonth()}
            mesNome={daySelected?.toLocaleString("pt-BR", {
              month: "long"
            })}
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
            mesNome={daySelected?.toLocaleString("pt-BR", {
              month: "long"
            })}
            ano={daySelected?.getFullYear()}
            agenda={agendaSelecionada}
          />
        ))}
    </>
  );
}