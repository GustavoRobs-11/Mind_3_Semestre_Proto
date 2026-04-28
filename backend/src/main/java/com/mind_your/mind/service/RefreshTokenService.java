package com.mind_your.mind.service;

import com.mind_your.mind.models.RefreshToken;
import com.mind_your.mind.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService implements IRefreshTokenService {

    @Value("${jwt.refresh.expiration.ms}")
    private Long refreshExpirationMs;

    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @Override
    public RefreshToken criar(String username) {
        refreshTokenRepository.deleteByUsername(username);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUsername(username);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshExpirationMs));

        return refreshTokenRepository.save(refreshToken);
    }

    @Override
    public Optional<RefreshToken> buscarPorToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Override
    public boolean isExpirado(RefreshToken token) {
        return token.getExpiryDate().isBefore(Instant.now());
    }

    @Override
    public RefreshToken rotacionar(RefreshToken oldToken) {
        String username = oldToken.getUsername();
        refreshTokenRepository.delete(oldToken);
        return criar(username);
    }

    @Override
    public void deletarPorUsername(String username) {
        refreshTokenRepository.deleteByUsername(username);
    }
}
