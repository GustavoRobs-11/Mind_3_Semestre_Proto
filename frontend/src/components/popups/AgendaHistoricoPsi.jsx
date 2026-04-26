import "../../assets/styles/popups/agendaHistorico.css"
import { HiOutlineX, HiOutlineUser, HiOutlineStatusOffline, HiOutlineStatusOnline} from "react-icons/hi";

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
    const mesNum = (mes + 1).toString().padStart(2, 0);

    // Antigos agendamentos
    const consultaRealizada = jaPassou && isConfirmado;
    const consultaCancelada = jaPassou && !isConfirmado;

    const enviarRespostaPsi = () => { // Enviar informação de status atualizado
        
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
                            <p><span>Nome: </span> {agenda.paciente} </p>
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
                    {consultaCancelada && (
                        <p className="attention-setence cancel">
                            <span className="icon-attention-setence"><HiOutlineStatusOffline /></span> 
                            <span>Agendamento cancelado automaticamente devido à ausência de confirmação pelo psicólogo.</span>
                        </p>
                    )}

                    {/* Consulta atual e futura */}
                    {!jaPassou && isHoje && isConfirmado && currentlyDay(user)}
                    {!jaPassou && (!isConfirmado || !isHoje) && randomDay(changeStatus, enviarRespostaPsi)}

                </div>
            </div>
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

function randomDay(changeStatus, enviarRespostaPsi){
    return (
        <>
        <div className="status-termos">
            <button className="button-attention btn-pop-up-agendamento-historico" onClick={() => changeStatus("Cancelado")}>Recusar</button>
            <button className="button-confirm btn-pop-up-agendamento-historico" onClick={() => changeStatus("Confirmado")}>Confirmar</button>
        </div>
        <p>Enviar atualização dos status de agendamento:</p>
        <button className="button-progress-confirm" onClick={() => enviarRespostaPsi()}>Enviar</button>
        </>
    )
}