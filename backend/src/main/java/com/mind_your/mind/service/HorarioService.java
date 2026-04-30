package com.mind_your.mind.service;

import com.mind_your.mind.dto.request.HorarioRequestDTO;
import com.mind_your.mind.dto.response.HorarioResponseDTO;
import com.mind_your.mind.models.Horario;
import com.mind_your.mind.repository.HorarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HorarioService implements IHorarioService {

    private final HorarioRepository horarioRepository;

    public HorarioService(HorarioRepository horarioRepository) {
        this.horarioRepository = horarioRepository;
    }

    @Override
    public HorarioResponseDTO criar(HorarioRequestDTO dto) {
        List<Horario> horariosDoDia = horarioRepository.findByPsicologoIdAndDiaDaSemana(
                dto.getPsicologoId(), dto.getDiaDaSemana());

        for (Horario h : horariosDoDia) {
            boolean isSobreposto = dto.getHoraInicio().compareTo(h.getHoraFim()) < 0
                    && dto.getHoraFim().compareTo(h.getHoraInicio()) > 0;
            if (isSobreposto) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Já existe um horário conflitante em " + dto.getDiaDaSemana()
                        + " entre " + h.getHoraInicio() + " e " + h.getHoraFim() + ".");
            }
        }

        Horario horario = new Horario();
        horario.setPsicologoId(dto.getPsicologoId());
        horario.setDiaDaSemana(dto.getDiaDaSemana());
        horario.setHoraInicio(dto.getHoraInicio());
        horario.setHoraFim(dto.getHoraFim());
        horario.setDisponivel(dto.getDisponivel() != null ? dto.getDisponivel() : true);

        horario = horarioRepository.save(horario);
        return toDTO(horario);
    }

    @Override
    public List<HorarioResponseDTO> listarTodosDoPsicologo(String psicologoId) {
        return horarioRepository.findByPsicologoId(psicologoId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<HorarioResponseDTO> listarDisponiveisDoPsicologo(String psicologoId) {
        return horarioRepository.findByPsicologoIdAndDisponivelTrue(psicologoId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deletar(String id) {
        if (!horarioRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Horário não encontrado.");
        }
        horarioRepository.deleteById(id);
    }

    private HorarioResponseDTO toDTO(Horario horario) {
        HorarioResponseDTO dto = new HorarioResponseDTO();
        dto.setId(horario.getId());
        dto.setPsicologoId(horario.getPsicologoId());
        dto.setDiaDaSemana(horario.getDiaDaSemana());
        dto.setHoraInicio(horario.getHoraInicio());
        dto.setHoraFim(horario.getHoraFim());
        dto.setDisponivel(horario.getDisponivel());
        return dto;
    }
}
