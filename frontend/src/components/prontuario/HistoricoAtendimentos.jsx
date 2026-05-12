import "../../assets/styles/prontuario/historico-atendimento.css"
import "../../assets/styles/home/filtros-home.css";
import {
  HiOutlineDocumentText,
  HiChevronDown,
  HiPlus,
  HiOutlineSearch
} from "react-icons/hi";
import { useState } from "react";

export default function HistoricoAtendimentos({
    abrirProntuario,
    criarProntuario,
    formatarData,
    atendimentos,
    setAtendimentos
}) {
    const [openId, setOpenId] = useState(1);
    const [searchText, setSearchText] = useState("");

    const toggleAccordion = (id) => {
        setOpenId(openId === id ? null : id);
    };

    const handleTextoChange = (id, value) => {
        setAtendimentos((prev) =>
            prev.map((at) =>
                at.id === id
                    ? { ...at, relatorioTecnico: value }
                    : at
            )
        );
    };

    const handleSearch = (e) => {
        setSearchText(e.target.value);
    }

    const atendimentosFiltrados = atendimentos.filter((at) => {
        return (
            searchText.trim() === "" ||
            at.relatorioTecnico
                .toLowerCase()
                .includes(searchText.toLowerCase())
        );
    });

    return (
        <>
        <section className="historico-atendimentos" id="historicoAtendimentoInfo">
            <section className="search-prontuario">
                <form className="search-form">
                    <input
                        type="text"
                        id="search-input"
                        placeholder="Pesquisar por palavra chave..."
                        value={searchText}
                        onChange={handleSearch}
                    />
                    <button type="submit" className="button-confirm button-search">
                        <HiOutlineSearch className="icon-ui-button-search"/>
                    </button>
                </form>
            </section>

            <div className="timeline-line"></div>

            {atendimentosFiltrados.map((item) => (
                <div className="timeline-item" key={item.id}>

                    <div className="timeline-date">
                        <span>{formatarData(item.data, "curta")}</span>
                    </div>

                    <div className="accordion-card">
                        <div className={`accordion-header ${ openId === item.id ? "open" : "" }`} onClick={() => toggleAccordion(item.id)}>
                            <div className="accordion-title">
                                {item.hasProntuario ? (
                                        <>
                                        <button 
                                            className="icon-header view-prontuario"
                                            onClick={() => abrirProntuario(item.data)}>
                                            <HiOutlineDocumentText /> 
                                        </button>
                                        <span>Visualizar prontuário do dia</span>
                                        </>
                                    ) : (
                                        <>
                                        <button 
                                            className="icon-header add-prontuario"
                                            onClick={() => criarProntuario(item.data)}>
                                            <HiPlus /> 
                                        </button>
                                        <span >Adicionar prontuário do dia</span>
                                        </>
                                )}

                                <span className={`status-tag status-${item.status.toLowerCase()}`} style={{ fontSize: '0.7rem', padding: '2px 8px', marginLeft: '10px' }}>
                                    {item.status}
                                </span>

                                <span>{item.titulo}</span>
                            </div>

                            <HiChevronDown className="accordion-arrow" />
                        </div>

                        <div className={`accordion-content ${ openId === item.id ? "show" : "" }`}>
                            <div className="card-prontuario-notes">
                                <textarea 
                                    value={item.relatorioTecnico}
                                    onChange={(e) =>
                                        handleTextoChange(item.id, e.target.value)
                                    }>
                                </textarea>
                            </div>
                        </div>

                    </div>
                </div>
            ))}
        </section>
        </>
    )
}
