import { useEffect, useState } from "react";
import { HiOutlineClipboardList } from "react-icons/hi";
import CardProntuario from "../cards/CardProntuario";
import React from 'react';
import {
    Briefcase,
    Music,
    Sparkles,
    ShoppingCart,
    Utensils,
    Bed,
    BookOpen,
    ChevronDown
} from 'lucide-react'

export default function AreaProntuario({
    formatarData,
    prontuarioAtual,
    setProntuarioAtual,
    salvarProntuario
}) {
    const [openCard, setOpenCard] = useState(null);
    const [loadingTransition, setLoadingTransition] = useState(false);
    const [abaAtiva, setAbaAtiva] = useState("prontuario");

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
                <HiOutlineClipboardList size="2.2rem" />
                <p>Selecione um prontuário</p>
            </div>
        );
    }

    if (loadingTransition) {
        return (
            <div className="paciente-prontuario-view">
                <HiOutlineClipboardList size="2.2rem" />
                <p>Carregando prontuário...</p>
            </div>
        );
    }

    const sessoesProntuario = [
        {
            id: 1,
            titulo: "Identificação do usuário/instituição",
            descricao:
                "Descrição da queixa inicial, motivos da busca pelo atendimento e hipótese diagnóstica inicial, se houver.",
            informacoes: ""
        },
        {
            id: 2,
            titulo: "Avaliação da demanda e definição de objetivos",
            descricao:
                "Descrição das razões que motivaram a busca pelo serviço ou assistência psicológica, juntamente a apresentação da modalidade de assistência prestada.",
            informacoes: ""
        },
        {
            id: 3,
            titulo: "Registro de evolução e Procedimentos técnico-científicos",
            descricao:
                "Descrição das atividades realizadas, bem como intervenções, técnicas e abordagens teóricas utilizadas.",
            informacoes: ""
        },
        {
            id: 4,
            titulo: "Registro de encaminhamento ou encerramento",
            descricao:
                "Registro sobre encaminhamentos para outros profissionais ou o motivo do encerramento do caso.",
            informacoes: ""
        }
    ];

    return (
        <>
            {/* NAVBAR ABAS */}
            <div className="navbar-pruntuario-diario">
                <button
                    className={abaAtiva === "prontuario" ? "active" : "desactive"}
                    onClick={() => setAbaAtiva("prontuario")}
                >
                    Prontuário
                </button>

                <button
                    className={abaAtiva === "diario" ? "active" : "desactive"}
                    onClick={() => setAbaAtiva("diario")}
                >
                    Diário
                </button>
            </div>

            {/* PRONTUÁRIO */}
            {abaAtiva === "prontuario" && (
                <div className="paciente-prontuario" id="pacienteProntuarioInfo">
                    <h3>
                        Prontuario:{" "}
                        {formatarData(prontuarioAtual.data, "longa")}
                    </h3>

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
                                    updateSessao={(val) => {
                                        setProntuarioAtual((prev) => ({
                                            ...prev,
                                            prontuario: prev.prontuario.map((p) =>
                                                p.sessaoId === sessao.id
                                                    ? { ...p, informacoes: val }
                                                    : p
                                            )
                                        }));
                                    }}
                                />
                            ))}
                        </div>

                        <p className="info-add">Informações adicionais</p>

                        <div className="card-prontuario-notes">
                            <textarea
                                value={
                                    prontuarioAtual.informacoesAdicionais ||
                                    ""
                                }
                                onChange={(e) =>
                                    setProntuarioAtual((prev) => ({
                                        ...prev,
                                        informacoesAdicionais:
                                            e.target.value
                                    }))
                                }
                            />
                        </div>
                    </div>

                    <a
                        href="https://site.cfp.org.br/wp-content/uploads/2025/11/Manual_Orientativo.pdf"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <p className="link-manual">
                            Manual Orientativo
                        </p>
                    </a>

                    <div className="actions-prontuario">
                        <div>
                            <button className="button-progress-confirm">
                                Registrar assinatura eletrônica
                            </button>

                            <button className="button-progress-confirm">
                                Baixar documento
                            </button>
                        </div>

                        <button
                            className="button-confirm"
                            onClick={salvarProntuario}
                        >
                            Salvar Sessão
                        </button>
                    </div>
                </div>
            )}

            {/* DIÁRIO */}
            {abaAtiva === "diario" && (
                <div className="dashboard-container">

                    {/* SEÇÃO SUPERIOR */}
                    <div className="top-grid">

                        {/* CARD: GERENCIAMENTO DIÁRIO */}
                        <div className="dashboard-card">
                            <h3>Gerenciamento diário</h3>

                            <div className="graph-section">
                                {/* Gráfico Semicírculo via SVG matemático puro */}
                                <div className="arc-wrapper">
                                    <svg viewBox="0 0 100 50" className="arc-svg">
                                        {/* Arco Verde (16%) */}
                                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#a3e635" strokeWidth="11" strokeDasharray="20.1 125.6" strokeDashoffset="0" transform="rotate(180 50 50)" />
                                        {/* Arco Amarelo (25%) */}
                                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#fde047" strokeWidth="11" strokeDasharray="31.4 125.6" strokeDashoffset="-20.1" transform="rotate(180 50 50)" />
                                        {/* Arco Laranja (40%) */}
                                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#fed7aa" strokeWidth="11" strokeDasharray="50.2 125.6" strokeDashoffset="-51.5" transform="rotate(180 50 50)" />
                                        {/* Arco Vermelho (19%) */}
                                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f87171" strokeWidth="11" strokeDasharray="23.9 125.6" strokeDashoffset="-101.7" transform="rotate(180 50 50)" />
                                    </svg>

                                    <span className="pct-label pct-16">16%</span>
                                    <span className="pct-label pct-25">25%</span>
                                    <span className="pct-label pct-40">40%</span>
                                    <span className="pct-label pct-19">19%</span>
                                </div>

                                {/* Grid Lateral de Carinhas */}
                                <div className="emoji-grid">
                                    <div className="emoji-box green">😄</div>
                                    <div className="emoji-box red">🙁</div>
                                    <div className="emoji-box active">🙂</div>
                                    <div className="emoji-box orange">😡</div>
                                    <div className="emoji-box orange neutral">😐</div>
                                </div>
                            </div>
                        </div>

                        {/* CARD: POR HUMOR */}
                        <div className="dashboard-card">
                            <div>
                                <h3>Por humor</h3>

                                <div className="select-wrapper">
                                    <div className="custom-select">
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>😐 Neutro</span>
                                        <ChevronDown size={16} style={{ color: '#6b7280' }} />
                                    </div>
                                </div>

                                <table className="mood-table">
                                    <thead>
                                        <tr>
                                            <th>Ações</th>
                                            <th className="text-right">Frequência</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <span className="activity-tag">
                                                    <Briefcase size={14} /> Trabalho
                                                </span>
                                            </td>
                                            <td className="text-right">20x</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span className="activity-tag">
                                                    <Music size={14} /> Música
                                                </span>
                                            </td>
                                            <td className="text-right">15x</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span className="activity-tag">
                                                    <Sparkles size={14} /> Faxina
                                                </span>
                                            </td>
                                            <td className="text-right">10x</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* SEÇÃO INFERIOR */}
                    <div className="bottom-grid">

                        {/* CARD: DIÁRIO MAIS RECENTES */}
                        <div className="dashboard-card">
                            <div>
                                <h3>Diário mais recentes:</h3>
                                <div className="note-block">
                                    <div className="emoji-box active" style={{ width: '56px', height: '56px', fontSize: '1.8rem', flexShrink: 0 }}>
                                        🙂
                                    </div>
                                    <p>
                                        Indica um estado de humor positivo e estável, demonstrando bem-estar,
                                        disposição e uma percepção geral agradável ao longo do momento ou
                                        atividade realizada.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h4>Atividades recentes:</h4>
                                <div className="tag-container">
                                    <span className="activity-tag"><ShoppingCart size={14} /> Compra</span>
                                    <span className="activity-tag"><Utensils size={14} /> Boa refeição</span>
                                    <span className="activity-tag"><Bed size={14} /> Descanso</span>
                                </div>
                            </div>
                        </div>

                        {/* CARD: MELHOR SEQUÊNCIA */}
                        <div className="dashboard-card">
                            <div>
                                <h3>Melhor sequência de dias</h3>
                                <div className="streak-block">
                                    <div className="emoji-box active" style={{ width: '56px', height: '56px', fontSize: '1.8rem' }}>
                                        🙂
                                    </div>
                                    <div className="streak-info">
                                        <strong>3 dias</strong>
                                        <p>1 de Abril - 3 de Abril</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4>Atividades durante a sequência de dias</h4>
                                <div className="tag-container">
                                    <span className="activity-tag"><ShoppingCart size={14} /> Compra</span>
                                    <span className="activity-tag"><Bed size={14} /> Descanso</span>
                                    <span className="activity-tag"><BookOpen size={14} /> Leitura</span>
                                    <span className="activity-tag"><Music size={14} /> Música</span>
                                    <span className="activity-tag"><Utensils size={14} /> Boa refeição</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}