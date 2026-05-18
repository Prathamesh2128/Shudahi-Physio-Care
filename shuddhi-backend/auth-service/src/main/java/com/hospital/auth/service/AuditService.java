package com.hospital.auth.service;

import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.hospital.auth.entity.AuditLog;
import com.hospital.auth.repository.AuditLogRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class AuditService {

	private final AuditLogRepository auditLogRepository;

	/**
	 * Runs in a separate thread and its own transaction so a logging failure never
	 * rolls back the main business operation.
	 */

	public void log(UUID userId, String action, String entityType, UUID entityId, Map<String, Object> oldValue,
			Map<String, Object> newValue, String ipAddress) {
		try {
			AuditLog log = AuditLog.builder().userId(userId).action(action).entityType(entityType).entityId(entityId)
					.oldValue(oldValue).newValue(newValue).ipAddress(ipAddress).build();

			auditLogRepository.save(log);
		} catch (Exception e) {
			log.error("Audit log write failed for action '{}': {}", action, e.getMessage());
		}
	}
}
