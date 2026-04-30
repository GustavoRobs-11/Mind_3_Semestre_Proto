package com.mind_your.mind.service;

import com.mind_your.mind.dto.request.AgendaRequestDTO;
import com.mind_your.mind.dto.response.AgendaResponseDTO;

import java.util.List;

public interface IAgendaService {
    AgendaResponseDTO agendar(AgendaRequestDTO dto);
    List<AgendaResponseDTO> listarDoPsicologo(String psicologoId);
    List<AgendaResponseDTO> listarDoPaciente(String pacienteId);
    void cancelar(String id);
}
