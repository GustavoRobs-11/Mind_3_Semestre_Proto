import { authService } from './authService';

const API_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080") + "/agendas";

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

// Agendar um novo horário
export async function agendar(agendaData) {
    const res = await authService.authenticatedFetch(`${API_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agendaData),
    });

    if (!res.ok) {
        const mensagem = await extrairMensagemErro(res, "Erro ao realizar agendamento.");
        throw new Error(mensagem);
    }

    return res.json();
}

// Listar agendas do psicólogo
export async function listarDoPsicologo(psicologoId) {
    const res = await authService.authenticatedFetch(`${API_URL}/psicologo/${psicologoId}`);

    if (!res.ok) {
        throw new Error("Erro ao buscar agendamentos do psicólogo");
    }

    return res.json();
}

// Listar agendas do paciente
export async function listarDoPaciente(pacienteId) {
    const res = await authService.authenticatedFetch(`${API_URL}/paciente/${pacienteId}`);

    if (!res.ok) {
        throw new Error("Erro ao buscar seus agendamentos");
    }

    return res.json();
}

// Listar agendas de um paciente com um psicólogo específico
export async function listarDoPacienteEPsicologo(pacienteId, psicologoId) {
    const res = await authService.authenticatedFetch(`${API_URL}/paciente/${pacienteId}/psicologo/${psicologoId}`);

    if (!res.ok) {
        throw new Error("Erro ao buscar histórico de agendamentos");
    }

    return res.json();
}

// Cancelar agendamento
export async function cancelarAgendamento(id) {
    const res = await authService.authenticatedFetch(`${API_URL}/${id}/cancelar`, {
        method: "PUT",
    });

    if (!res.ok) {
        throw new Error("Erro ao cancelar agendamento");
    }

    return res.status === 204 ? { mensagem: "Agendamento cancelado com sucesso" } : res.json();
}

// Remarcar agendamento
export async function remarcarAgendamento(id, agendaData) {
    const res = await authService.authenticatedFetch(`${API_URL}/${id}/remarcar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agendaData),
    });

    if (!res.ok) {
        const mensagem = await extrairMensagemErro(res, "Erro ao remarcar agendamento.");
        throw new Error(mensagem);
    }

    return res.json();
}

// Confirmar agendamento
export async function confirmarAgendamento(id) {
    const res = await authService.authenticatedFetch(`${API_URL}/${id}/confirmar`, {
        method: "PUT",
    });

    if (!res.ok) {
        const mensagem = await extrairMensagemErro(res, "Erro ao confirmar agendamento");
        throw new Error(mensagem);
    }

    return res.status === 204 ? { mensagem: "Agendamento confirmado com sucesso" } : res.json();
}

// Recusar agendamento
export async function recusarAgendamento(id) {
    const res = await authService.authenticatedFetch(`${API_URL}/${id}/recusar`, {
        method: "PUT",
    });

    if (!res.ok) {
        const mensagem = await extrairMensagemErro(res, "Erro ao recusar agendamento");
        throw new Error(mensagem);
    }

    return res.status === 204 ? { mensagem: "Agendamento recusado com sucesso" } : res.json();
}
// Finalizar agendamento (marcar como realizado)
export async function finalizarAgendamento(id) {
    const res = await authService.authenticatedFetch(`${API_URL}/${id}/finalizar`, {
        method: "PUT",
    });

    if (!res.ok) {
        const mensagem = await extrairMensagemErro(res, "Erro ao finalizar agendamento");
        throw new Error(mensagem);
    }

    return res.status === 204 ? { mensagem: "Agendamento finalizado com sucesso" } : res.json();
}
