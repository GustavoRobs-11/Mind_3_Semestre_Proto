package com.mind_your.mind.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "artigos")
public class Artigo {

    @Id
    private String id;
    private String titulo;
    private String corpo;
    private String autorNome;
    private String autorAvatar;
    private String psicologoId;
    private String imagem;
    private int likes = 0;
    private int views = 0;
    private boolean publicado = false;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;
    private List<Referencia> referencias = new ArrayList<>();
    private List<String> usuariosQueCurtiram = new ArrayList<>();

    public static class Referencia {
        private String nome_referencia;
        private String link;

        public String getNome_referencia() { return nome_referencia; }
        public void setNome_referencia(String nome_referencia) { this.nome_referencia = nome_referencia; }
        public String getLink() { return link; }
        public void setLink(String link) { this.link = link; }
    }

    public Artigo() {
        this.dataCriacao = LocalDateTime.now();
        this.dataAtualizacao = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getCorpo() {
        return corpo;
    }

    public void setCorpo(String corpo) {
        this.corpo = corpo;
    }

    public String getAutorNome() {
        return autorNome;
    }

    public void setAutorNome(String autorNome) {
        this.autorNome = autorNome;
    }

    public String getPsicologoId() {
        return psicologoId;
    }

    public void setPsicologoId(String psicologoId) {
        this.psicologoId = psicologoId;
    }

    public String getImagem() {
        return imagem;
    }

    public void setImagem(String imagem) {
        this.imagem = imagem;
    }

    public boolean isPublicado() {
        return publicado;
    }

    public void setPublicado(boolean publicado) {
        this.publicado = publicado;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    public LocalDateTime getDataAtualizacao() {
        return dataAtualizacao;
    }

    public void setDataAtualizacao(LocalDateTime dataAtualizacao) {
        this.dataAtualizacao = dataAtualizacao;
    }

    public List<Referencia> getReferencias() {
        return referencias;
    }

    public void setReferencias(List<Referencia> referencias) {
        this.referencias = referencias;
    }

    public String getAutorAvatar() {
        return autorAvatar;
    }

    public void setAutorAvatar(String autorAvatar) {
        this.autorAvatar = autorAvatar;
    }

    public int getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }

    public int getViews() {
        return views;
    }

    public void setViews(int views) {
        this.views = views;
    }

    public List<String> getUsuariosQueCurtiram() {
        if (usuariosQueCurtiram == null) {
            usuariosQueCurtiram = new ArrayList<>();
        }
        return usuariosQueCurtiram;
    }

    public void setUsuariosQueCurtiram(List<String> usuariosQueCurtiram) {
        this.usuariosQueCurtiram = usuariosQueCurtiram;
    }
}
