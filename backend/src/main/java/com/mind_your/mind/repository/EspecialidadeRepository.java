package com.mind_your.mind.repository;

import com.mind_your.mind.models.Especialidade;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface EspecialidadeRepository extends MongoRepository<Especialidade, String> {
    Optional<Especialidade> findByNome(String nome);
}
