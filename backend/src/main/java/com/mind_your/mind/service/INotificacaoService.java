package com.mind_your.mind.service;

import com.mind_your.mind.dto.request.NotificacaoRequestDTO;
import com.mind_your.mind.dto.response.NotificacaoResponseDTO;

import java.util.List;

public interface INotificacaoService {
    NotificacaoResponseDTO criar(NotificacaoRequestDTO dto);
    void criarNotificacaoInterna(String usuarioId, String titulo, String mensagem);
    List<NotificacaoResponseDTO> listarDoUsuario(String usuarioId);
    void marcarComoLida(String id);
}
