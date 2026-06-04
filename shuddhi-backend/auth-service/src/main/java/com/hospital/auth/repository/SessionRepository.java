package com.hospital.auth.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.hospital.auth.entity.Session;

import io.lettuce.core.dynamic.annotation.Param;

public interface SessionRepository extends JpaRepository<Session, UUID> {

	Optional<Session> findByTokenJti(String jti);

	@Query("""
			SELECT s FROM Session s
			WHERE s.user.id = :userId
			AND s.isRevoked = false
			AND s.expiresAt > :now
			ORDER BY s.lastActive DESC
			""")
	List<Session> findActiveSessionsByUserId(@Param("userId") UUID userId, @Param("now") LocalDateTime now);

	@Modifying
	@Query("""
			UPDATE Session s
			SET s.isRevoked = true
			WHERE s.user.id = :userId
			AND s.isRevoked = false
			""")
	void revokeAllForUser(@Param("userId") UUID userId);
}
