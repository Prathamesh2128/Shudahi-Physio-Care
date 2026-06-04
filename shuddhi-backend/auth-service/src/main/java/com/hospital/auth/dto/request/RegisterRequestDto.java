package com.hospital.auth.dto.request;

import com.hospital.auth.validator.StrongPassword;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequestDto {

	@NotBlank(message = "Full name is required")
	@Size(min = 2, max = 120, message = "Full name must be between 2 and 120 characters")
	private String fullName;

	@NotNull(message = "Email is required")
	@Email(message = "Must be a valid email address")
	private String email;

	@NotBlank
	@Pattern(regexp = "^\\+[1-9]\\d{6,14}$", message = "Phone must be in E.164 format e.g. +919876543210")
	private String phone;

	@NotBlank(message = "Password is requred")
	@StrongPassword
	private String password;

	// Optional — provided if staff created account on behalf of patient
	private String employeeId;
	private String refrralCode;
}
