package com.hospital.auth.entity;

import com.hospital.entity.BaseEntity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "users", indexes = { @Index(name = "idx_users_email", columnList = "email", unique = true),
		@Index(name = "idx_users_employee_id", columnList = "employee_id", unique = true),
		@Index(name = "idx_users_is_active", columnList = "is_active") })
public class User extends BaseEntity {
	@Column(nullable = false)
	private String fullName;

	@Column(unique = true, nullable = false, length = 50)
	private String username;

	@Column(unique = true, nullable = false, length = 50)
	private String email;

	@Column(nullable = false, length = 255)
	private String passwordHash;

	@Column(length = 10)
	private String phone;

	@Column(unique = true, length = 30)
	private String employeeId;

	private UUID departmentId; // FK resolved via Feign to doctor-service

	private String avatarUrl;

	@Builder.Default
	@Column(nullable = false)
	private Boolean isActive = true;

	@Builder.Default
	@Column(nullable = false)
	private Boolean emailVerified = false;

	@Builder.Default
	@Column(nullable = false)
	private Integer failedLoginCount = 0;

	private LocalDateTime lockedUntil;

	private LocalDateTime lastLoginAt;

	private LocalDateTime passwordChangedAt;

	// Fetched lazily by default; JOIN FETCH in repository overrides this for /me
	@Builder.Default
	@ManyToMany()
	@JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
	private Set<Role> roles = new HashSet<>();

	// Helper
	public boolean isLocked() {
		return lockedUntil != null && lockedUntil.isAfter(LocalDateTime.now());
	}
}
