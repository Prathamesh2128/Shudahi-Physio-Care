package com.hospital.auth.service;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;
import org.springframework.data.redis.core.StringRedisTemplate;

import com.hospital.auth.config.JwtConfig;
import com.hospital.auth.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class TokenServiceImpl {

	private final JwtConfig jwtConfig;
	private final StringRedisTemplate redis;
	// ── Access token ──────────────────────────────────────────────
	// Generate a signed HS256 access token.

	// !Payload:
	// 1. sub - user UUID (standard claim)
	// 2. jti - unique token ID (used for blacklisting on logout)
	// 3. email - for disaplay without DB call
	// 4. fullname - for disaplay without DB call
	// 5. roles - slug list ["doctor:, "dept_head"]
	// 6. permissions - full flat permission list ["appointments:read_all", ...]
	// 7. iat / exp - issued-at and expiry (standard claims)
	public String generateAccessToken(User user, List<String> permissions) {
		String jti = UUID.randomUUID().toString();

		List<String> roleSlugs = user.getRoles().stream().map(r -> r.getSlug()).sorted().collect(Collectors.toList());
		Date now = new Date();
		Date expiry = new Date(now.getTime() + (long) jwtConfig.getAccessExpirySeconds() * 1000);

		String token = Jwts.builder().id(jti).subject(user.getId().toString()).claim("email", user.getEmail())
				.claim("fullName", user.getFullName()).claim("roles", roleSlugs).claim("permissions", permissions)
				.issuedAt(now).expiration(expiry).signWith(getAccessKey()).compact();

		// Write JTI to Redis so logout can blacklist it
		// Key expires when the token itself expires — no orphan keys

		redis.opsForValue().set("session:jti:" + jti, user.getId().toString(),
				Duration.ofSeconds(jwtConfig.getAccessExpirySeconds()));

		log.debug("Access token generated for user {} (jti={})", user.getEmail(), jti);
		return token;
	}

	// ── Claim extraction ──────────────────────────────────────────
	public Claims extractAllClaims(String token) {
		return Jwts.parser().verifyWith(getAccessKey()).build().parseSignedClaims(token).getPayload();
	}

	// ── Blacklist ─────────────────────────────────────────────────
	public void blacklistToken(String jti, long remainingSeconds) {
		redis.opsForValue().set("blacklist:jti:" + jti, "1", Duration.ofSeconds(remainingSeconds));
		redis.delete("session:jti:" + jti);
		log.debug("Blacklisted token jti={}", jti);
	}

	public boolean isBlacklisted(String jti) {
		return Boolean.TRUE.equals(redis.hasKey("blacklist:jti:" + jti));
	}

	public boolean isTokenValid(String token) {
		try {
			Claims c = extractAllClaims(token);
			return isBlacklisted(c.getId());
		} catch (JwtException e) {
			log.debug("Token validation failed: {}", e.getMessage());
			return false;
		}
	}

	// ── Key builders ──────────────────────────────────────────────
	private SecretKey getAccessKey() {
		return Keys.hmacShaKeyFor(jwtConfig.getAccessSecret().getBytes(StandardCharsets.UTF_8));
	}

}
