package com.mind_your.mind.repository;

import com.mind_your.mind.models.Prontuario;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProntuarioRepository extends MongoRepository<Prontuario, String> {
    List<Prontuario> findByPsicologoId(String psicologoId);
    List<Prontuario> findByPacienteIdAndPsicologoId(String pacienteId, String psicologoId);
    Optional<Prontuario> findByAgendaId(String agendaId);
    boolean existsByAgendaId(String agendaId);
    List<Prontuario> findByPsicologoIdOrderByDataDesc(String psicologoId);
}
