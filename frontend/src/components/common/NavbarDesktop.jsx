import { NavLink, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { HiOutlineSearch, HiOutlineBell, HiOutlineUser } from "react-icons/hi";
import { useAuth } from '../../context/AuthContext';
import foto from '../../assets/img/perfil-default.png';
import Notifications from './Notifications/notifications';
import { notificacaoService } from '../../services/notificacaoService';


export default function NavDesktop() {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null); // referência para o dropdown

    const { user, isAuthenticated, isPsicologo, logout } = useAuth();
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
    const [notificacoes, setNotificacoes] = useState([]);

    useEffect(() => {
        if (isAuthenticated && user) {
            const fetchNotificacoes = async () => {
                try {
                    const data = await notificacaoService.listarDoUsuario(user.id);
                    setNotificacoes(data);
                } catch (error) {
                    console.error("Erro ao buscar notificações", error);
                }
            };
            fetchNotificacoes();
            
            // Polling a cada 3 segundos para parecer em tempo real
            const interval = setInterval(fetchNotificacoes, 3000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated, user]);

    const notificacoesNaoLidas = notificacoes.filter(n => !n.lida);

    const handleMarkAsRead = async (id) => {
        try {
            await notificacaoService.marcarComoLida(id);
            setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
        } catch (error) {
            console.error("Erro ao marcar como lida", error);
        }
    };

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
                            <NavLink to={isPsicologo ? "/artigos" : "/home"}>
                                <HiOutlineSearch id="search-icon-btn" className="icon-ui" />
                            </NavLink>
                            <NavLink to={`/${user.tipo.toLowerCase()}/perfil`}>
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

                                {notificacoesNaoLidas.length > 0 && (
                                    <span className="notif-badge">
                                        {notificacoesNaoLidas.length}
                                    </span>
                                )}
                            </button>

                            {isNotifOpen && (
                                <Notifications 
                                    setNotifOpen={setNotifOpen} 
                                    notificacoes={notificacoes} 
                                    user={user}
                                    onMarkAsRead={handleMarkAsRead}
                                />
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
                                    className="button-confirm nav-btn-login"
                                    onClick={() => setDropdownOpen(prev => !prev)}
                                >
                                    Login
                                </button>
                            </Link>
                        </>
                    ) : null}
                </div>
            </nav>
        </>
    )
}
