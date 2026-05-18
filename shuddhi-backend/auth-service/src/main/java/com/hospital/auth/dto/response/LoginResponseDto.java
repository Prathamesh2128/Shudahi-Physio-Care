package com.hospital.auth.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponseDto {
	private String accessToken;
	private String tokenType; // always "Bearer"
	private int expiresIn; // seconds — 900
	private UserResponseDto user;
}
