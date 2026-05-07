import React, { useState } from 'react';
import '../../../assets/styles/notificacoes/notificacoes.css'
import { HiOutlineBell, HiChevronDown, HiOutlineStatusOffline, HiOutlineX, HiOutlineUser } from "react-icons/hi";

export default function Notifications({ setNotifOpen, notificacoes, user }) {
    const [openNotif, setOpenNotif] = useState(null);

    const handleOpenProfile = () => {
        if (user) {
            window.location.href = `/${user.tipo.toLowerCase()}/perfil/${user.id}`;
        }
    };

    return (
        <div
            className="notif-modal-overlay"
            onClick={() => setNotifOpen(false)}
        >
            <div
                className="notif-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="notif-close"
                    onClick={() => setNotifOpen(false)}
                >
                    <HiOutlineX />
                </button>

                <h3 className="notif-title">Notificações</h3>

                {notificacoes.length === 0 && (
                    <p>Sem notificações</p>
                )}

                {notificacoes.map((notif) => {

                    {/* ===== MENSAGEM ===== */}
                    if (notif.tipo === "mensagem") {
                        return (
                            <div key={notif.id} className="notif-msg">
                                <img
                                    src={notif.foto}
                                    className="notif-avatar"
                                    alt="avatar"
                                />
                                <div className="notif-msg-text">
                                    <strong>{notif.nome}</strong>
                                    <p>{notif.texto}</p>
                                </div>
                                <span className="notif-hora">
                                    {notif.hora}
                                </span>
                            </div>
                        )
                    }

                    {/* ===== CONFIRMAÇÃO ===== */}
                    if (notif.tipo === "confirmacao") {
                        const statusClass = notif.status ? notif.status.toLowerCase() : 'pendente';
                        const statusText = notif.status ? notif.status : 'Pendente';

                        return (
                            <div
                                key={notif.id}
                                className={`notif-confirm ${openNotif === notif.id ? "active" : ""}`}
                            >
                                <div
                                    className="notif-confirm-header"
                                    onClick={() =>
                                        setOpenNotif(
                                            openNotif === notif.id ? null : notif.id
                                        )
                                    }
                                >
                                    <div className="icon-svg">
                                        <HiOutlineBell />
                                    </div>

                                    <p>
                                        {notif.nome} confirmou seu agendamento
                                    </p>
                                </div>

                                {openNotif === notif.id && (
                                    <div className="notif-confirm-body">
                                        <div className="container-info-icon">
                                            <div className="info-nofif-confirmmacao">
                                                <p>
                                                    <strong>Nome:</strong> {notif.nome}
                                                </p>
                                                <p>
                                                    <strong>Data:</strong> {notif.data}
                                                </p>
                                                <p>
                                                    <strong>Horário:</strong> {notif.horario}
                                                </p>
                                            </div>
                                            <button className="icon-btn icon-ui" onClick={handleOpenProfile}>
                                                <HiOutlineUser />
                                            </button>
                                        </div>
                                        <div className="container-status">
                                            <div className={`status-agendamento ${statusClass} status-notificacoes`}>
                                                <span>Status:</span> {statusText}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    }

                    {/* ===== CANCELAMENTO DE SOLICITAÇÃO ===== */}
                    if (notif.tipo === "cancelamento") {
                        return (
                            <div
                                key={notif.id}
                                className={`notif-cancelamento ${openNotif === notif.id ? "active" : ""}`}
                                onClick={() =>
                                    setOpenNotif(
                                        openNotif === notif.id ? null : notif.id
                                    )
                                }
                            >
                                <div className="notif-cancelamento-header">
                                    <div className="icon-svg">
                                        <HiOutlineBell />
                                    </div>
                                    <p>
                                        Cancelamento de solicitação pendente
                                    </p>
                                    <span className="notif-hora">
                                        {notif.hora}
                                    </span>
                                </div>

                                {openNotif === notif.id && (
                                    <div className="notif-cancelamento-body">
                                        <div className="notif-cancelamento-info">
                                            <HiOutlineStatusOffline/>
                                            <p>
                                                Agendamento cancelado automaticamente devido à
                                                ausência de confirmação pelo psicólogo.
                                            </p>
                                        </div>
                                        <a className="notif-link-termos" href="#">Termos</a>
                                    </div>
                                )}
                            </div>
                        )
                    }

                    {/* ===== CANCELAMENTO DA AGENDA ===== */}
                    if (notif.tipo === "cancelamento-agenda") {
                        return (
                            <div
                                key={notif.id}
                                className={`notif-cancelamento-agenda ${openNotif === notif.id ? "active" : ""}`}
                                onClick={() =>
                                    setOpenNotif(
                                        openNotif === notif.id ? null : notif.id
                                    )
                                }
                            >
                                <div className="notif-cancelamento-agenda-header">
                                    <div className="icon-svg">
                                        <HiOutlineBell />
                                    </div>
                                    <p>
                                        Cancelamento da agenda do dia {notif.data} ás {notif.horario}
                                    </p>
                                    <span className="notif-hora">
                                        {notif.hora}
                                    </span>
                                </div>

                                {openNotif === notif.id && (
                                    <div className="notif-cancelamento-agenda-body">
                                        <div className="container-info-icon">
                                            <div className="info-nofif-confirmmacao">
                                                <p>
                                                    <strong>Nome:</strong> {notif.nome}
                                                </p>
                                                <p>
                                                    <strong>Data:</strong> {notif.data}
                                                </p>
                                                <p>
                                                    <strong>Horário:</strong> {notif.horario}
                                                </p>
                                            </div>
                                        </div>
                                        <a className="notif-link-termos" href="#">Termos</a>
                                    </div>
                                )}
                            </div>
                        )
                    }

                    {/* ===== REAGENDAMENTO REALIZADO ===== */}
                    if (notif.tipo === "reagendamento") {
                        const statusClass = notif.status ? notif.status.toLowerCase() : 'pendente';
                        const statusText = notif.status ? notif.status : 'Pendente';

                        return (
                            <div
                                key={notif.id}
                                className={`notif-reagendamento ${openNotif === notif.id ? "active" : ""}`}
                            >
                                <div
                                    className="notif-reagendamento-header"
                                    onClick={() =>
                                        setOpenNotif(
                                            openNotif === notif.id ? null : notif.id
                                        )
                                    }
                                >
                                    <div className="icon-svg">
                                        <HiOutlineBell />
                                    </div>

                                    <p>
                                        Reagendamento realizado {notif.dataAnterior} → {notif.dataNova}
                                    </p>
                                    <span className="notif-hora">
                                        {notif.hora}
                                    </span>
                                </div>

                                {openNotif === notif.id && (
                                    <div className="notif-reagendamento-body">
                                        <div className="container-info-icon">
                                            <div className="info-nofif-confirmmacao">
                                                <p>
                                                    <strong>Nome:</strong> {notif.nome}
                                                </p>
                                                <p>
                                                    <strong>Data:</strong> {notif.dataNova}
                                                </p>
                                                <p>
                                                    <strong>Horário:</strong> {notif.horario}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="container-status">
                                            <div className={`status-agendamento ${statusClass} status-notificacoes`}>
                                                <span>Status:</span> {statusText}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    }

                    {/* ===== SOLICITAÇÃO DE CONSULTA ===== */}
                    if (notif.tipo === "solicitacao") {
                        const statusClass = notif.status ? notif.status.toLowerCase() : 'pendente';
                        const statusText = notif.status ? notif.status : 'Pendente';

                        return (
                            <div
                                key={notif.id}
                                className={`notif-solicitacao ${openNotif === notif.id ? "active" : ""}`}
                            >
                                <div
                                    className="notif-solicitacao-header"
                                    onClick={() =>
                                        setOpenNotif(
                                            openNotif === notif.id ? null : notif.id
                                        )
                                    }
                                >
                                    <div className="icon-svg">
                                        <HiOutlineBell />
                                    </div>

                                    <p>
                                        Solicitação de consulta
                                        <br />
                                        <span className="notif-sub-text">Status: {statusText}...</span>
                                    </p>
                                    <span className="notif-hora">
                                        {notif.hora}
                                    </span>
                                </div>

                                {openNotif === notif.id && (
                                    <div className="notif-solicitacao-body">
                                        <div className="container-info-icon">
                                            <div className="info-nofif-confirmmacao">
                                                <p>
                                                    <strong>Nome:</strong> {notif.nome}
                                                </p>
                                                <p>
                                                    <strong>Data:</strong> {notif.data}
                                                </p>
                                                <p>
                                                    <strong>Horário:</strong> {notif.horario}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="container-status">
                                            <div className={`status-agendamento ${statusClass} status-notificacoes`}>
                                                <span>Status:</span> {statusText}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    }

                    {/* ===== RECUSA DE SOLICITAÇÃO ===== */}
                    if (notif.tipo === "recusa") {
                        return (
                            <div
                                key={notif.id}
                                className={`notif-recusa ${openNotif === notif.id ? "active" : ""}`}
                                onClick={() =>
                                    setOpenNotif(
                                        openNotif === notif.id ? null : notif.id
                                    )
                                }
                            >
                                <div className="notif-recusa-header">
                                    <div className="icon-svg">
                                        <HiOutlineBell />
                                    </div>
                                    <p>
                                        {notif.nome} recusou sua solicitação de agendamento
                                    </p>
                                    <span className="notif-hora">
                                        {notif.hora}
                                    </span>
                                </div>

                                {openNotif === notif.id && (
                                    <div className="notif-recusa-body">
                                        <p>
                                            Area de motivo de cancelamento em desenvolvimento
                                        </p>
                                    </div>
                                )}
                            </div>
                        )
                    }

                    {/* ===== AGENDA DO DIA ===== */}
                    if (notif.tipo === "agenda-do-dia") {
                        return (
                            <div
                                key={notif.id}
                                className={`notif-agenda-do-dia ${openNotif === notif.id ? "active" : ""}`}
                                onClick={() =>
                                    setOpenNotif(
                                        openNotif === notif.id ? null : notif.id
                                    )
                                }
                            >
                                <div className="notif-agenda-do-dia-header">
                                    <div className="icon-svg">
                                        <HiOutlineBell />
                                    </div>
                                    <p>
                                        Agenda do dia
                                    </p>
                                    <span className="notif-hora">
                                        {notif.hora}
                                    </span>
                                </div>

                                {openNotif === notif.id && (
                                    <div className="notif-agenda-do-dia-body">
                                        <p>Sua agenda tem atendimentos marcados para hoje, acompanhe seus horários</p>
                                        <div className="notif-agenda-horarios">
                                            {notif.horarios && notif.horarios.map((h, i) => (
                                                <span key={i} className="notif-agenda-horario-item">
                                                    {h}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    }

                    return null;
                })}
            </div>
        </div>
    );
}
