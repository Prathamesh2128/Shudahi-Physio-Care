package com.hospital.auth.repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.hospital.auth.entity.RefreshToken;

import io.lettuce.core.dynamic.annotation.Param;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
	Optional<RefreshToken> findByTokenHashAndRevokedAtIsNull(String inHash);

	@Modifying
	@Query("""
			UPDATE RefreshToken rt
			SET rt.revokedAt = :now
			WHERE rt.tokenHash = :hash AND rt.revokedAt IS NULL
			""")
	void revokeByHash(@Param("hash") String hash, @Param("now") LocalDateTime now);

	@Modifying
	@Query("""
			UPDATE RefreshToken rt
			SET rt.revokedAt = :now, rt.revokedBy = :userId
			WHERE rt.user.id = :userId AND rt.revokedAt IS NULL
			""")
	void revokeAllForUser(@Param("userId") UUID userId, @Param("now") LocalDateTime now);
}
