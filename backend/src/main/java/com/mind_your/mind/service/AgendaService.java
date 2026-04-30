package com.mind_your.mind.service;

import com.mind_your.mind.dto.request.AgendaRequestDTO;
import com.mind_your.mind.dto.response.AgendaResponseDTO;
import com.mind_your.mind.models.Agenda;
import com.mind_your.mind.models.Horario;
import com.mind_your.mind.repository.AgendaRepository;
import com.mind_your.mind.repository.HorarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AgendaService implements IAgendaService {

    private final AgendaRepository agendaRepository;
    private final HorarioRepository horarioRepository;

    public AgendaService(AgendaRepository agendaRepository, HorarioRepository horarioRepository) {
        this.agendaRepository = agendaRepository;
        this.horarioRepository = horarioRepository;
    }

    @Override
    public AgendaResponseDTO agendar(AgendaRequestDTO dto) {
        Horario horario = horarioRepository.findById(dto.getHorarioId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Horário não encontrado."));

        if (!horario.getDisponivel()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O horário selecionado não está mais disponível.");
        }

        LocalDateTime agora = LocalDateTime.now();
        LocalDate data = LocalDate.parse(dto.getData());
        LocalTime horaInicio = LocalTime.parse(dto.getHoraInicio());
        LocalDateTime dataHoraAgendamento = LocalDateTime.of(data, horaInicio);

        if (dataHoraAgendamento.isBefore(agora)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Não é possível agendar um horário que já passou.");
        }

        if (agendaRepository.existsByPsicologoIdAndDataAndHoraInicioAndStatusNot(
                dto.getPsicologoId(), dto.getData(), dto.getHoraInicio(), "CANCELADO")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Este horário já está reservado para esta data.");
        }

        Agenda agenda = new Agenda();
        agenda.setPacienteId(dto.getPacienteId());
        agenda.setPsicologoId(dto.getPsicologoId());
        agenda.setHorarioId(dto.getHorarioId());
        agenda.setData(dto.getData());
        agenda.setDiaDaSemana(dto.getDiaDaSemana());
        agenda.setHoraInicio(dto.getHoraInicio());
        agenda.setStatus("AGENDADO");

        agenda = agendaRepository.save(agenda);
        return toDTO(agenda);
    }

    @Override
    public List<AgendaResponseDTO> listarDoPsicologo(String psicologoId) {
        return agendaRepository.findByPsicologoId(psicologoId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AgendaResponseDTO> listarDoPaciente(String pacienteId) {
        return agendaRepository.findByPacienteId(pacienteId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void cancelar(String id) {
        Agenda agenda = agendaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agendamento não encontrado."));
        agenda.setStatus("CANCELADO");
        agendaRepository.save(agenda);
    }

    private AgendaResponseDTO toDTO(Agenda agenda) {
        AgendaResponseDTO dto = new AgendaResponseDTO();
        dto.setId(agenda.getId());
        dto.setPacienteId(agenda.getPacienteId());
        dto.setPsicologoId(agenda.getPsicologoId());
        dto.setHorarioId(agenda.getHorarioId());
        dto.setData(agenda.getData());
        dto.setDiaDaSemana(agenda.getDiaDaSemana());
        dto.setHoraInicio(agenda.getHoraInicio());
        dto.setStatus(agenda.getStatus());
        return dto;
    }
}
