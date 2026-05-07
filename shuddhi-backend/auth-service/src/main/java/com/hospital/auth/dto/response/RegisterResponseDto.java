package com.hospital.auth.dto.response;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RegisterResponseDto {
	private String username;
	private String fullName;
	private String phone;
	private String email;
	private Set<String> roles;
}
