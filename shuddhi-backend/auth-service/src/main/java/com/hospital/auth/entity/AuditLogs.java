package com.hospital.auth.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class AuditLogs {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;

	@Column(nullable = false, length = 120)
	private String action; // e.g. "login.failed", "role.assigned"

	private String module;
	private String tableName;
	private String recordId;
	private String oldValus;
	private String newValus;

	@Column(length = 45)
	private String ipAddress;

	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;
}
