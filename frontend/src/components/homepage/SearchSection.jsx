import { HiOutlineSearch } from "react-icons/hi";
import { HiOutlineCalendarDays } from "react-icons/hi2";

import Filtro from "./Filtro.jsx";
import Visualizacao from "./Visualizacao.jsx";

export default function SearchSection({
    selectedSpecialities,
    setSelectedSpecialities,

    selectedLocals,
    setSelectedLocals,
    locais,

    selectedDays,
    setSelectedDays,

    visualizacao,
    setVisualizacao,

    searchText,
    setSearchText
}) {

    const specialities = [
        "Ansiedade",
        "Casais",
        "Conflitos Familiares",
        "Insônia",
        "Dependência Química",
        "Burnout",
    ];

    const diasSemana = [
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado",
        "Domingo",
    ];

    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    return (
        <section className="section-filter section-filters-searchbox">

            {/* Barra de pesquisa */}
            <div className="search-boxes">
                <form className="search-form">
                    <input
                        type="text"
                        id="search-input"
                        placeholder="Dra. Maria"
                        value={searchText}
                        onChange={handleSearch}
                    />

                    <button
                        type="submit"
                        className="button-confirm button-search search-button"
                    >
                        <HiOutlineSearch className="icon-ui-button-search" />
                    </button>
                </form>
            </div>

            {/* Filtros */}
            <div className="search-filters">
                <div className="search-filters-top">
                    <div className="filter-item">
                        <label>Localidade:</label>
                        <Filtro
                            titulo="São Paulo"
                            opcoes={locais}
                            selecionados={selectedLocals}
                            setSelecionados={setSelectedLocals}
                        />
                    </div>

                    <div className="filter-item">
                        <label>Cidade:</label>
                        <Filtro
                            titulo="SP"
                            opcoes={["SP", "RJ", "MG"]}
                            selecionados={selectedSpecialities}
                            setSelecionados={setSelectedSpecialities}
                        />
                    </div>

                    <div className="search-visualizacao">
                        <Visualizacao
                            visualizacao={visualizacao}
                            setVisualizacao={setVisualizacao}
                        />
                    </div>
                </div>

                <div className="search-filters-bottom">
                    <div className="filter-item">
                        <label>Semana:</label>
                        <Filtro
                            titulo="Segunda-feira"
                            opcoes={diasSemana}
                            selecionados={selectedDays}
                            setSelecionados={setSelectedDays}
                        />
                    </div>

                    <div className="filter-item horario-item">
                        <label>Horario:</label>
                        <div className="input-horario
                        btn-searchbox">
                            <HiOutlineCalendarDays className="icon-horario " />
                            <input
                                type="time"
                                defaultValue="09:00"
                            />
                        </div>
                    </div>

                    <div className="filter-item">
                        <label>Genero:</label>
                        <Filtro
                            titulo="Masculino"
                            opcoes={[
                                "Masculino",
                                "Feminino",
                                "Outro"
                            ]}
                            selecionados={[]}
                            setSelecionados={() => { }}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}