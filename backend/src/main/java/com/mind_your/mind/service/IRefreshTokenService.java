package com.mind_your.mind.service;

import com.mind_your.mind.models.RefreshToken;

import java.util.Optional;

public interface IRefreshTokenService {
    RefreshToken criar(String username);
    Optional<RefreshToken> buscarPorToken(String token);
    boolean isExpirado(RefreshToken token);
    RefreshToken rotacionar(RefreshToken oldToken);
    void deletarPorUsername(String username);
}
