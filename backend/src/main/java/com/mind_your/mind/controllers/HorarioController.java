package com.mind_your.mind.controllers;

import com.mind_your.mind.dto.request.HorarioRequestDTO;
import com.mind_your.mind.dto.response.HorarioResponseDTO;
import com.mind_your.mind.service.IHorarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/horarios")
public class HorarioController {

    private final IHorarioService horarioService;

    public HorarioController(IHorarioService horarioService) {
        this.horarioService = horarioService;
    }

    @PostMapping
    public ResponseEntity<HorarioResponseDTO> criar(@RequestBody HorarioRequestDTO dto) {
        return ResponseEntity.ok(horarioService.criar(dto));
    }

    @GetMapping("/psicologo/{psicologoId}")
    public ResponseEntity<List<HorarioResponseDTO>> listarTodosDoPsicologo(@PathVariable("psicologoId") String psicologoId) {
        return ResponseEntity.ok(horarioService.listarTodosDoPsicologo(psicologoId));
    }

    @GetMapping("/psicologo/{psicologoId}/disponiveis")
    public ResponseEntity<List<HorarioResponseDTO>> listarDisponiveisDoPsicologo(@PathVariable("psicologoId") String psicologoId) {
        return ResponseEntity.ok(horarioService.listarDisponiveisDoPsicologo(psicologoId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable("id") String id) {
        horarioService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
