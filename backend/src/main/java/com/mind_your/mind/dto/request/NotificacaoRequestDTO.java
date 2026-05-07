package com.mind_your.mind.dto.request;

public class NotificacaoRequestDTO {

    private String usuarioId;
    private String tipo;
    private String nome;
    private String titulo;
    private String mensagem;
    private String data;
    private String horario;
    private String status;
    private String dataAnterior;
    private String dataNova;
    private java.util.List<String> horarios;

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
}
