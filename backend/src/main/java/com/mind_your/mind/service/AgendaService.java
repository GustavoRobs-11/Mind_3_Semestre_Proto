package com.mind_your.mind.service;

import com.mind_your.mind.dto.request.AgendaRequestDTO;
import com.mind_your.mind.dto.response.AgendaResponseDTO;
import com.mind_your.mind.models.Agenda;
import com.mind_your.mind.models.Horario;
import com.mind_your.mind.models.Paciente;
import com.mind_your.mind.models.Psicologo;
import com.mind_your.mind.repository.AgendaRepository;
import com.mind_your.mind.repository.HorarioRepository;
import com.mind_your.mind.repository.PacienteRepository;
import com.mind_your.mind.repository.PsicologoRepository;
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
    private final INotificacaoService notificacaoService;
    private final PacienteRepository pacienteRepository;
    private final PsicologoRepository psicologoRepository;

    public AgendaService(AgendaRepository agendaRepository, HorarioRepository horarioRepository,
                         INotificacaoService notificacaoService, PacienteRepository pacienteRepository,
                         PsicologoRepository psicologoRepository) {
        this.agendaRepository = agendaRepository;
        this.horarioRepository = horarioRepository;
        this.notificacaoService = notificacaoService;
        this.pacienteRepository = pacienteRepository;
        this.psicologoRepository = psicologoRepository;
    }

    private String getNomePaciente(String pacienteId) {
        return pacienteRepository.findById(pacienteId)
                .map(p -> p.getNome() + " " + p.getSobrenome())
                .orElse("Paciente");
    }

    private String getNomePsicologo(String psicologoId) {
        return psicologoRepository.findById(psicologoId)
                .map(p -> p.getNome() + " " + p.getSobrenome())
                .orElse("Psicólogo");
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
        agenda.setStatus("PENDENTE");

        agenda = agendaRepository.save(agenda);

        notificacaoService.criarNotificacaoInterna(
                agenda.getPsicologoId(),
                "Novo agendamento",
                getNomePaciente(agenda.getPacienteId()) + " solicitou um agendamento."
        );

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
        
        LocalDate dataAtual = LocalDate.now();
        LocalDate dataConsulta = LocalDate.parse(agenda.getData());
        if (!dataAtual.isBefore(dataConsulta)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cancelamento só é permitido até o dia anterior à consulta.");
        }

        agenda.setStatus("CANCELADO");
        agendaRepository.save(agenda);

        // Libera o horário para novos agendamentos
        horarioRepository.findById(agenda.getHorarioId()).ifPresent(h -> {
            h.setDisponivel(true);
            horarioRepository.save(h);
        });

        notificacaoService.criarNotificacaoInterna(
                agenda.getPsicologoId(),
                "Agendamento Cancelado",
                "O agendamento com " + getNomePaciente(agenda.getPacienteId()) + " foi cancelado."
        );
        notificacaoService.criarNotificacaoInterna(
                agenda.getPacienteId(),
                "Agendamento Cancelado",
                "O agendamento com " + getNomePsicologo(agenda.getPsicologoId()) + " foi cancelado."
        );
    }

    @Override
    public void confirmar(String id) {
        Agenda agenda = agendaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agendamento não encontrado."));
        if (!"PENDENTE".equals(agenda.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Apenas agendamentos pendentes podem ser confirmados.");
        }
        agenda.setStatus("CONFIRMADO");
        agendaRepository.save(agenda);

        notificacaoService.criarNotificacaoInterna(
                agenda.getPacienteId(),
                getNomePsicologo(agenda.getPsicologoId()),
                "confirmou seu agendamento."
        );
    }

    @Override
    public void recusar(String id) {
        Agenda agenda = agendaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agendamento não encontrado."));
        if (!"PENDENTE".equals(agenda.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Apenas agendamentos pendentes podem ser recusados.");
        }
        agenda.setStatus("RECUSADO");
        agendaRepository.save(agenda);

        // Libera o horário para novos agendamentos
        horarioRepository.findById(agenda.getHorarioId()).ifPresent(h -> {
            h.setDisponivel(true);
            horarioRepository.save(h);
        });

        notificacaoService.criarNotificacaoInterna(
                agenda.getPacienteId(),
                getNomePsicologo(agenda.getPsicologoId()),
                "recusou seu agendamento."
        );
    }

    @Override
    public void finalizar(String id) {
        Agenda agenda = agendaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agendamento não encontrado."));
        if (!"CONFIRMADO".equals(agenda.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Apenas agendamentos confirmados podem ser finalizados.");
        }
        agenda.setStatus("REALIZADO");
        agendaRepository.save(agenda);
    }

    @Override
    public AgendaResponseDTO remarcar(String id, AgendaRequestDTO dto) {
        Agenda agenda = agendaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agendamento não encontrado."));
        
        LocalDate dataAtual = LocalDate.now();
        LocalDate dataConsulta = LocalDate.parse(agenda.getData());
        if (!dataAtual.isBefore(dataConsulta)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Remarcação só é permitida até o dia anterior à consulta.");
        }

        Horario horario = horarioRepository.findById(dto.getHorarioId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Horário não encontrado."));

        if (!horario.getDisponivel()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O horário selecionado não está mais disponível.");
        }

        agenda.setHorarioId(dto.getHorarioId());
        agenda.setData(dto.getData());
        agenda.setDiaDaSemana(dto.getDiaDaSemana());
        agenda.setHoraInicio(dto.getHoraInicio());
        agenda.setStatus("PENDENTE");

        agenda = agendaRepository.save(agenda);

        notificacaoService.criarNotificacaoInterna(
                agenda.getPsicologoId(),
                "Agendamento Remarcado",
                getNomePaciente(agenda.getPacienteId()) + " remarcou o agendamento."
        );

        return toDTO(agenda);
    }

    private void atualizarStatusDinamico(Agenda agenda) {
        LocalDateTime agora = LocalDateTime.now();
        LocalDate dataConsulta = LocalDate.parse(agenda.getData());
        LocalTime horaInicio = LocalTime.parse(agenda.getHoraInicio());
        LocalDateTime dataHoraAgendamento = LocalDateTime.of(dataConsulta, horaInicio);

        boolean modificado = false;

        if ("PENDENTE".equals(agenda.getStatus())) {
            if (agora.isAfter(dataHoraAgendamento)) {
                agenda.setStatus("CANCELADO");
                modificado = true;

                notificacaoService.criarNotificacaoInterna(
                        agenda.getPacienteId(),
                        "Agendamento Cancelado",
                        "O agendamento com " + getNomePsicologo(agenda.getPsicologoId()) + " foi cancelado automaticamente por ausência de confirmação."
                );
                notificacaoService.criarNotificacaoInterna(
                        agenda.getPsicologoId(),
                        "Agendamento Cancelado",
                        "O agendamento com " + getNomePaciente(agenda.getPacienteId()) + " foi cancelado automaticamente por ausência de confirmação."
                );
            }
        } else if ("CONFIRMADO".equals(agenda.getStatus())) {
            if (agora.isAfter(dataHoraAgendamento.plusMinutes(50))) {
                agenda.setStatus("REALIZADO");
                modificado = true;
            }
        }

        if (modificado) {
            agendaRepository.save(agenda);
        }
    }

    private AgendaResponseDTO toDTO(Agenda agenda) {
        atualizarStatusDinamico(agenda);

        AgendaResponseDTO dto = new AgendaResponseDTO();
        dto.setId(agenda.getId());
        dto.setPacienteId(agenda.getPacienteId());
        dto.setPsicologoId(agenda.getPsicologoId());
        dto.setHorarioId(agenda.getHorarioId());
        dto.setData(agenda.getData());
        dto.setDiaDaSemana(agenda.getDiaDaSemana());
        dto.setHoraInicio(agenda.getHoraInicio());
        dto.setStatus(agenda.getStatus());
        dto.setPacienteNome(getNomePaciente(agenda.getPacienteId()));
        dto.setPsicologoNome(getNomePsicologo(agenda.getPsicologoId()));

        if ("CONFIRMADO".equals(agenda.getStatus())) {
            LocalDateTime agora = LocalDateTime.now();
            LocalDate dataConsulta = LocalDate.parse(agenda.getData());
            LocalTime horaInicio = LocalTime.parse(agenda.getHoraInicio());
            LocalDateTime dataHoraAgendamento = LocalDateTime.of(dataConsulta, horaInicio);
            
            LocalDateTime inicioChamada = dataHoraAgendamento.minusMinutes(10);
            LocalDateTime fimChamada = dataHoraAgendamento.plusMinutes(50);
            
            if (!agora.isBefore(inicioChamada) && !agora.isAfter(fimChamada)) {
                dto.setIsCallOpen(true);
            } else {
                dto.setIsCallOpen(false);
            }
        } else {
            dto.setIsCallOpen(false);
        }

        return dto;
    }
}
