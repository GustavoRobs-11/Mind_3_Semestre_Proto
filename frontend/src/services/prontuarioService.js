import { authService } from './authService';

const API_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080") + "/prontuarios";

// Helper para extrair a mensagem de erro do Spring de forma segura
async function extrairMensagemErro(res, fallback = "Erro desconhecido") {
    try {
        const text = await res.text();
        if (!text) return fallback;
        const json = JSON.parse(text);
        return json.message || json.error || fallback;
    } catch {
        return fallback;
    }
}

/**
 * Salva (cria ou atualiza) um prontuário
 * @param {Object} prontuarioData - Dados do prontuário (agendaId, psicologoId, pacienteId, sessao1, sessao2, etc.)
 */
export async function salvarProntuario(prontuarioData) {
    const res = await authService.authenticatedFetch(`${API_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prontuarioData),
    });

    if (!res.ok) {
        const mensagem = await extrairMensagemErro(res, "Erro ao salvar prontuário.");
        throw new Error(mensagem);
    }

    return res.json();
}

/**
 * Busca o prontuário de um agendamento específico
 * @param {string} agendaId 
 */
export async function buscarProntuarioPorAgenda(agendaId) {
    const res = await authService.authenticatedFetch(`${API_URL}/agenda/${agendaId}`);

    if (res.status === 404) return null; // Retorna null se não houver prontuário ainda

    if (!res.ok) {
        throw new Error("Erro ao buscar prontuário do agendamento");
    }

    return res.json();
}

/**
 * Lista todos os prontuários de um paciente específico vistos por um psicólogo
 * @param {string} pacienteId 
 * @param {string} psicologoId 
 */
export async function listarProntuariosPorPaciente(pacienteId, psicologoId) {
    const res = await authService.authenticatedFetch(`${API_URL}/paciente/${pacienteId}/psicologo/${psicologoId}`);

    if (!res.ok) {
        throw new Error("Erro ao buscar histórico de prontuários");
    }

    return res.json();
}

/**
 * Lista todos os clientes (pacientes únicos) de um psicólogo com estatísticas
 * @param {string} psicologoId 
 */
export async function listarClientesDoPsicologo(psicologoId) {
    const res = await authService.authenticatedFetch(`${API_URL}/clientes/psicologo/${psicologoId}`);

    if (!res.ok) {
        throw new Error("Erro ao buscar lista de clientes");
    }

    return res.json();
}
