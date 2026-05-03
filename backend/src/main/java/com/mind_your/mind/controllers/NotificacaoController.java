package com.mind_your.mind.controllers;

import com.mind_your.mind.dto.request.NotificacaoRequestDTO;
import com.mind_your.mind.dto.response.NotificacaoResponseDTO;
import com.mind_your.mind.service.INotificacaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notificacoes")
public class NotificacaoController {

    private final INotificacaoService notificacaoService;

    public NotificacaoController(INotificacaoService notificacaoService) {
        this.notificacaoService = notificacaoService;
    }

    @PostMapping
    public ResponseEntity<NotificacaoResponseDTO> criar(@RequestBody NotificacaoRequestDTO dto) {
        return ResponseEntity.ok(notificacaoService.criar(dto));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<NotificacaoResponseDTO>> listarDoUsuario(@PathVariable("usuarioId") String usuarioId) {
        return ResponseEntity.ok(notificacaoService.listarDoUsuario(usuarioId));
    }

    @PutMapping("/{id}/lida")
    public ResponseEntity<Void> marcarComoLida(@PathVariable("id") String id) {
        notificacaoService.marcarComoLida(id);
        return ResponseEntity.noContent().build();
    }
}
