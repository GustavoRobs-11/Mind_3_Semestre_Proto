package com.mind_your.mind.service;

import com.mind_your.mind.dto.request.HorarioRequestDTO;
import com.mind_your.mind.dto.response.HorarioResponseDTO;

import java.util.List;

public interface IHorarioService {
    HorarioResponseDTO criar(HorarioRequestDTO dto);
    List<HorarioResponseDTO> listarTodosDoPsicologo(String psicologoId);
    List<HorarioResponseDTO> listarDisponiveisDoPsicologo(String psicologoId);
    void deletar(String id);
}
