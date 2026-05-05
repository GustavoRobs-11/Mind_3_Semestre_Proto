import "../../assets/styles/popups/agendaHistorico.css"
import { HiOutlineX, HiOutlineUser, HiOutlineStatusOffline, HiOutlineStatusOnline} from "react-icons/hi";
import { toast } from "react-toastify";
import { confirmarAgendamento, recusarAgendamento } from "../../services/agendaService";

function consultaAntiga(agenda) {
  if (!agenda) return false;

  const [ano, mes, dia] = agenda.diaAgendado.split("-");
  const [hora, minuto] = agenda.horaAgendada.split(":");

  const inicio = new Date(ano, mes - 1, dia, hora, minuto);
  const fim = new Date(inicio.getTime() + 50 * 60000);

  return new Date() > fim;
}

export default function AgendaHistoricoPsi({
    user,
    open = false, 
    close = () => {},
    dia,
    mes,
    mesNome,
    ano,
    agenda,
    changeStatus = () => {}
}) {
    const hoje = new Date();
    const dataCompletaSelecionada = new Date(ano, mes, dia);
    const isHoje = dataCompletaSelecionada.toDateString() === hoje.toDateString();
    
    const jaPassou = consultaAntiga(agenda);
    const isConfirmado = agenda.status === "Confirmado";
    const isRealizado = agenda.status === "Realizado";
    const isRecusado = agenda.status === "Recusado";
    const isCancelado = agenda.status === "Cancelado";
    const isTerminal = isRecusado || isCancelado;
    const isPendente = agenda.status === "Pendente";
    const mesNum = (mes + 1).toString().padStart(2, 0);

    const consultaRealizada = isRealizado || (jaPassou && isConfirmado);
    const consultaNaoOcorrida = jaPassou && !isConfirmado && !isRealizado && !isCancelado && !isRecusado;

    const handleConfirmar = async () => {
        try {
            await confirmarAgendamento(agenda.id_agendamento);
            toast.success("Agendamento confirmado!");
            changeStatus("Confirmado");
        } catch (error) {
            toast.error(error.message || "Erro ao confirmar agendamento.");
        }
    };

    const handleRecusar = async () => {
        try {
            await recusarAgendamento(agenda.id_agendamento);
            toast.success("Agendamento recusado.");
            changeStatus("Cancelado");
        } catch (error) {
            toast.error(error.message || "Erro ao recusar agendamento.");
        }
    };

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
                            <p><span>Nome: </span> {agenda.paciente.nome} </p>
                            <p><span>Data: </span> {` ${dia}/${mesNum}/${ano}`}</p>
                            <p><span>Horário: </span> {agenda.horaAgendada}</p>
                        </div>
                    </div>
                    <div className="status-termos">
                        <div className={`status-agendamento ${agenda.status.toLowerCase()}`}>
                            <span>Status:</span> {agenda.status}
                        </div>
                        <span className="link-text"><a href="/termos-e-condicoes">Termos</a></span>
                    </div>

                    {/* Consulta anterior ocorrida */}
                    {consultaRealizada && ( 
                        <p className="attention-setence done">
                            <span className="icon-attention-setence"><HiOutlineStatusOnline /></span> 
                            <span>Consulta realizada com sucesso</span>
                        </p>
                    )}

                    {/* Consulta anterior não ocorrida */}
                    {consultaNaoOcorrida && (
                        <p className="attention-setence cancel">
                            <span className="icon-attention-setence"><HiOutlineStatusOffline /></span> 
                            <span>Agendamento não realizado ou cancelado automaticamente.</span>
                        </p>
                    )}

                    {/* Agendamento recusado */}
                    {isRecusado && (
                        <p className="attention-setence cancel">
                            <span className="icon-attention-setence"><HiOutlineStatusOffline /></span>
                            <span>Agendamento recusado pelo psicólogo.</span>
                        </p>
                    )}

                    {/* Agendamento cancelado */}
                    {isCancelado && !jaPassou && (
                        <p className="attention-setence cancel">
                            <span className="icon-attention-setence"><HiOutlineStatusOffline /></span>
                            <span>Agendamento cancelado.</span>
                        </p>
                    )}

                    {/* Consulta atual e futura */}
                    {!jaPassou && isHoje && isConfirmado && currentlyDay(agenda.id_agendamento)}
                    {!jaPassou && isPendente && randomDay(handleConfirmar, handleRecusar)}

                </div>
            </div>
        </>
    )
}


function currentlyDay(agendamentoId){
    return (
        <>
        <a href={`/videochamada/${agendamentoId}`} className="wrapped-btn">
            <button className="button-progress-confirm">
                <span className="dot-animated"></span>
                Começar consulta
            </button>
        </a>
        </>
    )
}

function randomDay(handleConfirmar, handleRecusar){
    return (
        <>
        <div className="status-termos">
            <button className="button-attention btn-pop-up-agendamento-historico" onClick={handleRecusar}>Recusar</button>
            <button className="button-confirm btn-pop-up-agendamento-historico" onClick={handleConfirmar}>Confirmar</button>
        </div>
        </>
    )
}