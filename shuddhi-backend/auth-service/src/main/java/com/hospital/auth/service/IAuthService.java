package com.hospital.auth.service;

import java.util.List;
import java.util.UUID;

import com.hospital.auth.dto.request.LoginRequestDto;
import com.hospital.auth.dto.request.RegisterRequestDto;
import com.hospital.auth.dto.response.LogoutResponse;
import com.hospital.auth.dto.response.RegisterResponseDto;
import com.hospital.auth.dto.response.UserResponseDto;
import com.hospital.auth.service.AuthServiceImpl.LoginResult;
import com.hospital.auth.service.AuthServiceImpl.RefreshResult;

public interface IAuthService {
	public LoginResult login(LoginRequestDto req, String ipAddess, String deviceInfo);

	public LogoutResponse logout(UUID userId, String jti, String rawRefreshToken, String ipAddress);

	public RegisterResponseDto registerUser(RegisterRequestDto req);

	public List<UserResponseDto> findAllUsers();

	public RefreshResult refreshAccessToken(String rawRefreshToken, String ipAddress);
}
