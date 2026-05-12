package com.mind_your.mind.controllers;

import com.mind_your.mind.dto.request.AgendaRequestDTO;
import com.mind_your.mind.dto.response.AgendaResponseDTO;
import com.mind_your.mind.service.IAgendaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/agendas")
public class AgendaController {

    private final IAgendaService agendaService;

    public AgendaController(IAgendaService agendaService) {
        this.agendaService = agendaService;
    }

    @PostMapping
    public ResponseEntity<AgendaResponseDTO> agendar(@RequestBody AgendaRequestDTO dto) {
        return ResponseEntity.ok(agendaService.agendar(dto));
    }

    @GetMapping("/psicologo/{psicologoId}")
    public ResponseEntity<List<AgendaResponseDTO>> listarDoPsicologo(@PathVariable("psicologoId") String psicologoId) {
        return ResponseEntity.ok(agendaService.listarDoPsicologo(psicologoId));
    }

    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<AgendaResponseDTO>> listarDoPaciente(@PathVariable("pacienteId") String pacienteId) {
        return ResponseEntity.ok(agendaService.listarDoPaciente(pacienteId));
    }

    @GetMapping("/paciente/{pacienteId}/psicologo/{psicologoId}")
    public ResponseEntity<List<AgendaResponseDTO>> listarDoPacienteEPsicologo(
            @PathVariable("pacienteId") String pacienteId,
            @PathVariable("psicologoId") String psicologoId) {
        return ResponseEntity.ok(agendaService.listarDoPacienteEPsicologo(pacienteId, psicologoId));
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelar(@PathVariable("id") String id) {
        agendaService.cancelar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/confirmar")
    public ResponseEntity<Void> confirmar(@PathVariable("id") String id) {
        agendaService.confirmar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/recusar")
    public ResponseEntity<Void> recusar(@PathVariable("id") String id) {
        agendaService.recusar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/remarcar")
    public ResponseEntity<AgendaResponseDTO> remarcar(@PathVariable("id") String id, @RequestBody AgendaRequestDTO dto) {
        return ResponseEntity.ok(agendaService.remarcar(id, dto));
    }

    @PutMapping("/{id}/finalizar")
    public ResponseEntity<Void> finalizar(@PathVariable("id") String id) {
        agendaService.finalizar(id);
        return ResponseEntity.noContent().build();
    }
}
