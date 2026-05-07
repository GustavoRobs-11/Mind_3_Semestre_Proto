package com.mind_your.mind.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "notificacoes")
public class Notificacao {

    @Id
    private String id;

    private String usuarioId; // Quem recebe
    private String tipo;      // mensagem, confirmacao, cancelamento, etc.
    private String nome;      // Nome de quem enviou/remetente
    private String titulo;
    private String mensagem;
    private String data;      // Data do evento (ex: 06/04/2026)
    private String horario;   // Horário do evento (ex: 9:00h a.m)
    private String status;    // Status (ex: Confirmado)
    private String dataAnterior;
    private String dataNova;
    private java.util.List<String> horarios; // Para agenda-do-dia
    
    private LocalDateTime dataHoraCriacao;
    private Boolean lida = false;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(String usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getHorario() {
        return horario;
    }

    public void setHorario(String horario) {
        this.horario = horario;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDataAnterior() {
        return dataAnterior;
    }

    public void setDataAnterior(String dataAnterior) {
        this.dataAnterior = dataAnterior;
    }

    public String getDataNova() {
        return dataNova;
    }

    public void setDataNova(String dataNova) {
        this.dataNova = dataNova;
    }

    public java.util.List<String> getHorarios() {
        return horarios;
    }

    public void setHorarios(java.util.List<String> horarios) {
        this.horarios = horarios;
    }

    public LocalDateTime getDataHoraCriacao() {
        return dataHoraCriacao;
    }

    public void setDataHoraCriacao(LocalDateTime dataHoraCriacao) {
        this.dataHoraCriacao = dataHoraCriacao;
    }

    public Boolean getLida() {
        return lida;
    }

    public void setLida(Boolean lida) {
        this.lida = lida;
    }
}
