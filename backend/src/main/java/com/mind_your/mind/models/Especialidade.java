package com.mind_your.mind.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "especialidades")
public class Especialidade {

    @Id
    private String id;

    @Indexed(unique = true)
    private String nome;

    public Especialidade() {}

    public Especialidade(String nome) {
        this.nome = nome;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
}
