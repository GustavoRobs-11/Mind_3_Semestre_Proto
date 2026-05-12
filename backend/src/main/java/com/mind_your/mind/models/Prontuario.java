package com.mind_your.mind.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "prontuarios")
public class Prontuario {

    @Id
    private String id;

    private String agendaId;      // Referência ao agendamento (REALIZADO)
    private String psicologoId;
    private String pacienteId;
    private String data;          // yyyy-MM-dd, copiado da Agenda

    // 4 seções do CFP
    private String sessao1;       // Identificação do usuário/instituição
    private String sessao2;       // Avaliação da demanda e definição de objetivos
    private String sessao3;       // Registro de evolução e procedimentos
    private String sessao4;       // Registro de encaminhamento ou encerramento

    private String relatorioTecnico;
    private String informacoesAdicionais;

    // Getters and Setters

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

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
