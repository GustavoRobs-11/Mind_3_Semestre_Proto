import { useAuth } from "../../../context/AuthContext.jsx";
import "../../../assets/styles/perfil/sidebar.css";

import { Link } from "react-router-dom";
import Logout from "../Logout.jsx";

import {
    FaSmileBeam,
    FaSmile,
    FaMeh,
    FaFrown,
    FaAngry
} from "react-icons/fa";

import {
    HiOutlineMoon,
    HiOutlineShoppingCart,
    HiOutlineBookOpen,
    HiOutlineSparkles,
    HiOutlineBriefcase,
    HiOutlineMap,
    HiOutlineLocationMarker,
    HiOutlineHome,
    HiOutlineUserGroup,
    HiOutlineMusicNote
} from "react-icons/hi";

export default function SideBarPaciente({ profileData }) {
    const { user } = useAuth();

    if (!profileData) return <p>Carregando...</p>;

    const atividades = [
        { icon: <HiOutlineMoon />, label: "Descanso" },
        { icon: <HiOutlineShoppingCart />, label: "Compra" },
        { icon: <HiOutlineSparkles />, label: "Faxina" },
        { icon: <HiOutlineBookOpen />, label: "Leitura" },
        { icon: <HiOutlineHome />, label: "Boa refeição" },
        { icon: <HiOutlineUserGroup />, label: "Jogo" },
        { icon: <HiOutlineMap />, label: "Viagem" },
        { icon: <HiOutlineBriefcase />, label: "Trabalho" },
        { icon: <HiOutlineUserGroup />, label: "Família" },
        { icon: <HiOutlineLocationMarker />, label: "Encontro" },
        { icon: <HiOutlineSparkles />, label: "Festa" },
        { icon: <HiOutlineMusicNote />, label: "Música" }
    ];

    return (
        <aside className="sidebar-paciente">

            {/* PRÓXIMA CONSULTA */}
            <section className="container-proxima-consulta">
                <div className="container-dia">
                    <p>6</p>
                    <span>Abril</span>
                </div>

                <div className="container-consulta-info">
                    <h4>Sua próxima consulta com o Dr. Luigi será em breve</h4>
                    <span className="status-consulta">
                        Status - Confirmado
                    </span>
                </div>
            </section>

            {/* AUTOAVALIAÇÃO */}
            <section className="container-autoavaliacao">
                <h3>Como voce esta?</h3>

                <div className="container-buttons">
                    <button><FaSmileBeam /></button>
                    <button><FaSmile /></button>
                    <button><FaMeh /></button>
                    <button><FaFrown /></button>
                    <button><FaAngry /></button>
                </div>

                <h3>Selecione 3 atividades principais do seu dia</h3>

                <div className="container-atividades">
                    {atividades.map((item, index) => (
                        <button
                            key={index}
                            className="ativ"
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>

                <button className="button-confirm">
                    Enviar
                </button>
            </section>

            {/* AÇÕES */}
            <section className="acoes-sidebar">
                <Link
                    to={`/${user.tipo}/perfil/configuracoes`}
                    className="button-sidebar config-btn"
                >
                    Configurações
                </Link>

                <Logout />
            </section>
        </aside>
    );
}