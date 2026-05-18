package com.hospital.auth.dto.request;

import java.util.HashSet;
import java.util.Set;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequestDto {
	private String username;

	@NotBlank
	@Size(min = 2, max = 100, message = "Enter valid full name")
	private String fullName;

	@Pattern(regexp = "^(\\+91[- ]?)?[6-9]\\d{9}$", message = "Enter valid mobile number")
	private String phone;

	@NotBlank
	@Email
	private String email;

	private String password;

	private Set<String> roles = new HashSet<>();
}
