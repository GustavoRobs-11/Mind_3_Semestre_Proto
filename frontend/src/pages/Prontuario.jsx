import "../assets/styles/prontuario/prontuario.css";
import "../assets/styles/listaclientes/listaclientes.css";
import perfil from "../assets/img/perfil-default.png";
import AreaProntuario from "../components/prontuario/AreaProntuario";
import HistoricoAtendimentos from "../components/prontuario/HistoricoAtendimentos";
import { useState } from "react";

export default function Prontuario() {
    // Mock de dados
    const cliente = {
            idProntuario: 1,
            foto: "/path/to/foto.jpg",
            nome: "Amara Silva",
            idade: 25,
            local: "São Paulo, SP",
            status: "Ativo",
            email: "amara.silva@example.com",
            dataInicio: "2023-01-01",
            qtd_atendimentos: 3
    }
    const atendimentoMock = [
        {
            id: 1,
            data: "15/05/2026",
            hasProntuario: true,
            relatorioTecnico: "Notas do dia 15 de Maio, Lembrete da sessão:",
            prontuario: [
                {
                    sessaoId: 1,
                    informacoes: "Paciente relata episódios recentes de ansiedade relacionados ao ambiente de trabalho."
                },
                {
                    sessaoId: 2,
                    informacoes: "Definido acompanhamento semanal para manejo emocional."
                },
                {
                    sessaoId: 3,
                    informacoes: ""
                },
                {
                    sessaoId: 4,
                    informacoes: ""
                }
            ],
            informacoesAdicionais: "Paciente demonstrou boa adesão às orientações."
        },
        {
            id: 2,
            data: "08/05/2026",
            hasProntuario: true,
            relatorioTecnico: "",
            prontuario: [
                {
                    sessaoId: 1,
                    informacoes: "Queixa principal relacionada à dificuldade de concentração."
                },
                {
                    sessaoId: 2,
                    informacoes: "Objetivo inicial focado em organização de rotina."
                },
                {
                    sessaoId: 3,
                    informacoes: "Realizada escuta ativa e levantamento de hábitos."
                },
                {
                    sessaoId: 4,
                    informacoes: ""
                }
            ],
            informacoesAdicionais: ""
        },
        {
            id: 3,
            data: "01/05/2026",
            hasProntuario: false,
            relatorioTecnico: "",
            prontuario: [],
            informacoesAdicionais: ""
        },
        {
            id: 4,
            data: "25/04/2026",
            hasProntuario: true,
            relatorioTecnico: "",
            prontuario: [
                {
                    sessaoId: 1,
                    informacoes: "Paciente relata conflitos familiares recorrentes."
                },
                {
                    sessaoId: 2,
                    informacoes: "Definido fortalecimento de habilidades comunicativas."
                },
                {
                    sessaoId: 3,
                    informacoes: "Trabalhada identificação de gatilhos emocionais."
                },
                {
                    sessaoId: 4,
                    informacoes: ""
                }
            ],
            informacoesAdicionais: "Paciente apresentou melhora na comunicação."
        },
    ];

    const [prontuarioAtual, setProntuarioAtual] = useState(null);
    const [atendimentos, setAtendimento] = useState(atendimentoMock);

    const criarProntuario = (data) => {
        const prontuarioVazio = [
            {
                sessaoId: 1,
                informacoes: ""
            },
            {
                sessaoId: 2,
                informacoes: ""
            },
            {
                sessaoId: 3,
                informacoes: ""
            },
            {
                sessaoId: 4,
                informacoes: ""
            }
        ];

        setAtendimento((prev) => prev.map((at) =>
            at.data === data ? {
                ...at,
                hasProntuario: true,
                prontuario: prontuarioVazio,
                informacoesAdicionais: ""
                }
                : at
            )
        );

        const atendimentoAtualizado = atendimentos.find(
            (at) => at.data === data
        );

        setProntuarioAtual({
            ...atendimentoAtualizado,
            hasProntuario: true,
            prontuario: prontuarioVazio,
            informacoesAdicionais: ""
        });
    };

    const abrirProntuario = (atendimentoData) => {
        const prontuarioSelecionado = atendimentos.find((at) => at.data === atendimentoData);
        setProntuarioAtual(prontuarioSelecionado);
    };

    const formatarData = (data, tipo = "curta") => {
        if (!data) return "";
        const meses = [
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro"
        ];

        const [dia, mes, ano] = data.split("/");
        if (!dia || !mes || !ano) return data;

        const nomeMes = meses[Number(mes) - 1];

        if (tipo === "curta") {
            return `${nomeMes.length > 5 ? nomeMes.substring(0, 3) : nomeMes} ${dia}`;
        }

        return `${dia} de ${nomeMes} de ${ano}`;
    }

    // Salvar no backend as informações
    const salvarProntuario = async () => {
        if (!prontuarioAtual) return;

        const dados = {
            clienteId: cliente.idProntuario,
            atendimentoId: prontuarioAtual.id,
            prontuario: prontuarioAtual.prontuario,
            informacoesAdicionais:
                prontuarioAtual.informacoesAdicionais,
            relatorioTecnico:
                prontuarioAtual.relatorioTecnico
        };
    };
    
    return (
    <>
        <div className="container-prontuario-page">
            <main className="container-prontuario">
                <div className="dados-paciente">
                    <img 
                        src={cliente.foto || perfil} 
                        alt={`Foto de perfil paciente: ${cliente.nome}`}
                        onError={(e) => {
                            e.target.src = perfil;
                        }}/>
                    <div>
                        <h2>{cliente.nome}</h2>
                        <p><span>Idade:</span> {cliente.idade} anos</p>
                        <p><span>Local:</span> {cliente.local}</p>
                        <p><span>Primeira consulta:</span> {cliente.dataInicio}</p>
                        <p><span>Atendimentos:</span> {cliente.qtd_atendimentos}</p>
                    </div>
                    <p className={`status-tag status-${cliente.status.toLowerCase()}`}>{cliente.status}</p>
                </div>
                <AreaProntuario 
                    formatarData={formatarData}
                    prontuarioAtual={prontuarioAtual}
                />
            </main>

            <HistoricoAtendimentos 
                formatarData={formatarData}
                abrirProntuario={abrirProntuario}
                criarProntuario={criarProntuario}
                atendimentos={atendimentos}
                setAtendimento={setAtendimento}
            />
        </div>
    </>
  )
}
