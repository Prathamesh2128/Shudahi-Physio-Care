package com.hospital.auth.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponseDto {
	private UUID id;
	private String fullName;
	private String email;
	private String phone;
	private String employeeId;
	private boolean isActive;
	private boolean emailVerified;
	private List<String> roles;
	private List<String> permissions;
	private LocalDateTime lastLoginAt;
}
