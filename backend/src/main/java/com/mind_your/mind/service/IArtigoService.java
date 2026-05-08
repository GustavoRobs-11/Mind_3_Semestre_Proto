package com.mind_your.mind.service;

import com.mind_your.mind.dto.request.ArtigoRequestDTO;
import com.mind_your.mind.dto.request.ArtigoUpdateRequestDTO;
import com.mind_your.mind.dto.response.ArtigoResponseDTO;
import com.mind_your.mind.dto.response.UploadImagemResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface IArtigoService {
    ArtigoResponseDTO criarArtigo(ArtigoRequestDTO dados);
    List<ArtigoResponseDTO> listarPublicados();
    List<ArtigoResponseDTO> listarPorPsicologo(String psicologoId);
    List<ArtigoResponseDTO> listarMeusArtigos();
    Optional<ArtigoResponseDTO> buscarPorId(String id);
    Optional<ArtigoResponseDTO> curtirArtigo(String id);
    Optional<ArtigoResponseDTO> registrarVisualizacao(String id);
    Optional<ArtigoResponseDTO> atualizarArtigo(String id, ArtigoUpdateRequestDTO dados);
    boolean deletarArtigo(String id);
    Optional<ArtigoResponseDTO> alternarPublicacao(String id);
    Optional<UploadImagemResponseDTO> uploadImagem(String id, MultipartFile file);
}
