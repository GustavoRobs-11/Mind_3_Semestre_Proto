package com.mind_your.mind.service;

import com.mind_your.mind.dto.request.AgendaRequestDTO;
import com.mind_your.mind.dto.response.AgendaResponseDTO;
import com.mind_your.mind.models.Agenda;
import com.mind_your.mind.models.Horario;
import com.mind_your.mind.models.Notificacao;
import com.mind_your.mind.models.Paciente;
import com.mind_your.mind.models.Psicologo;
import com.mind_your.mind.repository.AgendaRepository;
import com.mind_your.mind.repository.HorarioRepository;
import com.mind_your.mind.repository.NotificacaoRepository;
import com.mind_your.mind.repository.PacienteRepository;
import com.mind_your.mind.repository.PsicologoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AgendaService implements IAgendaService {

    private final AgendaRepository agendaRepository;
    private final HorarioRepository horarioRepository;
    private final INotificacaoService notificacaoService;
    private final PacienteRepository pacienteRepository;
    private final PsicologoRepository psicologoRepository;
    private final NotificacaoRepository notificacaoRepository;

    public AgendaService(AgendaRepository agendaRepository, HorarioRepository horarioRepository,
                         INotificacaoService notificacaoService, PacienteRepository pacienteRepository,
                         PsicologoRepository psicologoRepository, NotificacaoRepository notificacaoRepository) {
        this.agendaRepository = agendaRepository;
        this.horarioRepository = horarioRepository;
        this.notificacaoService = notificacaoService;
        this.pacienteRepository = pacienteRepository;
        this.psicologoRepository = psicologoRepository;
        this.notificacaoRepository = notificacaoRepository;
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

        if (agendaRepository.existsByPsicologoIdAndDataAndHoraInicioAndStatusNotIn(
                dto.getPsicologoId(), dto.getData(), dto.getHoraInicio(), Arrays.asList("CANCELADO", "RECUSADO"))) {
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
                "solicitacao",
                getNomePaciente(agenda.getPacienteId()),
                "Solicitação de Agendamento",
                "solicitou um agendamento.",
                agenda.getData(),
                agenda.getHoraInicio(),
                "Pendente"
        );

        return toDTO(agenda);
    }

    @Override
    public List<AgendaResponseDTO> listarDoPsicologo(String psicologoId) {
        gerarNotificacaoAgendaDoDia(psicologoId);
        return agendaRepository.findByPsicologoId(psicologoId).stream()
                .peek(this::atualizarStatusDinamico)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AgendaResponseDTO> listarDoPaciente(String pacienteId) {
        return agendaRepository.findByPacienteId(pacienteId).stream()
                .peek(this::atualizarStatusDinamico)
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

        String tipoNotif = "CONFIRMADO".equals(agenda.getStatus()) ? "cancelamento-agenda" : "cancelamento";
        String statusLabel = "Cancelado";

        agenda.setStatus("CANCELADO");
        agendaRepository.save(agenda);

        notificacaoService.criarNotificacaoInterna(
                agenda.getPsicologoId(),
                tipoNotif,
                getNomePaciente(agenda.getPacienteId()),
                "Agendamento Cancelado",
                "O agendamento foi cancelado.",
                agenda.getData(),
                agenda.getHoraInicio(),
                statusLabel
        );
        notificacaoService.criarNotificacaoInterna(
                agenda.getPacienteId(),
                tipoNotif,
                getNomePsicologo(agenda.getPsicologoId()),
                "Agendamento Cancelado",
                "O agendamento foi cancelado.",
                agenda.getData(),
                agenda.getHoraInicio(),
                statusLabel
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
                "confirmacao",
                getNomePsicologo(agenda.getPsicologoId()),
                "Agendamento Confirmado",
                "confirmou seu agendamento.",
                agenda.getData(),
                agenda.getHoraInicio(),
                "Confirmado"
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

        notificacaoService.criarNotificacaoInterna(
                agenda.getPacienteId(),
                "recusa",
                getNomePsicologo(agenda.getPsicologoId()),
                "Agendamento Recusado",
                "recusou seu agendamento.",
                agenda.getData(),
                agenda.getHoraInicio(),
                "Recusado"
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
                "reagendamento",
                getNomePaciente(agenda.getPacienteId()),
                "Agendamento Remarcado",
                "remarcou o agendamento.",
                agenda.getData(),
                agenda.getHoraInicio(),
                "Pendente"
        );

        return toDTO(agenda);
    }

    @Override
    public void gerarNotificacaoAgendaDoDia(String psicologoId) {
        LocalDate hoje = LocalDate.now();
        String hojeStr = hoje.toString();

        // Verifica se já gerou hoje
        if (notificacaoRepository.existsByUsuarioIdAndTipoAndData(psicologoId, "agenda-do-dia", hojeStr)) {
            return;
        }

        List<Agenda> agendasHoje = agendaRepository.findByPsicologoIdAndData(psicologoId, hojeStr);
        List<String> horarios = agendasHoje.stream()
                .filter(a -> "CONFIRMADO".equals(a.getStatus()))
                .map(Agenda::getHoraInicio)
                .sorted()
                .collect(Collectors.toList());

        if (!horarios.isEmpty()) {
            Notificacao n = new Notificacao();
            n.setUsuarioId(psicologoId);
            n.setTipo("agenda-do-dia");
            n.setTitulo("Agenda do Dia");
            n.setMensagem("Sua agenda tem atendimentos marcados para hoje.");
            n.setData(hojeStr);
            n.setHorarios(horarios);
            n.setDataHoraCriacao(LocalDateTime.now());
            n.setLida(false);
            notificacaoRepository.save(n);
        }
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
                        "cancelamento",
                        getNomePsicologo(agenda.getPsicologoId()),
                        "Agendamento Cancelado",
                        "Cancelado automaticamente por ausência de confirmação.",
                        agenda.getData(),
                        agenda.getHoraInicio(),
                        "Cancelado"
                );
                notificacaoService.criarNotificacaoInterna(
                        agenda.getPsicologoId(),
                        "cancelamento",
                        getNomePaciente(agenda.getPacienteId()),
                        "Agendamento Cancelado",
                        "Cancelado automaticamente por ausência de confirmação.",
                        agenda.getData(),
                        agenda.getHoraInicio(),
                        "Cancelado"
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
        // Removido atualizarStatusDinamico daqui para evitar efeitos colaterais em cascata

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
