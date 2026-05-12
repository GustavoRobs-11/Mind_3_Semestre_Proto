package com.mind_your.mind.service;

import com.mind_your.mind.dto.request.ProntuarioRequestDTO;
import com.mind_your.mind.dto.response.ClienteDetalheResponseDTO;
import com.mind_your.mind.dto.response.ProntuarioResponseDTO;
import com.mind_your.mind.models.Agenda;
import com.mind_your.mind.models.Paciente;
import com.mind_your.mind.models.Prontuario;
import com.mind_your.mind.repository.AgendaRepository;
import com.mind_your.mind.repository.PacienteRepository;
import com.mind_your.mind.repository.ProntuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProntuarioService implements IProntuarioService {

    private final ProntuarioRepository prontuarioRepository;
    private final AgendaRepository agendaRepository;
    private final PacienteRepository pacienteRepository;

    public ProntuarioService(ProntuarioRepository prontuarioRepository,
                             AgendaRepository agendaRepository,
                             PacienteRepository pacienteRepository) {
        this.prontuarioRepository = prontuarioRepository;
        this.agendaRepository = agendaRepository;
        this.pacienteRepository = pacienteRepository;
    }

    @Override
    public ProntuarioResponseDTO salvar(ProntuarioRequestDTO dto) {
        // Verifica que a agenda existe e é REALIZADO ou data de hoje (em andamento)
        Agenda agenda = agendaRepository.findById(dto.getAgendaId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agendamento não encontrado."));

        if (!"REALIZADO".equals(agenda.getStatus()) && !"CONFIRMADO".equals(agenda.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Só é possível registrar prontuário em consultas realizadas ou confirmadas.");
        }

        // Upsert: atualiza se já existe um prontuário para este agendamento
        Prontuario prontuario = prontuarioRepository.findByAgendaId(dto.getAgendaId())
                .orElse(new Prontuario());

        prontuario.setAgendaId(dto.getAgendaId());
        prontuario.setPsicologoId(dto.getPsicologoId());
        prontuario.setPacienteId(dto.getPacienteId());
        prontuario.setData(dto.getData() != null ? dto.getData() : agenda.getData());
        prontuario.setSessao1(dto.getSessao1());
        prontuario.setSessao2(dto.getSessao2());
        prontuario.setSessao3(dto.getSessao3());
        prontuario.setSessao4(dto.getSessao4());
        prontuario.setRelatorioTecnico(dto.getRelatorioTecnico());
        prontuario.setInformacoesAdicionais(dto.getInformacoesAdicionais());

        prontuario = prontuarioRepository.save(prontuario);
        return toDTO(prontuario);
    }

    @Override
    public Optional<ProntuarioResponseDTO> buscarPorAgenda(String agendaId) {
        return prontuarioRepository.findByAgendaId(agendaId).map(this::toDTO);
    }

    @Override
    public List<ProntuarioResponseDTO> listarPorPacienteEPsicologo(String pacienteId, String psicologoId) {
        return prontuarioRepository.findByPacienteIdAndPsicologoId(pacienteId, psicologoId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ClienteDetalheResponseDTO> listarClientesDoPsicologo(String psicologoId) {
        // Busca todas as agendas deste psicólogo com status REALIZADO, CONFIRMADO ou PENDENTE
        List<Agenda> agendas = agendaRepository.findByPsicologoId(psicologoId);

        // Agrupa por pacienteId somente para quem tem ao menos uma agenda (qualquer status exceto RECUSADO)
        Map<String, List<Agenda>> agendasPorPaciente = agendas.stream()
                .filter(a -> !"RECUSADO".equals(a.getStatus()))
                .collect(Collectors.groupingBy(Agenda::getPacienteId));

        List<ClienteDetalheResponseDTO> clientes = new ArrayList<>();

        for (Map.Entry<String, List<Agenda>> entry : agendasPorPaciente.entrySet()) {
            String pacienteId = entry.getKey();
            List<Agenda> agendasDoPaciente = entry.getValue();

            Optional<Paciente> pacienteOpt = pacienteRepository.findById(pacienteId);
            if (pacienteOpt.isEmpty()) continue;

            Paciente paciente = pacienteOpt.get();

            long totalRealizados = agendasDoPaciente.stream()
                    .filter(a -> "REALIZADO".equals(a.getStatus()))
                    .count();

            boolean temConfirmado = agendasDoPaciente.stream()
                    .anyMatch(a -> "CONFIRMADO".equals(a.getStatus()));
            
            boolean temPendente = agendasDoPaciente.stream()
                    .anyMatch(a -> "PENDENTE".equals(a.getStatus()));

            // Data da primeira consulta para o DTO
            String primeiraConsulta = agendasDoPaciente.stream()
                    .filter(a -> "REALIZADO".equals(a.getStatus()))
                    .map(Agenda::getData)
                    .min(Comparator.naturalOrder())
                    .orElse(agendasDoPaciente.stream()
                            .map(Agenda::getData)
                            .min(Comparator.naturalOrder())
                            .orElse(null));

            // Nova lógica de status baseada em atividade recente (1 mês)
            java.time.LocalDate hojeDt = java.time.LocalDate.now();
            java.time.LocalDate limiteAtivo = hojeDt.minusMonths(1);

            Optional<java.time.LocalDate> ultimaConsultaRealizada = agendasDoPaciente.stream()
                    .filter(a -> "REALIZADO".equals(a.getStatus()))
                    .map(a -> java.time.LocalDate.parse(a.getData()))
                    .max(Comparator.naturalOrder());

            String status;
            if (temConfirmado) {
                status = "Ativo";
            } else if (ultimaConsultaRealizada.isPresent()) {
                if (ultimaConsultaRealizada.get().isAfter(limiteAtivo) || ultimaConsultaRealizada.get().isEqual(limiteAtivo)) {
                    status = "Ativo";
                } else {
                    status = "Inativo";
                }
            } else if (temPendente) {
                status = "Pendente";
            } else {
                status = "Inativo";
            }

            ClienteDetalheResponseDTO dto = new ClienteDetalheResponseDTO();
            dto.setPacienteId(pacienteId);
            dto.setNome(paciente.getNome() + " " + paciente.getSobrenome());
            dto.setImgPerfil(paciente.getImgPerfil());
            dto.setEmail(paciente.getEmail());
            dto.setTelefone(paciente.getTelefone());
            dto.setIdade(paciente.getIdade());
            dto.setLocal(paciente.getCidade() + (paciente.getUf() != null && !paciente.getUf().isEmpty()
                    ? " - " + paciente.getUf() : ""));
            dto.setStatus(status);
            dto.setTotalAtendimentos((int) totalRealizados);
            dto.setPrimeiraConsulta(primeiraConsulta);

            clientes.add(dto);
        }

        return clientes;
    }

    private ProntuarioResponseDTO toDTO(Prontuario p) {
        ProntuarioResponseDTO dto = new ProntuarioResponseDTO();
        dto.setId(p.getId());
        dto.setAgendaId(p.getAgendaId());
        dto.setPsicologoId(p.getPsicologoId());
        dto.setPacienteId(p.getPacienteId());
        dto.setData(p.getData());
        dto.setSessao1(p.getSessao1());
        dto.setSessao2(p.getSessao2());
        dto.setSessao3(p.getSessao3());
        dto.setSessao4(p.getSessao4());
        dto.setRelatorioTecnico(p.getRelatorioTecnico());
        dto.setInformacoesAdicionais(p.getInformacoesAdicionais());
        return dto;
    }
}
