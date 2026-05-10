import { useEffect, useState } from "react";
import { HiOutlineClipboardList } from "react-icons/hi";
import CardProntuario from "../cards/CardProntuario";

export default function AreaProntuario({
    formatarData,
    prontuarioAtual,
}) {
    const [openCard, setOpenCard] = useState(null);
    const [loadingTransition, setLoadingTransition] = useState(false);

    useEffect(() => {
        if (!prontuarioAtual) return;
        setLoadingTransition(true);

        const timer = setTimeout(() => {
            setLoadingTransition(false);
        }, 250);

        return () => clearTimeout(timer);
    }, [prontuarioAtual]);

    if (!prontuarioAtual) {
        return (
            <div className="paciente-prontuario-view">
                <HiOutlineClipboardList size="2.2rem"/>
                <p>Selecione um prontuário</p>
            </div>
        );
    }

    if (loadingTransition) {
        return (
            <div className="paciente-prontuario-view">
                <HiOutlineClipboardList size="2.2rem"/>
                <p>Carregando prontuário...</p>
            </div>
        );
    }

    const sessoesProntuario = [
        {
            id: 1,
            titulo: "Identificação do usuário/instituição",
            descricao: "Descrição da queixa inicial, motivos da busca pelo atendimento e hipótese diagnóstica inicial, se houver.",
            informacoes: ""
        },
        {
            id: 2,
            titulo: "Avaliação da demanda e definição de objetivos",
            descricao: "Descrição das razões que motivaram a busca pelo serviço ou assistência psicológica, juntamente a aparesentção da modalidade de assistência prestada.",
            informacoes: ""
        },
        {
            id: 3,
            titulo: "Registro de evolução e Procedimentos técnico-científicos",
            descricao: "Descrição das atividades realizadas, bem como intervenções, técnicas e abordagens teóricas utilizadas.",
            informacoes: ""
        },
        {
            id: 4,
            titulo: "Registro de encaminhamento ou encerramento",
            descricao: "Registro sobre encaminhamentos para outros profissionais ou o motivo do encerramento do caso.",
            informacoes: ""
        }
    ]

    return (
        <>
        <div className="paciente-prontuario">
            {}
            <h3>Prontuario: {formatarData(prontuarioAtual.data, "longa")}</h3>
            <p>Informações requeridas pelo CFP</p>
            <div className="area-prontuario">
                <div>
                    {sessoesProntuario.map((sessao, index) => (
                        <CardProntuario
                            key={index}
                            sessoesProntuario={sessao}
                            openCard={openCard}
                            setOpenCard={setOpenCard}
                            index={index}
                            prontuarioAtual={
                                prontuarioAtual.prontuario.find(
                                    (p) => p.sessaoId === sessao.id
                                ) || null
                            }
                        />
                    ))}
                </div>
                <p className="info-add">Informações adicionais</p>
                <div className="card-prontuario-notes">
                    <textarea name="" id=""></textarea>
                </div>
            </div>
            <a href="https://site.cfp.org.br/wp-content/uploads/2025/11/Manual_Orientativo.pdf" target="_blank">
                <p className="link-manual">Manual Orientativo</p>
            </a>
            <div className="actions-prontuario">
                <div>
                    <button 
                        className="button-progress-confirm">Registrar assinatura eletrônica</button>
                    <button className="button-progress-confirm">Baixar documento</button>
                </div>
                <button className="button-confirm">Salvar Sessão</button>
            </div>
        </div>
        </>
    )
}
