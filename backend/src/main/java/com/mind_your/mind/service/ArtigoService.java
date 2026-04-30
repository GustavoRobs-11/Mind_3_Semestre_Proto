package com.mind_your.mind.service;

import com.mind_your.mind.dto.request.ArtigoRequestDTO;
import com.mind_your.mind.dto.request.ArtigoUpdateRequestDTO;
import com.mind_your.mind.dto.response.ArtigoResponseDTO;
import com.mind_your.mind.dto.response.UploadImagemResponseDTO;
import com.mind_your.mind.mapper.ArtigoMapper;
import com.mind_your.mind.models.Artigo;
import com.mind_your.mind.models.Psicologo;
import com.mind_your.mind.repository.ArtigoRepository;
import com.mind_your.mind.repository.PsicologoRepository;
import com.mind_your.mind.security.UserDetailsImpl;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ArtigoService implements IArtigoService {

    private final ArtigoRepository artigoRepository;
    private final PsicologoRepository psicologoRepository;

    public ArtigoService(ArtigoRepository artigoRepository, PsicologoRepository psicologoRepository) {
        this.artigoRepository = artigoRepository;
        this.psicologoRepository = psicologoRepository;
    }

    @Override
    public ArtigoResponseDTO criarArtigo(ArtigoRequestDTO dados) {
        String psicologoId = getAuthenticatedUserId();

        Psicologo psicologo = psicologoRepository.findById(psicologoId)
                .orElseThrow(() -> new RuntimeException("Psicólogo não encontrado"));

        Artigo artigo = new Artigo();
        artigo.setTitulo(dados.getTitulo());
        artigo.setCorpo(dados.getCorpo());
        artigo.setPublicado(dados.isPublicado());
        artigo.setPsicologoId(psicologoId);
        artigo.setAutorNome(psicologo.getNome() + " " + psicologo.getSobrenome());
        artigo.setAutorAvatar(psicologo.getImgPerfil());
        if (dados.getReferencias() != null) {
            artigo.setReferencias(dados.getReferencias());
        }

        Artigo salvo = artigoRepository.save(artigo);
        return ArtigoMapper.toResponseDTO(salvo);
    }

    @Override
    public List<ArtigoResponseDTO> listarPublicados() {
        return artigoRepository.findByPublicadoTrue().stream()
                .map(ArtigoMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ArtigoResponseDTO> listarPorPsicologo(String psicologoId) {
        return artigoRepository.findByPsicologoIdAndPublicadoTrue(psicologoId).stream()
                .map(ArtigoMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ArtigoResponseDTO> listarMeusArtigos() {
        String psicologoId = getAuthenticatedUserId();
        return artigoRepository.findByPsicologoId(psicologoId).stream()
                .map(ArtigoMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<ArtigoResponseDTO> buscarPorId(String id) {
        return artigoRepository.findById(id).map(artigo -> {
            if (!artigo.isPublicado()) {
                String reqUserId = getAuthenticatedUserId();
                if (reqUserId == null || !reqUserId.equals(artigo.getPsicologoId())) {
                    throw new RuntimeException("Acesso negado: Artigo privado.");
                }
            }
            return ArtigoMapper.toResponseDTO(artigo);
        });
    }

    @Override
    public Optional<ArtigoResponseDTO> atualizarArtigo(String id, ArtigoUpdateRequestDTO dados) {
        return artigoRepository.findById(id).map(artigo -> {
            checarPropriedade(artigo.getPsicologoId());
            ArtigoMapper.updateArtigoFromDTO(dados, artigo);
            Artigo atualizado = artigoRepository.save(artigo);
            return ArtigoMapper.toResponseDTO(atualizado);
        });
    }

    @Override
    public boolean deletarArtigo(String id) {
        Optional<Artigo> artigoOpt = artigoRepository.findById(id);
        if (artigoOpt.isPresent()) {
            Artigo artigo = artigoOpt.get();
            checarPropriedade(artigo.getPsicologoId());

            if (artigo.getImagem() != null && !artigo.getImagem().isEmpty()) {
                Path uploadPath = Paths.get("uploads/articles-pictures").toAbsolutePath().normalize();
                try {
                    Files.deleteIfExists(uploadPath.resolve(artigo.getImagem()));
                } catch (Exception e) {
                    System.err.println("Failed to delete article image: " + e.getMessage());
                }
            }

            artigoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public Optional<ArtigoResponseDTO> alternarPublicacao(String id) {
        return artigoRepository.findById(id).map(artigo -> {
            checarPropriedade(artigo.getPsicologoId());
            artigo.setPublicado(!artigo.isPublicado());
            artigo.setDataAtualizacao(LocalDateTime.now());
            Artigo atualizado = artigoRepository.save(artigo);
            return ArtigoMapper.toResponseDTO(atualizado);
        });
    }

    @Override
    public Optional<UploadImagemResponseDTO> uploadImagem(String id, MultipartFile file) {
        Optional<Artigo> artigoOpt = artigoRepository.findById(id);
        if (artigoOpt.isEmpty()) {
            return Optional.empty();
        }

        Artigo artigo = artigoOpt.get();
        checarPropriedade(artigo.getPsicologoId());

        try {
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new RuntimeException("Arquivo deve ser uma imagem");
            }
            if (file.getSize() > 5 * 1024 * 1024) {
                throw new RuntimeException("Imagem deve ter no máximo 5MB");
            }

            Path uploadPath = Paths.get("uploads/articles-pictures").toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            if (artigo.getImagem() != null && !artigo.getImagem().isEmpty()) {
                Files.deleteIfExists(uploadPath.resolve(artigo.getImagem()));
            }

            String originalFilename = file.getOriginalFilename();
            String extension = (originalFilename != null && originalFilename.contains("."))
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : ".png";

            String filename = "artigo-" + id + "-" + UUID.randomUUID().toString().substring(0, 8) + extension;
            Files.copy(file.getInputStream(), uploadPath.resolve(filename), StandardCopyOption.REPLACE_EXISTING);

            artigo.setImagem(filename);
            artigo.setDataAtualizacao(LocalDateTime.now());
            artigoRepository.save(artigo);

            return Optional.of(new UploadImagemResponseDTO("Imagem enviada com sucesso", filename));
        } catch (Exception e) {
            throw new RuntimeException("Erro ao fazer upload da imagem", e);
        }
    }

    private String getAuthenticatedUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserDetailsImpl user) {
            return user.getId();
        }
        return null;
    }

    private void checarPropriedade(String donoId) {
        String reqUserId = getAuthenticatedUserId();
        if (reqUserId == null || !reqUserId.equals(donoId)) {
            throw new RuntimeException("Acesso negado: Você não tem permissão para acessar ou modificar este artigo.");
        }
    }
}
