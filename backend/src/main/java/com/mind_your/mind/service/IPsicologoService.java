package com.mind_your.mind.service;

import com.mind_your.mind.dto.request.PsicologoCadastroRequestDTO;
import com.mind_your.mind.dto.request.PsicologoUpdateRequestDTO;
import com.mind_your.mind.dto.response.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface IPsicologoService {
    PsicologoCadastroResponseDTO cadastrar(PsicologoCadastroRequestDTO dados);
    List<PsicologoResponseDTO> buscarTodos();
    Optional<PsicologoResponseDTO> buscarPorId(String id);
    Optional<PsicologoConfiguracoesResponseDTO> buscarConfiguracoesPorId(String id);
    Optional<PsicologoResponseDTO> buscarPorEmail(String email);
    Optional<PsicologoResponseDTO> buscarPorNome(String nome);
    Optional<PsicologoResponseDTO> buscarPorLogin(String login);
    Optional<PsicologoSessionResponseDTO> buscarSessaoPorLogin(String login);
    Optional<PsicologoResponseDTO> atualizar(String id, PsicologoUpdateRequestDTO dados);
    boolean deletarPorId(String id);
    Optional<JwtResponseDTO> fazerLogin(String login, String senha);
    Optional<UploadImagemResponseDTO> uploadImagem(String id, MultipartFile file);
    List<String> listarTodasEspecialidades();
}
