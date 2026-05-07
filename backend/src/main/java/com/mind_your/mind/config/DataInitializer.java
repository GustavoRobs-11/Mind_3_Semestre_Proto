package com.mind_your.mind.config;

import com.mind_your.mind.models.Paciente;
import com.mind_your.mind.repository.PacienteRepository;
import com.mind_your.mind.models.Psicologo;
import com.mind_your.mind.repository.PsicologoRepository;
import com.mind_your.mind.models.Horario;
import com.mind_your.mind.repository.HorarioRepository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initData(PsicologoRepository psiRepo, 
                               PacienteRepository pacRepo, 
                               HorarioRepository horRepo) {
        return args -> {
            // Inicializar Psicólogos se estiver vazio
            if (psiRepo.count() == 0) {
                System.out.println("Iniciando carga de psicólogos (Interior e Capital de SP)...");
                
                List<Psicologo> psicologos = new ArrayList<>();
                
                psicologos.add(createPsicologo("ana", "1234", "ana@gmail.com", "Ana", "Silva", "Feminino", "1985-05-20", "(11) 98765-4321", 
                        "01310-100", "São Paulo", "SP", "perfil-ana.png", "123456", "123.456.789-01",
                        List.of("Ansiedade", "Depressão", "Terapia Cognitivo-Comportamental"), 
                        "Psicóloga com 10 anos de experiência em casos de ansiedade extrema e fobias sociais."));
                
                psicologos.add(createPsicologo("bruno", "5678", "bruno@gmail.com", "Bruno", "Ferreira", "Masculino", "1990-11-10", "(11) 91234-5678", 
                        "07010-000", "Guarulhos", "SP", "perfil-bruno.png", "654321", "234.567.890-12",
                        List.of("Psicanálise", "Luto", "Depressão"), 
                        "Especialista em psicanálise clínica, focado em processos de luto e autoconhecimento profundo."));
                
                psicologos.add(createPsicologo("carla1", "ab3cd", "carla1@gmail.com", "Carla", "Souza", "Feminino", "1988-03-15", "(11) 99876-5432", 
                        "09910-000", "Diadema", "SP", "perfil-carla.png", "112233", "345.678.901-23",
                        List.of("Terapia Infantil", "TDAH", "Autismo"), 
                        "Atendimento especializado para crianças e adolescentes com foco em desenvolvimento cognitivo."));
                
                psicologos.add(createPsicologo("carla2", "ab4cd", "carla2@gmail.com", "Carla", "Mendes", "Feminino", "1988-03-15", "(19) 99876-5432", 
                        "13010-001", "Campinas", "SP", "perfil-carla.png", "445511", "456.789.012-34",
                        List.of("Terapia de Casal", "Relacionamentos", "Conflitos Familiares"), 
                        "Focada em restaurar a comunicação e o respeito em relacionamentos afetivos e familiares."));
                
                psicologos.add(createPsicologo("daniel", "ef5gh", "daniel@gmail.com", "Daniel", "Oliveira", "Masculino", "1979-07-22", "(12) 98765-1234", 
                        "12245-000", "São José dos Campos", "SP", "perfil-daniel.png", "445566", "567.890.123-45",
                        List.of("Neuropsicologia", "Reabilitação Cognitiva"), 
                        "Especialista em avaliações neuropsicológicas e reabilitação após traumas cranianos."));
                
                psicologos.add(createPsicologo("elisa", "ij6kl", "elisa@gmail.com", "Elisa", "Costa", "Feminino", "1992-12-05", "(16) 91234-8765", 
                        "14010-000", "Ribeirão Preto", "SP", "perfil-elisa.png", "778899", "678.901.234-56",
                        List.of("Terapia Familiar", "Transtornos Alimentares"), 
                        "Abordagem sistêmica para tratar dinâmicas familiares complexas e suporte em transtornos alimentares."));

                psicologos.add(createPsicologo("felipe", "mn7op", "felipe@gmail.com", "Felipe", "Martins", "Masculino", "1983-09-30", "(13) 99876-4321", 
                        "11010-001", "Santos", "SP", "perfil-felipe.png", "334455", "789.012.345-67",
                        List.of("Terapia Ocupacional", "Reabilitação"), 
                        "Focado em ajudar pacientes a recuperar autonomia através de terapia ocupacional personalizada."));
                
                psicologos.add(createPsicologo("gabriel_psi", "psi123", "gabriel_psi@gmail.com", "Gabriel", "Ramos", "Masculino", "1987-04-12", "(15) 98765-1122", 
                        "18010-001", "Sorocaba", "SP", "perfil-gabriela.png", "223311", "890.123.456-78",
                        List.of("Psicologia Clínica", "Ansiedade"), 
                        "Especialista em psicoterapia breve e acolhimento em crises de ansiedade."));

                psicologos.add(createPsicologo("helena", "psi456", "helena@gmail.com", "Helena", "Mendes", "Feminino", "1991-08-25", "(11) 97766-5544", 
                        "09710-000", "São Bernardo do Campo", "SP", "perfil-elisa.png", "998811", "901.234.567-89",
                        List.of("Psicologia do Desenvolvimento", "Orientação Profissional"), 
                        "Apoio no desenvolvimento de carreira e transições de vida."));

                psiRepo.saveAll(psicologos);
                
                // Gerar horários para cada psicólogo
                for (Psicologo p : psicologos) {
                    gerarHorariosPadrao(horRepo, p.getId());
                }
                
                System.out.println("Psicólogos de diversas cidades de SP criados!");
            }

            // Inicializar Pacientes se estiver vazio
            if (pacRepo.count() == 0) {
                System.out.println("Iniciando carga de pacientes (SP Focus)...");
                List<Paciente> pacientes = List.of(
                    createPaciente("gabriel", "2000", "gabriel@gmail.com", "Gabriel", "Santos", "Masculino", "2000-09-13", "(12) 92959-7375", "12245-000", "São José dos Campos", "SP", "789.012.345-67", "perfil-snoopy.png"),
                    createPaciente("snoopy", "1950", "snoopy@gmail.com", "Snoopy", "Dog", "Masculino", "1969-09-13", "(11) 92337-2615", "01310-100", "São Paulo", "SP", "890.123.456-78", "perfil-snoopy.png"),
                    createPaciente("scooby", "1950", "scooby@gmail.com", "Scoobert", "Cornelius Doo", "Masculino", "1950-10-04", "(11) 93070-0787", "07010-000", "Guarulhos", "SP", "901.234.567-89", "perfil-scooby.png")
                );

                pacRepo.saveAll(pacientes);
                System.out.println("Pacientes de teste criados!");
            }
        };
    }

    private void gerarHorariosPadrao(HorarioRepository horRepo, String psicologoId) {
        String[] dias = {"Segunda", "Terca", "Quarta", "Quinta", "Sexta"};
        String[] horas = {"08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"};
        
        List<Horario> horarios = new ArrayList<>();
        for (String dia : dias) {
            for (String hora : horas) {
                Horario h = new Horario();
                h.setPsicologoId(psicologoId);
                h.setDiaDaSemana(dia);
                h.setHoraInicio(hora);
                int hourInt = Integer.parseInt(hora.split(":")[0]);
                h.setHoraFim(String.format("%02d:00", hourInt + 1));
                h.setDisponivel(true);
                horarios.add(h);
            }
        }
        horRepo.saveAll(horarios);
    }

    private Paciente createPaciente(String login, String senha, String email, String nome, String sobrenome,
                                    String genero, String dtNascimento, String telefone, String cep, String cidade, String uf, String cpf, String imgPerfil) {
        Paciente p = new Paciente();
        p.setLogin(login);
        p.setSenha(passwordEncoder.encode(senha));
        p.setEmail(email);
        p.setNome(nome);
        p.setSobrenome(sobrenome);
        p.setGenero(genero);
        p.setDtNascimento(LocalDate.parse(dtNascimento));
        p.setTelefone(telefone);
        p.setCep(cep);
        p.setCidade(cidade);
        p.setUf(uf);
        p.setCpf(cpf);
        p.setEndereco(cidade + " - " + uf);
        p.setImgPerfil(imgPerfil);
        return p;
    }

    private Psicologo createPsicologo(String login, String senha, String email, String nome, String sobrenome,
                                    String genero, String dtNascimento, String telefone, String cep, String cidade, String uf, 
                                    String imgPerfil, String crp, String cpf, List<String> especialidades, String sobreMim) {
        Psicologo p = new Psicologo();
        p.setLogin(login);
        p.setSenha(passwordEncoder.encode(senha));
        p.setEmail(email);
        p.setNome(nome);
        p.setSobrenome(sobrenome);
        p.setGenero(genero);
        p.setDtNascimento(LocalDate.parse(dtNascimento));
        p.setTelefone(telefone);
        p.setCep(cep);
        p.setCidade(cidade);
        p.setUf(uf);
        p.setEndereco(cidade + " - " + uf);
        p.setImgPerfil(imgPerfil);
        p.setCrp(crp);
        p.setCpf(cpf);
        p.setEspecialidades(especialidades);
        p.setSobreMim(sobreMim);
        return p;
    }
}