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
        notificacao.setTipo(dto.getTipo());
        notificacao.setNome(dto.getNome());
        notificacao.setTitulo(dto.getTitulo());
        notificacao.setMensagem(dto.getMensagem());
        notificacao.setData(dto.getData());
        notificacao.setHorario(dto.getHorario());
        notificacao.setStatus(dto.getStatus());
        notificacao.setDataAnterior(dto.getDataAnterior());
        notificacao.setDataNova(dto.getDataNova());
        notificacao.setHorarios(dto.getHorarios());
        notificacao.setDataHoraCriacao(LocalDateTime.now());
        notificacao.setLida(false);

        notificacao = notificacaoRepository.save(notificacao);
        return toDTO(notificacao);
    }

    @Override
    public void criarNotificacaoInterna(String usuarioId, String tipo, String nome, String titulo, String mensagem, String data, String horario, String status) {
        // Evita duplicatas para o mesmo evento
        if (data != null && horario != null) {
            boolean existe = notificacaoRepository.existsByUsuarioIdAndTipoAndDataAndHorarioAndMensagem(usuarioId, tipo, data, horario, mensagem);
            if (existe) return;
        }

        Notificacao notificacao = new Notificacao();
        notificacao.setUsuarioId(usuarioId);
        notificacao.setTipo(tipo);
        notificacao.setNome(nome);
        notificacao.setTitulo(titulo);
        notificacao.setMensagem(mensagem);
        notificacao.setData(data);
        notificacao.setHorario(horario);
        notificacao.setStatus(status);
        notificacao.setDataHoraCriacao(LocalDateTime.now());
        notificacao.setLida(false);

        notificacaoRepository.save(notificacao);
    }

    @Override
    public void criarNotificacaoInterna(String usuarioId, String titulo, String mensagem) {
        Notificacao notificacao = new Notificacao();
        notificacao.setUsuarioId(usuarioId);
        notificacao.setTitulo(titulo);
        notificacao.setMensagem(mensagem);
        notificacao.setDataHoraCriacao(LocalDateTime.now());
        notificacao.setLida(false);

        notificacaoRepository.save(notificacao);
    }

    @Override
    public List<NotificacaoResponseDTO> listarDoUsuario(String usuarioId) {
        return notificacaoRepository.findByUsuarioIdOrderByDataHoraCriacaoDesc(usuarioId)
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
        dto.setTipo(notificacao.getTipo());
        dto.setNome(notificacao.getNome());
        dto.setTexto(notificacao.getMensagem());
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
        if (notificacao.getDataHoraCriacao() != null) {
            dto.setHora(notificacao.getDataHoraCriacao().format(formatter));
        }
        
        dto.setData(notificacao.getData());
        dto.setHorario(notificacao.getHorario());
        dto.setStatus(notificacao.getStatus());
        dto.setDataAnterior(notificacao.getDataAnterior());
        dto.setDataNova(notificacao.getDataNova());
        dto.setHorarios(notificacao.getHorarios());
        dto.setLida(notificacao.getLida());
        return dto;
    }
}
