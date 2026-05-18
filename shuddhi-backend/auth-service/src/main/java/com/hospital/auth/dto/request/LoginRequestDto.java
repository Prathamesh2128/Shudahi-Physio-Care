package com.hospital.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequestDto {
	@NotBlank(message = "Email is requied")
	@Email(message = "Email must be a valid address")
	private String email;

	@NotBlank(message = "Password is required")
	private String password;

	// Optional — stored in session for "active devices" view
	private String deviceInfo;
}