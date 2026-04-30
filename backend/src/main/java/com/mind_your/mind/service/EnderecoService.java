package com.mind_your.mind.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import com.mind_your.mind.models.Endereco;
import com.mind_your.mind.dto.response.EnderecoResponseDTO;
import com.mind_your.mind.dto.response.ClienteApiResponseDTO;
import com.mind_your.mind.mapper.EnderecoMapper;

@Service
public class EnderecoService implements IEnderecoService {

    @Value("${cliente.api.url:http://localhost:8081/api/v1/clientes/{cep}}")
    private String apiUrl;

    private final RestTemplate restTemplate;

    public EnderecoService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public Optional<Endereco> obtemLogradouroPorCep(String cep) {
        try {
            ResponseEntity<ClienteApiResponseDTO> response = restTemplate.exchange(
                apiUrl, HttpMethod.GET, null, ClienteApiResponseDTO.class, cep);
            ClienteApiResponseDTO body = response.getBody();
            return Optional.ofNullable(body != null ? body.getData() : null);
        } catch (HttpClientErrorException | ResourceAccessException e) {
            System.out.println("Erro ao buscar CEP: " + e.getMessage());
            return Optional.empty();
        }
    }

    @Override
    public Optional<EnderecoResponseDTO> obtemEnderecoPorCep(String cep) {
        try {
            ResponseEntity<ClienteApiResponseDTO> response = restTemplate.exchange(
                apiUrl, HttpMethod.GET, null, ClienteApiResponseDTO.class, cep);
            ClienteApiResponseDTO body = response.getBody();
            Endereco endereco = body != null ? body.getData() : null;
            if (endereco != null) {
                return Optional.of(EnderecoMapper.toResponseDTO(endereco));
            }
            return Optional.empty();
        } catch (HttpClientErrorException | ResourceAccessException e) {
            System.out.println("Erro ao buscar CEP: " + e.getMessage());
            return Optional.empty();
        }
    }
}
