package com.mind_your.mind.service;

import com.mind_your.mind.dto.request.NotificacaoRequestDTO;
import com.mind_your.mind.dto.response.NotificacaoResponseDTO;
import com.mind_your.mind.models.Notificacao;
import com.mind_your.mind.repository.NotificacaoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificacaoService implements INotificacaoService {

    private final NotificacaoRepository notificacaoRepository;

    public NotificacaoService(NotificacaoRepository notificacaoRepository) {
        this.notificacaoRepository = notificacaoRepository;
    }

    @Override
    public NotificacaoResponseDTO criar(NotificacaoRequestDTO dto) {
        Notificacao notificacao = new Notificacao();
        notificacao.setUsuarioId(dto.getUsuarioId());
        notificacao.setTitulo(dto.getTitulo());
        notificacao.setMensagem(dto.getMensagem());
        notificacao.setDataHora(LocalDateTime.now());
        notificacao.setLida(false);

        notificacao = notificacaoRepository.save(notificacao);
        return toDTO(notificacao);
    }

    @Override
    public void criarNotificacaoInterna(String usuarioId, String titulo, String mensagem) {
        Notificacao notificacao = new Notificacao();
        notificacao.setUsuarioId(usuarioId);
        notificacao.setTitulo(titulo);
        notificacao.setMensagem(mensagem);
        notificacao.setDataHora(LocalDateTime.now());
        notificacao.setLida(false);

        notificacaoRepository.save(notificacao);
    }

    @Override
    public List<NotificacaoResponseDTO> listarDoUsuario(String usuarioId) {
        return notificacaoRepository.findByUsuarioIdOrderByDataHoraDesc(usuarioId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void marcarComoLida(String id) {
        Notificacao notificacao = notificacaoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notificação não encontrada."));
        notificacao.setLida(true);
        notificacaoRepository.save(notificacao);
    }

    private NotificacaoResponseDTO toDTO(Notificacao notificacao) {
        NotificacaoResponseDTO dto = new NotificacaoResponseDTO();
        dto.setId(notificacao.getId());
        dto.setUsuarioId(notificacao.getUsuarioId());
        dto.setTitulo(notificacao.getTitulo());
        dto.setMensagem(notificacao.getMensagem());
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
        if (notificacao.getDataHora() != null) {
            dto.setDataHora(notificacao.getDataHora().format(formatter));
        }
        
        dto.setLida(notificacao.getLida());
        return dto;
    }
}
