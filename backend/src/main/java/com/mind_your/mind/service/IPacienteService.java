package com.mind_your.mind.service;

import com.mind_your.mind.dto.request.PacienteCadastroRequestDTO;
import com.mind_your.mind.dto.request.PacienteUpdateRequestDTO;
import com.mind_your.mind.dto.response.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface IPacienteService {
    PacienteCadastroResponseDTO cadastrar(PacienteCadastroRequestDTO dados);
    List<PacienteResponseDTO> buscarTodos();
    Optional<PacienteResponseDTO> buscarPorEmail(String email);
    Optional<PacienteResponseDTO> buscarPorId(String id);
    Optional<PacienteConfiguracoesResponseDTO> buscarConfiguracoesPorId(String id);
    Optional<PacienteResponseDTO> buscarPorNome(String nome);
    Optional<PacienteResponseDTO> buscarPorLogin(String login);
    Optional<PacienteSessionResponseDTO> buscarSessaoPorLogin(String login);
    Optional<PacienteResponseDTO> atualizar(String id, PacienteUpdateRequestDTO dados);
    boolean deletarPorId(String id);
    Optional<JwtResponseDTO> fazerLogin(String login, String senha);
    Optional<UploadImagemResponseDTO> uploadImagem(String id, MultipartFile file);
}
