import { useState } from "react";
import { useAuth } from "../../../context/AuthContext.jsx";
import "../../../assets/styles/perfil/sidebar.css";

import { Link } from "react-router-dom";
import Logout from "../Logout.jsx";

export default function SideBarPaciente({ profileData }) {
    const { user } = useAuth();


    console.log("RENDERIZANDO SIDEBAR PACIENTE");
    
    if (!profileData) return <p>Carregando...</p>;


    
    return (
        <div className="sidebar-paciente">

            <section className="container-consultas">
                <header className="header-consultas">
                    <h2>Próximas consultas</h2>
                </header>
            </section>

            <section className="acoes-sidebar">
                <Link
                    to={`/${user.tipo}/agenda`}
                    className="button-confirm button-sidebar"
                >
                    Minhas Consultas
                </Link>

                <Link
                    to={`/${user.tipo}/perfil/configuracoes`}
                    className="button-confirm button-sidebar"
                >
                    Configurações
                </Link>

                <Logout />
            </section>
        </div>
    );
}