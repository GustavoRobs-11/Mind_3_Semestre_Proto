package com.mind_your.mind.dto.response;

public class AgendaResponseDTO {

    private String id;
    private String pacienteId;
    private String psicologoId;
    private String horarioId;
    private String data;
    private String diaDaSemana;
    private String horaInicio;
    private String status;
    private Boolean isCallOpen;

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPacienteId() {
        return pacienteId;
    }

    public void setPacienteId(String pacienteId) {
        this.pacienteId = pacienteId;
    }

    public String getPsicologoId() {
        return psicologoId;
    }

    public void setPsicologoId(String psicologoId) {
        this.psicologoId = psicologoId;
    }

    public String getHorarioId() {
        return horarioId;
    }

    public void setHorarioId(String horarioId) {
        this.horarioId = horarioId;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getDiaDaSemana() {
        return diaDaSemana;
    }

    public void setDiaDaSemana(String diaDaSemana) {
        this.diaDaSemana = diaDaSemana;
    }

    public String getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(String horaInicio) {
        this.horaInicio = horaInicio;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getIsCallOpen() {
        return isCallOpen;
    }

    public void setIsCallOpen(Boolean isCallOpen) {
        this.isCallOpen = isCallOpen;
    }
}
