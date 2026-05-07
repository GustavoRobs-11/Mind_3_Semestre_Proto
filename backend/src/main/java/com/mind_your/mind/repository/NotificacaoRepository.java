package com.mind_your.mind.repository;

import com.mind_your.mind.models.Notificacao;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificacaoRepository extends MongoRepository<Notificacao, String> {
    List<Notificacao> findByUsuarioIdOrderByDataHoraCriacaoDesc(String usuarioId);
    boolean existsByUsuarioIdAndTipoAndDataAndHorarioAndMensagem(String usuarioId, String tipo, String data, String horario, String mensagem);
    boolean existsByUsuarioIdAndTipoAndData(String usuarioId, String tipo, String data);
}
