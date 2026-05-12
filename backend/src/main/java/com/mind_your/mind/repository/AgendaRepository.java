package com.mind_your.mind.repository;

import com.mind_your.mind.models.Agenda;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AgendaRepository extends MongoRepository<Agenda, String> {
    List<Agenda> findByPsicologoId(String psicologoId);
    List<Agenda> findByPacienteId(String pacienteId);
    List<Agenda> findByHorarioId(String horarioId);
    List<Agenda> findByPsicologoIdAndData(String psicologoId, String data);
    List<Agenda> findByPacienteIdAndPsicologoId(String pacienteId, String psicologoId);
    boolean existsByPsicologoIdAndDataAndHoraInicioAndStatusIn(String psicologoId, String data, String horaInicio, List<String> statuses);
    boolean existsByPsicologoIdAndDataAndHoraInicioAndStatusNotIn(String psicologoId, String data, String horaInicio, List<String> statuses);
    boolean existsByPsicologoIdAndDataAndHoraInicioAndStatusNot(String psicologoId, String data, String horaInicio, String status);
}
