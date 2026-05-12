package com.mind_your.mind.dto.response;

public class ClienteDetalheResponseDTO {

    private String pacienteId;
    private String nome;
    private String imgPerfil;
    private String email;
    private String telefone;
    private Integer idade;
    private String local;      // "Cidade - UF"
    private String status;     // "Ativo" / "Inativo" (tem agendamento futuro confirmado?)
    private int totalAtendimentos;
    private String primeiraConsulta;  // data ISO da agenda mais antiga REALIZADA

    // Getters and Setters

    public String getPacienteId() { return pacienteId; }
    public void setPacienteId(String pacienteId) { this.pacienteId = pacienteId; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getImgPerfil() { return imgPerfil; }
    public void setImgPerfil(String imgPerfil) { this.imgPerfil = imgPerfil; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public Integer getIdade() { return idade; }
    public void setIdade(Integer idade) { this.idade = idade; }

    public String getLocal() { return local; }
    public void setLocal(String local) { this.local = local; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getTotalAtendimentos() { return totalAtendimentos; }
    public void setTotalAtendimentos(int totalAtendimentos) { this.totalAtendimentos = totalAtendimentos; }

    public String getPrimeiraConsulta() { return primeiraConsulta; }
    public void setPrimeiraConsulta(String primeiraConsulta) { this.primeiraConsulta = primeiraConsulta; }
}
