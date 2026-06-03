package com.hospital.auth.entity;

import java.time.LocalDateTime;
import java.util.UUID;

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
@Table(name = "refresh_tokens", indexes = { @Index(name = "idx_rt_user_id", columnList = "user_id"),
		@Index(name = "idx_rt_token_hash", columnList = "token_hash", unique = true),
		@Index(name = "idx_rt_revoked", columnList = "revoked_at") })
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RefreshToken extends BaseEntity {
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id")
	private User user;

	@Column(nullable = false, unique = true)
	private String tokenHash;

	private String deviceInfo;

	@Column(length = 45)
	private String ipAddress;

	@Column(nullable = false)
	private LocalDateTime issuedAt;

	@Column(nullable = false)
	private LocalDateTime expiresAt;

	private LocalDateTime revokedAt;

	private UUID revokedBy;

	@Column(name = "replaced_by_hash") // links to the next rotation's token
	private String replacedByHash;

	public boolean isExpired() {
		return LocalDateTime.now().isAfter(expiresAt);
	}

	public boolean isRevoked() {
		return revokedAt != null;
	}

	public boolean isValid() {
		return !isExpired() && !isRevoked();
	}
}
