import "../assets/styles/listaclientes/listaclientes.css";
import "../assets/styles/home/filtros-home.css";
import { useState, useEffect } from "react";
import { HiOutlineSearch, HiChevronRight } from "react-icons/hi";
import CardClientes from "../components/cards/CardClientes";
import Filtro from "../components/homepage/Filtro.jsx";
import { useAuth } from "../context/AuthContext";
import { listarClientesDoPsicologo } from "../services/prontuarioService";

export default function ListaClientes() {
    const { user } = useAuth();
    const [searchText, setSearchText] = useState("");
    const [statusSelecionados, setStatusSelecionados] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClientes = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const data = await listarClientesDoPsicologo(user.id);

                // Ordenar no frontend: mais recentes primeiro
                const sortedData = [...data].sort((a, b) => {
                    const dateA = a.primeiraConsulta || "";
                    const dateB = b.primeiraConsulta || "";
                    return dateB.localeCompare(dateA);
                });

                // Mapear campos do DTO para o que o componente espera
                const mappedData = sortedData.map(c => ({
                    idProntuario: c.pacienteId,
                    foto: c.imgPerfil,
                    nome: c.nome,
                    status: c.status,
                    email: c.email,
                    dataInicio: c.primeiraConsulta ? c.primeiraConsulta.split("-").reverse().join("/") : "N/A"
                }));
                setClientes(mappedData);
            } catch (err) {
                console.error("Erro ao carregar clientes:", err);
                setError("Não foi possível carregar a lista de clientes.");
            } finally {
                setLoading(false);
            }
        };

        fetchClientes();
    }, [user]);

    const statusOptions = ["Ativo", "Pendente", "Inativo"];

    const handleSearch = (e) => {
        setSearchText(e.target.value);
    }

    const clientesFiltrados = clientes.filter(cliente => {
        const matchTexto =
            searchText.trim() === "" ||
            cliente.nome.toLowerCase().includes(searchText.toLowerCase());

        const matchStatus =
            statusSelecionados.length === 0 ||
            statusSelecionados.includes(cliente.status);

        return matchTexto && matchStatus;
    });

    const titulo="Status"
    const opcao=["Pendente", "Ativo", "Inativo"]


    const [open, setOpen] = useState(false);
    
    const toggleFilter = () => setOpen(!open);



    return (
        <>
            <div className="container-search-clientes">
                <section className="search-boxes">
                    <form className="search-form">
                        <input
                            type="text"
                            id="search-input"
                            placeholder="Pesquisar por nome do cliente..."
                            value={searchText}
                            onChange={handleSearch}
                            className="search-input"
                        />
                        <button type="submit" className="search-button">
                            <HiOutlineSearch className="search-icon" />
                        </button>
                    </form>
                    <div className="filtro listaclientes">
                        <button type="button" className="btn-searchbox btn-listaclientes " onClick={toggleFilter}>
                            {titulo}
                            <HiChevronRight
                                className="seta-filtro"
                                style={{
                                    transform: open ? "rotate(90deg)" : "rotate(0deg)",
                                    transition: "0.3s",
                                }}
                            />
                        </button>

                        {open && (
                            <div className="checkbox-filter">
                                {opcoes.map((opcao, i) => (
                                    <label key={i} className="checkbox-input">
                                        <input
                                            type="checkbox"
                                            checked={selecionados.includes(opcao)}
                                            onChange={() => handleCheckboxChange(opcao)}
                                        />
                                        <span className="titulo-checkbox">{opcao}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                <main className="list-clientes">
                    <div className="cabecalho-lista-clientes">
                        <p>Cliente</p>
                        <p>Status</p>
                        <p>Email</p>
                        <p>Data de Inicio</p>
                        <p>Prontuários</p>
                    </div>

                    <div className="clientes-container">
                        {loading ? (
                            <div className="loading-container"><p>Carregando clientes...</p></div>
                        ) : error ? (
                            <div className="error-container"><p>{error}</p></div>
                        ) : clientesFiltrados.length === 0 ? (
                            <div className="empty-container"><p>Nenhum cliente encontrado.</p></div>
                        ) : (
                            clientesFiltrados.map((cliente, index) => (
                                <CardClientes
                                    key={index}
                                    cliente={cliente}
                                />
                            ))
                        )}
                    </div>
                </main>
            </div>
        </>
    )
}
