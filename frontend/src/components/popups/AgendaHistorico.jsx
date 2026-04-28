import "../../assets/styles/popups/agendaHistorico.css"
import { HiOutlineX, HiOutlineUser, HiOutlineStatusOffline, HiOutlineStatusOnline} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useState } from "react"
import Verpsi from "./Verpsi"
import Deletar from "./Deletar"

function consultaAntiga(agenda) {
  if (!agenda) return false;

  const [ano, mes, dia] = agenda.diaAgendado.split("-");
  const [hora, minuto] = agenda.horaAgendada.split(":");

  const inicio = new Date(ano, mes - 1, dia, hora, minuto);
  const fim = new Date(inicio.getTime() + 50 * 60000);

  return new Date() > fim;
}

export default function AgendaHistorico({
    user,
    open = false, 
    close = () => {},
    dia,
    mes,
    mesNome,
    ano,
    agenda,
    onRemarcar,
    onDeletar
}) {
    const navigate = useNavigate();
    const [openReschedule, setOpenReschedule] = useState(false);
    const [openCancel, setOpenCancel] = useState(false);
    const [deletando, setDeletando] = useState(false);
    
    const hoje = new Date();
    const dataCompletaSelecionada = new Date(ano, mes, dia);
    const diaAnterior = dataCompletaSelecionada.getDate() - 1;
    const isHoje = dataCompletaSelecionada.toDateString() === hoje.toDateString();

    const jaPassou = consultaAntiga(agenda);
    const isConfirmado = agenda.status === "Confirmado";
    const mesNum = (mes + 1).toString().padStart(2, 0);

    // Antigos agendamentos
    const consultaRealizada = jaPassou && isConfirmado;
    const consultaCancelada = jaPassou && !isConfirmado;

    const handleProfile = () => {
        navigate(`/perfil/psicologo/${agenda.psicologo.id}`);
    }

    const removerSchedule = () => {
        setDeletando(true);
        onDeletar(agenda)
    };

    const remarcarAgendamento = (dados) => {
        onRemarcar({
            agendamentoId: agenda.id_agendamento,
            ...dados
        });
    }

    if (!open) return null;

    return (
        <>
            <div className="pop-up-backdrop" onClick={close}></div>
            <div className="pop-up-agenda-historico">
                <div className="header-pop-agendamento">
                    <h3>{dia} de {mesNome}</h3>
                    <button
                        className="btn-close-pop-up"
                        onClick={close}>
                        <HiOutlineX />
                    </button>
                </div>
                <div className="pop-up-agendamento-content">
                    <div className="agendamento-infos">
                        <div className="info-remetente">
                            <p><span>Nome: </span> {agenda.psicologo.nome}</p>
                            <p><span>Data: </span> {` ${dia}/${mesNum}/${ano}`}</p>
                            <p><span>Horário: </span> {agenda.horaAgendada}</p>
                        </div>
                        <button onClick={handleProfile} className="perfil-remetente icon-ui" >
                            <HiOutlineUser id="search-icon-btn"/>
                        </button>
                    </div>
                    <p>Remarcação ou cancelamento do agendamento será apenas possivel até o penultimo dia antes da data da consulta: até {` ${diaAnterior}/${mesNum}/${ano}`}. <span className="link-text"><a href="/termos-e-condicoes">Termos</a></span></p>
                    <div className={`status-agendamento ${agenda.status.toLowerCase()}`}>
                        <span>Status:</span> {agenda.status}
                    </div>

                    {/* Consulta anterior ocorrida */}
                    {consultaRealizada && (
                        <p className="attention-setence done">
                            <span className="icon-attention-setence"><HiOutlineStatusOnline /></span> 
                            <span>Consulta realizada com sucesso</span>
                        </p>
                    )}

                    {/* Consulta anterior não ocorrida */}
                    {consultaCancelada && (
                        <p className="attention-setence cancel">
                            <span className="icon-attention-setence"><HiOutlineStatusOffline /></span> 
                            <span>Agendamento cancelado automaticamente devido à ausência de confirmação pelo psicólogo.</span>
                        </p>
                    )}

                    {/* Consulta atual e futura */}
                    {!jaPassou && isHoje && isConfirmado && currentlyDay(user)}
                    {!jaPassou && (!isConfirmado || !isHoje) && randomDay(setOpenReschedule, setOpenCancel)}
                </div>
            </div>
            <Deletar
                open={openCancel}
                close={() => {
                    setOpenCancel(false);
                }}
                onConfirm={() => removerSchedule(agenda.id_agendamento)}
                loading={deletando}
                title="Deletar agendamento"
                message="Você tem certeza que deseja deletar esta solicitação? Esta ação não pode ser desfeita. Será necessário realizar um novo agendamento."
                confirmText="Deletar solicitação"
            />
            <Verpsi
                open={openReschedule}
                close={() => setOpenReschedule(false)}
                perfil={agenda.psicologo}
                onConfirm={remarcarAgendamento}
                modo="remarcar"
            />
        </>
    )
}

function currentlyDay(user){
    return (
        <>
            <a href={`${user.id}/videochamada`} className="wrapped-btn">
                <button className="button-progress-confirm">
                    <span className="dot-animated"></span>
                    Começar consulta
                </button>
            </a>
        </>
    )
}

function randomDay(setOpenReschedule, setOpenCancel){
    return (
        <>
            <button className="remarcar-consulta button-progress-confirm" onClick={() => setOpenReschedule(true)}>Remarcar data/horário</button>
            <button className="cancelar-consulta button-proceed" onClick={() => setOpenCancel(true)}>Cancelar agendamento</button>
        </>
    )
}