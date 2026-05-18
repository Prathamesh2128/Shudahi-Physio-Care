package com.hospital.auth.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.auth.entity.AuditLog;

public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {

}
