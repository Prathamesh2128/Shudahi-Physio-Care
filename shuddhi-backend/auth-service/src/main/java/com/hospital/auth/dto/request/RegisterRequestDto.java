package com.hospital.auth.dto.request;

import java.util.HashSet;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RegisterRequestDto {
	private String username;
	private String fullName;
	private String phone;
	private String email;
	private String password;
	private Set<String> roles = new HashSet<>();
}
