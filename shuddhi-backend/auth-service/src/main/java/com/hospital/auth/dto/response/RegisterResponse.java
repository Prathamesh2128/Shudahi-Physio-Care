package com.hospital.auth.dto.response;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RegisterResponse {
	private UUID id;
	private String fullName;
	private String email;
	private boolean isActive;
	private boolean emailVerified;
	private String phone;

	private String message; // "Please verify your email"
}
