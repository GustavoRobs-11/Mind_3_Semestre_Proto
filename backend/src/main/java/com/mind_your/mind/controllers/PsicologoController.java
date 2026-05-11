package com.mind_your.mind.controllers;

import com.mind_your.mind.dto.request.PsicologoCadastroRequestDTO;
import com.mind_your.mind.dto.request.PsicologoLoginRequestDTO;
import com.mind_your.mind.dto.request.PsicologoUpdateRequestDTO;
import com.mind_your.mind.dto.response.JwtResponseDTO;
import com.mind_your.mind.dto.response.PsicologoCadastroResponseDTO;
import com.mind_your.mind.dto.response.PsicologoResponseDTO;
import com.mind_your.mind.dto.response.PsicologoConfiguracoesResponseDTO;
import com.mind_your.mind.dto.response.PsicologoSessionResponseDTO;
import com.mind_your.mind.dto.response.UploadImagemResponseDTO;
import com.mind_your.mind.service.IPsicologoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/psicologos")
public class PsicologoController {

    private final IPsicologoService psicologoService;

    public PsicologoController(IPsicologoService psicologoService) {
        this.psicologoService = psicologoService;
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<PsicologoCadastroResponseDTO> cadastrar(@RequestBody PsicologoCadastroRequestDTO dados) {
        return ResponseEntity.ok(psicologoService.cadastrar(dados));
    }

    @GetMapping
    public ResponseEntity<List<PsicologoResponseDTO>> listarTodos() {
        return ResponseEntity.ok(psicologoService.buscarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PsicologoResponseDTO> buscarPorId(@PathVariable("id") String id) {
        return psicologoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/configuracoes")
    public ResponseEntity<PsicologoConfiguracoesResponseDTO> buscarConfiguracoesPorId(@PathVariable("id") String id) {
        return psicologoService.buscarConfiguracoesPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<PsicologoResponseDTO> buscarPorEmail(@PathVariable("email") String email) {
        return psicologoService.buscarPorEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/nome/{nome}")
    public ResponseEntity<PsicologoResponseDTO> buscarPorNome(@PathVariable("nome") String nome) {
        return psicologoService.buscarPorNome(nome)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/login/{login}")
    public ResponseEntity<PsicologoSessionResponseDTO> buscarSessaoPorLogin(@PathVariable("login") String login) {
        return psicologoService.buscarSessaoPorLogin(login)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<PsicologoResponseDTO> atualizar(
            @PathVariable("id") String id,
            @RequestBody PsicologoUpdateRequestDTO dados) {
        return psicologoService.atualizar(id, dados)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable("id") String id) {
        return psicologoService.deletarPorId(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponseDTO> login(@RequestBody PsicologoLoginRequestDTO dados) {
        return psicologoService.fazerLogin(dados.getLogin(), dados.getSenha())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).build());
    }

    @PostMapping("/{id}/imagem")
    public ResponseEntity<UploadImagemResponseDTO> uploadImagem(
            @PathVariable("id") String id,
            @RequestParam("imagem") MultipartFile file) {
        return psicologoService.uploadImagem(id, file)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/especialidades")
    public ResponseEntity<List<String>> listarEspecialidades() {
        return ResponseEntity.ok(psicologoService.listarTodasEspecialidades());
    }
}
