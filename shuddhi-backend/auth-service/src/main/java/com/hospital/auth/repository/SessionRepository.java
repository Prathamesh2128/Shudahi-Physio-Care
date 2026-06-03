package com.hospital.auth.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.auth.entity.Session;

public interface SessionRepository extends JpaRepository<Session, UUID> {

	Optional<Session> findByTokenJti(String jti);
}
