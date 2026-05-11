import "../assets/styles/listaclientes/listaclientes.css";
import "../assets/styles/home/filtros-home.css";
import { useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import CardClientes from "../components/cards/CardClientes";
import Filtro from "../components/homepage/Filtro";

export default function ListaClientes() {
    const [searchText, setSearchText] = useState("");
    const [statusSelecionados, setStatusSelecionados] = useState([]);

    // Mock de dados de clientes
    const clientes = [
        {
            idProntuario: 1,
            foto: "/path/to/foto.jpg",
            nome: "Amara Silva",
            status: "Ativo",
            email: "amara.silva@example.com",
            dataInicio: "2023-01-01"
        },
        {
            idProntuario: 2,
            foto: "/path/to/foto.jpg",
            nome: "Lira Costa",
            status: "Inativo",
            email: "lira.costa@example.com",
            dataInicio: "2023-01-01"
        },
        {
            idProntuario: 3,
            foto: "/path/to/foto.jpg",
            nome: "Snoopy",
            status: "Ativo",
            email: "snoopy@example.com",
            dataInicio: "2023-01-01"
        },
        {
            idProntuario: 4,
            foto: "/path/to/foto.jpg",
            nome: "Marcos Silva",
            status: "Pendente",
            email: "marcos.silva@example.com",
            dataInicio: "2023-01-01"
        },
        {
            idProntuario: 5,
            foto: "/path/to/foto.jpg",
            nome: "Carlos Matheus",
            status: "Ativo",
            email: "carlos.matheus@example.com",
            dataInicio: "2023-01-01"
        },
        {
            idProntuario: 6,
            foto: "/path/to/foto.jpg",
            nome: "Luis Alcantara",
            status: "Inativo",
            email: "luis.alcantara@example.com",
            dataInicio: "2023-01-01"
        },
        {
            idProntuario: 7,
            foto: "/path/to/foto.jpg",
            nome: "Heugenia Silva",
            status: "Ativo",
            email: "heugenia.silva@example.com",
            dataInicio: "2023-01-01"
        },
        {
            idProntuario: 8,
            foto: "/path/to/foto.jpg",
            nome: "Marcos Santos",
            status: "Inativo",
            email: "marcos.santos@example.com",
            dataInicio: "2023-01-01"
        },
    ];
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
                        />
                        <button type="submit" className="button-confirm button-search">
                            <HiOutlineSearch className="icon-ui-button-search"/>
                        </button>
                    </form>
                    <Filtro 
                        titulo="Status"
                        opcoes={statusOptions}
                        selecionados={statusSelecionados}
                        setSelecionados={setStatusSelecionados}
                    />
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
                        {clientesFiltrados.map((cliente, index) => (
                            <CardClientes
                                key={index}
                                cliente={cliente}
                            />
                        ))}
                    </div>
                </main>
            </div>
        </>
    )
}
