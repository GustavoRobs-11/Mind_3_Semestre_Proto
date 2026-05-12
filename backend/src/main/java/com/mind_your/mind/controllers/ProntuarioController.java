package com.mind_your.mind.controllers;

import com.mind_your.mind.dto.request.ProntuarioRequestDTO;
import com.mind_your.mind.dto.response.ClienteDetalheResponseDTO;
import com.mind_your.mind.dto.response.ProntuarioResponseDTO;
import com.mind_your.mind.service.IProntuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/prontuarios")
public class ProntuarioController {

    private final IProntuarioService prontuarioService;

    public ProntuarioController(IProntuarioService prontuarioService) {
        this.prontuarioService = prontuarioService;
    }

    /** Salva (cria ou atualiza) um prontuário para um agendamento */
    @PostMapping
    public ResponseEntity<ProntuarioResponseDTO> salvar(@RequestBody ProntuarioRequestDTO dto) {
        return ResponseEntity.ok(prontuarioService.salvar(dto));
    }

    /** Busca o prontuário de um agendamento específico */
    @GetMapping("/agenda/{agendaId}")
    public ResponseEntity<ProntuarioResponseDTO> buscarPorAgenda(@PathVariable("agendaId") String agendaId) {
        return prontuarioService.buscarPorAgenda(agendaId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** Lista os prontuários de um paciente específico vistos por um psicólogo */
    @GetMapping("/paciente/{pacienteId}/psicologo/{psicologoId}")
    public ResponseEntity<List<ProntuarioResponseDTO>> listarPorPacienteEPsicologo(
            @PathVariable("pacienteId") String pacienteId,
            @PathVariable("psicologoId") String psicologoId) {
        return ResponseEntity.ok(prontuarioService.listarPorPacienteEPsicologo(pacienteId, psicologoId));
    }

    /** Lista todos os clientes (pacientes únicos) de um psicólogo com estatísticas */
    @GetMapping("/clientes/psicologo/{psicologoId}")
    public ResponseEntity<List<ClienteDetalheResponseDTO>> listarClientesDoPsicologo(
            @PathVariable("psicologoId") String psicologoId) {
        return ResponseEntity.ok(prontuarioService.listarClientesDoPsicologo(psicologoId));
    }
}
