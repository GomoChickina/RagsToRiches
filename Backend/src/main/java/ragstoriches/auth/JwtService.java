package ragstoriches.auth;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Optional;

import javax.crypto.SecretKey;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

public class JwtService {
    private static final int MIN_SECRET_BYTES = 32;
    private static final int TOKEN_DAYS = 7;
    private final SecretKey signingKey;

    public JwtService(String secret) {
        if (secret == null || secret.isBlank()) {
            throw new IllegalArgumentException("JWT_SECRET is required.");
        }
        byte[] secretBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (secretBytes.length < MIN_SECRET_BYTES) {
            throw new IllegalArgumentException("JWT_SECRET must be at least 32 bytes.");
        }
        this.signingKey = Keys.hmacShaKeyFor(secretBytes);
    }

    public String createToken(AuthUser user) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(user.idString())
                .claim("email", user.email)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(TOKEN_DAYS, ChronoUnit.DAYS)))
                .signWith(signingKey)
                .compact();
    }

    public Optional<String> parseUserId(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(signingKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return Optional.ofNullable(claims.getSubject());
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
