package com.mind_your.mind.dto.request;

public class ProntuarioRequestDTO {

    private String agendaId;
    private String psicologoId;
    private String pacienteId;
    private String data;

    private String sessao1;
    private String sessao2;
    private String sessao3;
    private String sessao4;

    private String relatorioTecnico;
    private String informacoesAdicionais;

    // Getters and Setters

    public String getAgendaId() { return agendaId; }
    public void setAgendaId(String agendaId) { this.agendaId = agendaId; }

    public String getPsicologoId() { return psicologoId; }
    public void setPsicologoId(String psicologoId) { this.psicologoId = psicologoId; }

    public String getPacienteId() { return pacienteId; }
    public void setPacienteId(String pacienteId) { this.pacienteId = pacienteId; }

    public String getData() { return data; }
    public void setData(String data) { this.data = data; }

    public String getSessao1() { return sessao1; }
    public void setSessao1(String sessao1) { this.sessao1 = sessao1; }

    public String getSessao2() { return sessao2; }
    public void setSessao2(String sessao2) { this.sessao2 = sessao2; }

    public String getSessao3() { return sessao3; }
    public void setSessao3(String sessao3) { this.sessao3 = sessao3; }

    public String getSessao4() { return sessao4; }
    public void setSessao4(String sessao4) { this.sessao4 = sessao4; }

    public String getRelatorioTecnico() { return relatorioTecnico; }
    public void setRelatorioTecnico(String relatorioTecnico) { this.relatorioTecnico = relatorioTecnico; }

    public String getInformacoesAdicionais() { return informacoesAdicionais; }
    public void setInformacoesAdicionais(String informacoesAdicionais) { this.informacoesAdicionais = informacoesAdicionais; }
}
