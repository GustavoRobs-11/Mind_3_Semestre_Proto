import { HiChevronRight } from "react-icons/hi";

export default function CardProntuario({
    sessoesProntuario,
    openCard,
    setOpenCard,
    index,
    prontuarioAtual,
    updateSessao
}) {

    const isOpen = openCard === index;

    const handleToggle = () => {
        setOpenCard(isOpen ? null : index);
    };

  return (
    <>
        <div className="card-prontuario-detalhes">
            <div 
                className={`card-prontuario-header ${isOpen ? "open" : "closed"}`}
                onClick={() => handleToggle()}>
                <div>
                    <h4>{sessoesProntuario.titulo}</h4>
                    <p>{sessoesProntuario.descricao}</p>
                </div>
                <HiChevronRight className="arrow-prontuario"/>
            </div>
            <div className={`card-prontuario-notes ${isOpen ? "open" : "closed"}`}>
                <textarea value={prontuarioAtual?.informacoes || ""}
                    placeholder="Digite as anotações..."
                    onChange={(e) => updateSessao(e.target.value)}>
                </textarea>
            </div>
        </div>
    </>
  )
}
