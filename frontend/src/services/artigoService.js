import { authService } from './authService';

const API_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080') + "/artigos";

// Criar novo artigo (com autenticação)
export async function criarArtigo(dados) {
    const res = await authService.authenticatedFetch(`${API_URL}`, {
        method: "POST",
        body: JSON.stringify(dados),
    });

    if (!res.ok) {
        throw new Error("Erro ao criar artigo");
    }

    return res.json();
}

// Listar artigos publicados (Feed público)
export async function listarPublicados() {
    const res = await fetch(`${API_URL}`);

    if (!res.ok) {
        throw new Error("Erro ao listar artigos");
    }

    return res.json();
}

// Listar meus artigos (com autenticação)
export async function listarMeusArtigos() {
    const res = await authService.authenticatedFetch(`${API_URL}/meus-artigos`);

    if (!res.ok) {
        throw new Error("Erro ao listar seus artigos");
    }

    return res.json();
}

// Listar artigos de um psicólogo (Feed público do psicólogo)
export async function listarPorPsicologo(psicologoId) {
    const res = await fetch(`${API_URL}/psicologo/${psicologoId}`);

    if (!res.ok) {
        throw new Error("Erro ao listar artigos deste psicólogo");
    }

    return res.json();
}

// Buscar artigo por ID (Feed público ou leitura do dono)
export async function buscarPorId(id) {
    let res = await fetch(`${API_URL}/${id}`);

    if (!res.ok) {
        const token = authService.getToken();

        if (token && (res.status === 401 || res.status === 403 || res.status === 404)) {
            res = await authService.authenticatedFetch(`${API_URL}/${id}`);
        }
    }

    if (!res.ok) {
        throw new Error("Artigo não encontrado ou sem permissão de acesso");
    }

    return res.json();
}

// Curtir artigo (público)
export async function curtirArtigo(id) {
    const res = await authService.authenticatedFetch(`${API_URL}/${id}/like`, {
        method: "POST",
    });

    if (!res.ok) {
        throw new Error("Erro ao curtir artigo");
    }

    return res.json();
}

// Registrar visualização do artigo (público)
export async function registrarVisualizacao(id) {
    const res = await fetch(`${API_URL}/${id}/view`, {
        method: "POST",
    });

    if (!res.ok) {
        throw new Error("Erro ao registrar visualização");
    }

    return res.json();
}

// Atualizar artigo (com autenticação)
export async function atualizarArtigo(id, dados) {
    const res = await authService.authenticatedFetch(`${API_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(dados),
    });

    if (!res.ok) {
        throw new Error("Erro ao atualizar artigo");
    }

    return res.json();
}

// Mudar status de publicação (com autenticação)
export async function alternarPublicacao(id) {
    const res = await authService.authenticatedFetch(`${API_URL}/${id}/status`, {
        method: "PATCH",
    });

    if (!res.ok) {
        throw new Error("Erro ao alterar status do artigo");
    }

    return res.json();
}

// Deletar artigo (com autenticação)
export async function deletarArtigo(id) {
    const res = await authService.authenticatedFetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        throw new Error("Erro ao deletar artigo");
    }

    return res.status === 204 ? { mensagem: "Artigo deletado com sucesso" } : res.json();
}

// Upload de imagem do artigo (com autenticação)
export async function uploadImagem(id, file) {
    const formData = new FormData();
    formData.append('imagem', file);

    const token = authService.getToken();

    if (!token) {
        throw new Error("Não autenticado");
    }

    const res = await fetch(`${API_URL}/${id}/imagem`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Erro ao fazer upload da imagem");
    }

    return res.json();
}
