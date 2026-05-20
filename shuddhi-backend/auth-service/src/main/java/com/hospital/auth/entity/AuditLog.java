package com.hospital.auth.entity;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "audit_logs", indexes = { @Index(name = "idx_audit_user", columnList = "user_id"),
		@Index(name = "idx_audit_entity", columnList = "entity_type, entity_id") })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@Column(name = "user_id")
	private UUID userId;

	@Column(name = "action", nullable = false, length = 120)
	private String action; // e.g. "login.failed", "role.assigned"

	@Column(name = "module", length = 60)
	private String module;

	@Column(name = "entity_type", length = 60)
	private String entityType;

	@Column(name = "entity_id")
	private UUID entityId;

	@JdbcTypeCode(SqlTypes.JSON)
	@Column(name = "old_value", columnDefinition = "json")
	private Map<String, Object> oldValue;

	@JdbcTypeCode(SqlTypes.JSON)
	@Column(name = "new_value", columnDefinition = "json")
	private Map<String, Object> newValue;

	@Column(name = "ip_address", length = 45)
	private String ipAddress;

	@Column(name = "user_agent")
	private String userAgent;

	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@PrePersist
	protected void onCreate() {
		createdAt = LocalDateTime.now();
	}
}
