import { authService } from "./authService";

const API_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080") + "/notificacoes";

export const notificacaoService = {
    async listarDoUsuario(usuarioId) {
        try {
            const res = await authService.authenticatedFetch(`${API_URL}/usuario/${usuarioId}`);
            if (!res.ok) throw new Error("Erro ao buscar notificações");
            return res.json();
        } catch (error) {
            console.error("Erro ao buscar notificações:", error);
            throw error;
        }
    },

    async marcarComoLida(id) {
        try {
            const res = await authService.authenticatedFetch(`${API_URL}/${id}/lida`, {
                method: "PUT"
            });
            if (!res.ok) throw new Error("Erro ao marcar como lida");
        } catch (error) {
            console.error("Erro ao marcar notificação como lida:", error);
            throw error;
        }
    }
};
