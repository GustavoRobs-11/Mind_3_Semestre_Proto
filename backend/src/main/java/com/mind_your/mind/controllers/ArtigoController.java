package com.mind_your.mind.controllers;

import com.mind_your.mind.dto.request.ArtigoRequestDTO;
import com.mind_your.mind.dto.request.ArtigoUpdateRequestDTO;
import com.mind_your.mind.dto.response.ArtigoResponseDTO;
import com.mind_your.mind.dto.response.UploadImagemResponseDTO;
import com.mind_your.mind.service.IArtigoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/artigos")
public class ArtigoController {

    private final IArtigoService artigoService;

    public ArtigoController(IArtigoService artigoService) {
        this.artigoService = artigoService;
    }

    @PostMapping
    public ResponseEntity<ArtigoResponseDTO> criarArtigo(@RequestBody ArtigoRequestDTO dados) {
        return ResponseEntity.ok(artigoService.criarArtigo(dados));
    }

    @GetMapping
    public ResponseEntity<List<ArtigoResponseDTO>> listarPublicados() {
        return ResponseEntity.ok(artigoService.listarPublicados());
    }

    @GetMapping("/meus-artigos")
    public ResponseEntity<List<ArtigoResponseDTO>> listarMeusArtigos() {
        return ResponseEntity.ok(artigoService.listarMeusArtigos());
    }

    @GetMapping("/psicologo/{psicologoId}")
    public ResponseEntity<List<ArtigoResponseDTO>> listarPorPsicologo(@PathVariable("psicologoId") String psicologoId) {
        return ResponseEntity.ok(artigoService.listarPorPsicologo(psicologoId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArtigoResponseDTO> buscarPorId(@PathVariable("id") String id) {
        return artigoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ArtigoResponseDTO> atualizarArtigo(
            @PathVariable("id") String id,
            @RequestBody ArtigoUpdateRequestDTO dados) {
        return artigoService.atualizarArtigo(id, dados)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ArtigoResponseDTO> alternarPublicacao(@PathVariable("id") String id) {
        return artigoService.alternarPublicacao(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarArtigo(@PathVariable("id") String id) {
        return artigoService.deletarArtigo(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/imagem")
    public ResponseEntity<UploadImagemResponseDTO> uploadImagem(
            @PathVariable("id") String id,
            @RequestParam("imagem") MultipartFile file) {
        return artigoService.uploadImagem(id, file)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
