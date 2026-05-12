import "../assets/styles/prontuario/prontuario.css";
import "../assets/styles/listaclientes/listaclientes.css";
import perfil from "../assets/img/perfil-default.png";
import AreaProntuario from "../components/prontuario/AreaProntuario";
import HistoricoAtendimentos from "../components/prontuario/HistoricoAtendimentos";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { buscarPorId } from "../services/pacienteService";
import { listarDoPacienteEPsicologo } from "../services/agendaService";
import { 
    listarProntuariosPorPaciente, 
    buscarProntuarioPorAgenda, 
    salvarProntuario as salvarProntuarioAPI 
} from "../services/prontuarioService";

export default function Prontuario() {
    const { idProntuario } = useParams(); // id do paciente
    const { user } = useAuth(); // psicologo logado
    
    const [cliente, setCliente] = useState(null);
    const [atendimentos, setAtendimentos] = useState([]);
    const [prontuarioAtual, setProntuarioAtual] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!idProntuario || !user) return;
            try {
                setLoading(true);
                // 1. Buscar dados do paciente
                const pacData = await buscarPorId(idProntuario);
                
                // 2. Buscar agendas e prontuários
                const [agendas, prontuarios] = await Promise.all([
                    listarDoPacienteEPsicologo(idProntuario, user.id),
                    listarProntuariosPorPaciente(idProntuario, user.id)
                ]);

                // 3. Cruzar dados para montar a lista de atendimentos
                const mappedAtendimentos = agendas
                    .sort((a, b) => new Date(b.data) - new Date(a.data)) // Mais recente primeiro
                    .map(ag => {
                        const pront = prontuarios.find(p => p.agendaId === ag.id);
                        return {
                            id: ag.id,
                            data: ag.data.split("-").reverse().join("/"), // yyyy-mm-dd -> dd/mm/yyyy
                            rawDate: ag.data,
                            status: ag.status,
                            hasProntuario: !!pront,
                            relatorioTecnico: pront ? pront.relatorioTecnico : "",
                            informacoesAdicionais: pront ? pront.informacoesAdicionais : "",
                            prontuario: pront ? [
                                { sessaoId: 1, informacoes: pront.sessao1 || "" },
                                { sessaoId: 2, informacoes: pront.sessao2 || "" },
                                { sessaoId: 3, informacoes: pront.sessao3 || "" },
                                { sessaoId: 4, informacoes: pront.sessao4 || "" },
                            ] : []
                        };
                    });

                setCliente({
                    idProntuario: pacData.id,
                    foto: pacData.imgPerfil,
                    nome: `${pacData.nome} ${pacData.sobrenome}`,
                    idade: pacData.idade,
                    local: (pacData.cidade && pacData.uf) ? `${pacData.cidade}, ${pacData.uf}` : "Não informado",
                    status: mappedAtendimentos.some(a => a.status === "CONFIRMADO" || a.status === "PENDENTE" || a.status === "REALIZADO") ? "Ativo" : "Inativo",
                    email: pacData.email,
                    dataInicio: mappedAtendimentos.length > 0 ? mappedAtendimentos[mappedAtendimentos.length - 1].data : "N/A",
                    qtd_atendimentos: mappedAtendimentos.filter(a => a.status === "REALIZADO" || a.status === "CONFIRMADO").length
                });

                setAtendimentos(mappedAtendimentos);
            } catch (err) {
                console.error("Erro ao carregar prontuário:", err);
                setError("Não foi possível carregar as informações do paciente.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [idProntuario, user]);

    const criarProntuario = (data) => {
        const atendimentoParaCriar = atendimentos.find(at => at.data === data);
        if (!atendimentoParaCriar) return;

        const prontuarioVazio = [
            { sessaoId: 1, informacoes: "" },
            { sessaoId: 2, informacoes: "" },
            { sessaoId: 3, informacoes: "" },
            { sessaoId: 4, informacoes: "" }
        ];

        setProntuarioAtual({
            ...atendimentoParaCriar,
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

    const salvarProntuario = async () => {
        if (!prontuarioAtual || !user || !cliente) return;

        try {
            const payload = {
                agendaId: prontuarioAtual.id,
                psicologoId: user.id,
                pacienteId: cliente.idProntuario,
                data: prontuarioAtual.rawDate,
                sessao1: prontuarioAtual.prontuario.find(p => p.sessaoId === 1)?.informacoes || "",
                sessao2: prontuarioAtual.prontuario.find(p => p.sessaoId === 2)?.informacoes || "",
                sessao3: prontuarioAtual.prontuario.find(p => p.sessaoId === 3)?.informacoes || "",
                sessao4: prontuarioAtual.prontuario.find(p => p.sessaoId === 4)?.informacoes || "",
                relatorioTecnico: prontuarioAtual.relatorioTecnico,
                informacoesAdicionais: prontuarioAtual.informacoesAdicionais
            };

            const saved = await salvarProntuarioAPI(payload);
            
            // Atualizar lista local
            setAtendimentos(prev => prev.map(at => 
                at.id === payload.agendaId 
                    ? { ...at, hasProntuario: true } 
                    : at
            ));

            alert("Prontuário salvo com sucesso!");
        } catch (err) {
            console.error("Erro ao salvar:", err);
            alert("Erro ao salvar prontuário.");
        }
    };
    
    if (loading) return <div className="loading-page"><p>Carregando prontuário...</p></div>;
    if (error) return <div className="error-page"><p>{error}</p></div>;
    if (!cliente) return <div className="error-page"><p>Paciente não encontrado.</p></div>;

    return (
    <>
        <div className="container-prontuario-page">

            <nav aria-label="Seções das configurações" className="indice-prontuario">
                <ul className="atalhos">
                    <li><a href="#dadosPacienteInfo" >Info</a></li>
                    <li><a href="#pacienteProntuarioInfo">Prontuário</a></li>
                    <li><a href="#historicoAtendimentoInfo">Histórico de atendimentos</a></li>
                </ul>
            </nav>

            <main className="container-prontuario" id="#dadosPacienteInfo">
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
                    setProntuarioAtual={setProntuarioAtual}
                    salvarProntuario={salvarProntuario}
                />
            </main>

            <HistoricoAtendimentos 
                formatarData={formatarData}
                abrirProntuario={abrirProntuario}
                criarProntuario={criarProntuario}
                atendimentos={atendimentos}
                setAtendimentos={setAtendimentos}
            />
        </div>
    </>
  )
}
