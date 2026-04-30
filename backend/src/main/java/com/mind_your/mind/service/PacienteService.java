package com.mind_your.mind.service;

import com.mind_your.mind.dto.request.PacienteCadastroRequestDTO;
import com.mind_your.mind.dto.request.PacienteUpdateRequestDTO;
import com.mind_your.mind.dto.response.*;
import com.mind_your.mind.mapper.PacienteMapper;
import com.mind_your.mind.models.Paciente;
import com.mind_your.mind.models.RefreshToken;
import com.mind_your.mind.repository.PacienteRepository;
import com.mind_your.mind.security.JwtUtil;
import com.mind_your.mind.security.UserDetailsImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PacienteService implements IPacienteService {

    private final PacienteRepository pacienteRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final IRefreshTokenService refreshTokenService;
    private final IEnderecoService enderecoService;

    public PacienteService(PacienteRepository pacienteRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil,
                           AuthenticationManager authenticationManager,
                           IRefreshTokenService refreshTokenService,
                           IEnderecoService enderecoService) {
        this.pacienteRepository = pacienteRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.refreshTokenService = refreshTokenService;
        this.enderecoService = enderecoService;
    }

    @Override
    public PacienteCadastroResponseDTO cadastrar(PacienteCadastroRequestDTO dados) {
        Paciente paciente = new Paciente();

        paciente.setNome(dados.getNome());
        paciente.setSobrenome(dados.getSobrenome());
        paciente.setEmail(dados.getEmail());
        paciente.setGenero(dados.getGenero());
        paciente.setTelefone(dados.getTelefone());

        if (dados.getDtNascimento() != null) {
            paciente.setDtNascimento(dados.getDtNascimento());
        }

        paciente.setNumeroResidencia(dados.getNumeroResidencia());

        if (dados.getCep() != null) {
            enderecoService.obtemEnderecoPorCep(dados.getCep()).ifPresent(dadosEndereco -> {
                paciente.setCep(dados.getCep());
                paciente.setCidade(dadosEndereco.getCidade());
                paciente.setEndereco(dadosEndereco.getLogradouro());
                paciente.setUf(dadosEndereco.getUf());
            });
        }

        paciente.setLogin((dados.getLogin() == null || dados.getLogin().isEmpty())
                ? dados.getEmail()
                : dados.getLogin());

        paciente.setSenha(passwordEncoder.encode(dados.getSenha()));

        Paciente salvo = pacienteRepository.save(paciente);
        return PacienteMapper.toCadastroResponseDTO(salvo);
    }

    @Override
    public List<PacienteResponseDTO> buscarTodos() {
        return pacienteRepository.findAll()
                .stream()
                .map(PacienteMapper::toResponseDTO)
                .toList();
    }

    @Override
    public Optional<PacienteResponseDTO> buscarPorEmail(String email) {
        return pacienteRepository.findByEmail(email)
                .map(PacienteMapper::toResponseDTO);
    }

    @Override
    public Optional<PacienteResponseDTO> buscarPorId(String id) {
        return pacienteRepository.findById(id)
                .map(PacienteMapper::toResponseDTO);
    }

    @Override
    public Optional<PacienteConfiguracoesResponseDTO> buscarConfiguracoesPorId(String id) {
        checarPropriedade(id);
        return pacienteRepository.findById(id)
                .map(PacienteMapper::toConfiguracoesResponseDTO);
    }

    @Override
    public Optional<PacienteResponseDTO> buscarPorNome(String nome) {
        return pacienteRepository.findByNome(nome)
                .map(PacienteMapper::toResponseDTO);
    }

    @Override
    public Optional<PacienteResponseDTO> buscarPorLogin(String login) {
        return buscarPorLoginAuth(login).map(PacienteMapper::toResponseDTO);
    }

    @Override
    public Optional<PacienteSessionResponseDTO> buscarSessaoPorLogin(String login) {
        return buscarPorLoginAuth(login).map(PacienteMapper::toSessionDTO);
    }

    @Override
    public Optional<PacienteResponseDTO> atualizar(String id, PacienteUpdateRequestDTO dados) {
        checarPropriedade(id);
        return pacienteRepository.findById(id).map(paciente -> {
            PacienteMapper.updatePacienteFromDTO(dados, paciente, passwordEncoder);
            Paciente atualizado = pacienteRepository.save(paciente);
            return PacienteMapper.toResponseDTO(atualizado);
        });
    }

    @Override
    public boolean deletarPorId(String id) {
        checarPropriedade(id);
        if (pacienteRepository.existsById(id)) {
            pacienteRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public Optional<JwtResponseDTO> fazerLogin(String login, String senha) {
        return buscarPorLoginAuth(login)
                .filter(p -> passwordEncoder.matches(senha, p.getSenha()))
                .map(p -> {
                    Authentication authentication = authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(p.getLogin(), senha)
                    );
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    String token = jwtUtil.generateJwtToken(authentication);
                    RefreshToken refreshToken = refreshTokenService.criar(p.getLogin());
                    return new JwtResponseDTO(token, p.getLogin(), "paciente", refreshToken.getToken());
                });
    }

    @Override
    public Optional<UploadImagemResponseDTO> uploadImagem(String id, MultipartFile file) {
        checarPropriedade(id);
        try {
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new RuntimeException("Arquivo deve ser uma imagem");
            }
            if (file.getSize() > 5 * 1024 * 1024) {
                throw new RuntimeException("Imagem deve ter no máximo 5MB");
            }

            Optional<Paciente> pacienteOpt = pacienteRepository.findById(id);
            if (pacienteOpt.isEmpty()) {
                return Optional.empty();
            }

            Paciente paciente = pacienteOpt.get();
            Path uploadPath = Paths.get("uploads/users-pictures").toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            if (paciente.getImgPerfil() != null && !paciente.getImgPerfil().isEmpty()) {
                Files.deleteIfExists(uploadPath.resolve(paciente.getImgPerfil()));
            }

            String originalFilename = file.getOriginalFilename();
            String extension = (originalFilename != null && originalFilename.contains("."))
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : ".png";

            String filename = "perfil-" + paciente.getLogin() + "-"
                    + UUID.randomUUID().toString().substring(0, 8) + extension;

            Files.copy(file.getInputStream(), uploadPath.resolve(filename), StandardCopyOption.REPLACE_EXISTING);

            paciente.setImgPerfil(filename);
            pacienteRepository.save(paciente);

            return Optional.of(new UploadImagemResponseDTO("Imagem enviada com sucesso", filename));
        } catch (Exception e) {
            throw new RuntimeException("Erro ao fazer upload da imagem", e);
        }
    }

    private Optional<Paciente> buscarPorLoginAuth(String login) {
        if (login.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            return pacienteRepository.findByEmail(login);
        }
        return pacienteRepository.findByLogin(login);
    }

    private void checarPropriedade(String id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserDetailsImpl user) {
            if (!user.getId().equals(id)) {
                throw new RuntimeException("Acesso negado: Você não tem permissão para acessar ou modificar dados de outro usuário.");
            }
        }
    }
}
