package com.mind_your.mind.service;

import com.mind_your.mind.dto.request.ProntuarioRequestDTO;
import com.mind_your.mind.dto.response.ClienteDetalheResponseDTO;
import com.mind_your.mind.dto.response.ProntuarioResponseDTO;

import java.util.List;
import java.util.Optional;

public interface IProntuarioService {
    ProntuarioResponseDTO salvar(ProntuarioRequestDTO dto);
    Optional<ProntuarioResponseDTO> buscarPorAgenda(String agendaId);
    List<ProntuarioResponseDTO> listarPorPacienteEPsicologo(String pacienteId, String psicologoId);
    List<ClienteDetalheResponseDTO> listarClientesDoPsicologo(String psicologoId);
}
