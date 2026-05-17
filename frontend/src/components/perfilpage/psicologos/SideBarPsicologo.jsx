import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

import {
    HiOutlineArrowRight,
    HiOutlineCheck
} from "react-icons/hi";

import "../../../assets/styles/perfil/sidebar.css";

import { Link } from "react-router-dom";
import Logout from "../Logout.jsx";

export default function SideBarPsicologo({ profileData }) {

    const { user } = useAuth();

    if (!profileData) return <p>Carregando...</p>;

    const consultasPendentes = [
        {
            id: 1,
            data: "16 de Abril",
            paciente: "Marcos",
            horario: "9:00 h"
        },
        {
            id: 2,
            data: "20 de Abril",
            paciente: "Luciana",
            horario: "9:00 h"
        },
        {
            id: 3,
            data: "03 de Maio",
            paciente: "Vera",
            horario: "9:00 h"
        }
    ];

    // IDS DOS CHECKBOXES MARCADOS
    const [selecionados, setSelecionados] = useState([]);

    // VERIFICA SE TODOS ESTÃO MARCADOS
    const todosSelecionados =
        selecionados.length === consultasPendentes.length;

    // MARCAR / DESMARCAR TODOS
    const handleSelecionarTodos = () => {

        if (todosSelecionados) {
            setSelecionados([]);
        } else {
            setSelecionados(
                consultasPendentes.map((consulta) => consulta.id)
            );
        }
    };

    // MARCAR INDIVIDUAL
    const handleSelecionarConsulta = (id) => {

        if (selecionados.includes(id)) {
            setSelecionados(
                selecionados.filter((item) => item !== id)
            );
        } else {
            setSelecionados([...selecionados, id]);
        }
    };

    return (
        <aside className="sidebar-psicologo">

            {/* CONSULTAS */}
            <section className="container-consultas">

                <header className="header-consultas">
                    <h2>Consultas pendentes</h2>
                </header>

                {/* TOPO */}
                <div className="acoes-consultas">

                    <label className="confirmar-todos">

                        <input
                            type="checkbox"
                            checked={todosSelecionados}
                            onChange={handleSelecionarTodos}
                        />

                        <span className="checkbox-custom">
                            <HiOutlineCheck />
                        </span>

                        <p>Confirmar todos</p>

                    </label>

                    <button className="button-confirm">
                        Agendar
                    </button>

                </div>

                {/* LISTA */}
                <ul className="lista-consultas">

                    {consultasPendentes.map((consulta) => (

                        <li
                            key={consulta.id}
                            className="card-consulta"
                        >

                            <label className="checkbox-consulta">

                                <input
                                    type="checkbox"
                                    checked={selecionados.includes(consulta.id)}
                                    onChange={() =>
                                        handleSelecionarConsulta(consulta.id)
                                    }
                                />

                                <span className="checkbox-custom">
                                    <HiOutlineCheck />
                                </span>

                            </label>

                            <div className="infos-consulta">

                                <h3>{consulta.data}</h3>

                                <p>
                                    Paciente: {consulta.paciente}
                                </p>

                                <span>{consulta.horario}</span>

                            </div>

                            <button className="btn-ver-consulta">
                                <HiOutlineArrowRight />
                            </button>

                        </li>
                    ))}
                </ul>

            </section>

            {/* BOTÕES */}
            <section className="acoes-sidebar">

                <Link
                    to="/adicionar-artigos"
                    className="button-confirm button-sidebar"
                >
                    Criar Artigos
                </Link>

                <Link
                    to={`/${user.tipo}/perfil/configuracoes`}
                    className="button-confirm button-sidebar"
                >
                    Configurações
                </Link>

                <Logout />

            </section>

        </aside>
    );
}