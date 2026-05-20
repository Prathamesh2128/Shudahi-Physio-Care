package com.hospital.auth.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserResponseDto {
	private UUID id;
	private String fullName;
	private String email;
	private String phone;
	private String employeeId;
	private UUID departmentId;
	private String avatarUrl;
	private Boolean isActive;
	private Boolean emailVerified;

	// Flat slug list — used by frontend PermissionGate
	private List<String> roles;
	private List<String> permissions;

	// Enriched role objects — used by admin UI
	private List<RoleInfo> roleDetails;

	private LocalDateTime lastLoginAt;
	private LocalDateTime passwordChangedAt;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt; // used for ETag generation
}
