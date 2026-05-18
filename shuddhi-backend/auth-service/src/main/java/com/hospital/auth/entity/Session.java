package com.hospital.auth.entity;

import java.time.LocalDateTime;

import com.hospital.entity.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "sessions", indexes = { @Index(name = "idx_session_user", columnList = "user_id"),
		@Index(name = "idx_session_jti", columnList = "token_jti", unique = true),
		@Index(name = "idx_session_active", columnList = "is_revoked, expires_at") })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Session extends BaseEntity {
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(name = "token_jti", nullable = false, unique = true, length = 100)
	private String tokenJti;

	@Column(name = "ip_address", length = 45)
	private String ipAddress;

	@Column(name = "device_info", length = 200)
	private String deviceInfo;

	@Column(name = "issued_at", nullable = false)
	private LocalDateTime issuedAt;

	@Column(name = "last_active", nullable = false)
	private LocalDateTime lastActive;

	@Column(name = "expires_at", nullable = false)
	private LocalDateTime expiresAt;

	@Builder.Default
	@Column(name = "is_revoked", nullable = false)
	private Boolean isRevoked = false;

	public boolean isExpired() {
		return LocalDateTime.now().isAfter(expiresAt);
	}

	public boolean isActive() {
		return !isRevoked && !isExpired();
	}
}
