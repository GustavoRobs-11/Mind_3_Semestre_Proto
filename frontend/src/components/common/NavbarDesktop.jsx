import { NavLink, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { HiOutlineSearch, HiOutlineBell, HiOutlineUser } from "react-icons/hi";
import { useAuth } from '../../context/AuthContext';
import foto from '../../assets/img/perfil-default.png';
import Notifications from './Notifications/notifications';


export default function NavDesktop() {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null); // referência para o dropdown

    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/landing");
    };

    // 🔽 Fecha o dropdown ao clicar fora
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    const [isNotifOpen, setNotifOpen] = useState(false);

    const notificacoes = [
        {
            id: 1,
            tipo: "mensagem",
            nome: "Daniel",
            texto: "Bom dia, precisa de algo?",
            hora: "19:03",
            foto: foto
        },
        {
            id: 2,
            tipo: "confirmacao",
            nome: "Dra. Lucia Amaral",
            data: "06/04/2026",
            horario: "9:00h a.m",
            status: "Confirmado",
            foto: "../../assets/img/perfil-default.png"
        },
        {
            id: 3,
            tipo: "cancelamento",
            nome: "Daniel",
            hora: "19:03",
        },
        {
            id: 4,
            tipo: "cancelamento-agenda",
            nome: "Luigi",
            data: "06 de Abril",
            horario: "9:00",
            hora: "19:03",
        },
        {
            id: 5,
            tipo: "reagendamento",
            nome: "Luigi",
            dataAnterior: "06 de Abril",
            dataNova: "10 de Abril",
            data: "10/04/2026",
            horario: "9:00h a.m",
            status: "Pendente",
            hora: "19:03",
        },
        {
            id: 6,
            tipo: "solicitacao",
            nome: "Luigi",
            data: "16/04/2026",
            horario: "9:00h a.m",
            status: "Pendente",
            hora: "19:03",
        },
        {
            id: 7,
            tipo: "recusa",
            nome: "Dra. Lucia Amaral",
            hora: "19:03",
        },
        {
            id: 8,
            tipo: "agenda-do-dia",
            hora: "19:03",
            horarios: ["9:00", "10:30", "12:00", "16:30", "18:00", "19:30"],
        },
    ];
    return (
        <>
            <nav id="nav-desktop">
                <ul>
                    <NavLink id="linkSobreNos" to="/sobrenos">
                        <li>Sobre nós</li>
                    </NavLink>
                    <NavLink
                        id="linkPlanos"
                        to="/"
                        onClick={(e) => {
                            if (window.location.pathname === "/") {
                                e.preventDefault();
                                document.getElementById('planos')?.scrollIntoView({
                                    behavior: 'smooth'
                                });
                            }
                        }}>
                        <li>Planos</li>
                    </NavLink>
                    <NavLink id="linkArtigos" to="/artigos">
                        <li>Artigos</li>
                    </NavLink>
                    {isAuthenticated && (
                        <>
                            <NavLink to="/home">
                                <HiOutlineSearch id="search-icon-btn" className="icon-ui" />
                            </NavLink>
                            <NavLink to={`/${user.tipo.toLowerCase()}/perfil/${user.id}`}>
                                <HiOutlineUser id="search-icon-btn" className="icon-ui" />
                            </NavLink>
                        </>
                    )}
                    {isAuthenticated && (
                        <div className="notif-wrapper">
                            <button
                                className="notif-btn"
                                onClick={() => setNotifOpen(prev => !prev)}
                            >
                                <HiOutlineBell className="icon-ui" />

                                {notificacoes.length > 0 && (
                                    <span className="notif-badge">
                                        {notificacoes.length}
                                    </span>
                                )}
                            </button>

                            {isNotifOpen && (
                                <Notifications setNotifOpen={setNotifOpen} notificacoes={notificacoes} />
                            )}
                        </div>
                    )}
                </ul>
                <div className="nav-right-buttons" ref={dropdownRef}>
                    {!isAuthenticated ? (
                        <>
                            <Link to="login=0">
                                <button
                                    type="button"
                                    className="nav-btn-login"
                                    onClick={() => setDropdownOpen(prev => !prev)}
                                >
                                    Login
                                </button>
                            </Link>
                        </>
                    ) : null}

                    <div className={`nav-login-drop-wrapper ${isAuthenticated && isDropdownOpen ? "show" : ""}`}>
                        <div className="nav-login-drop">
                            {isAuthenticated ? (
                                <>
                                    {user && (
                                        <Link
                                            to={`/${user.tipo.toLowerCase()}/perfil/${user.id}`}
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <button type="button">Meu Perfil</button>
                                        </Link>
                                    )}
                                    <Link
                                        to={`/${user.tipo}/perfil/${user.id}/configuracoes`}
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <button type="button">Configurações</button>
                                    </Link>
                                    {user.tipo === "psicologo" && (
                                        <Link
                                            to="/adicionar-artigos"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <button type="button">Adicionar Artigos</button>
                                        </Link>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleLogout();
                                            setDropdownOpen(false);
                                        }}
                                    >
                                        Sair
                                    </button>
                                </>
                            ) : (
                                <>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}
