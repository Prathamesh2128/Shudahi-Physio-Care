package com.hospital.auth.service;

import java.util.List;

import com.hospital.auth.dto.request.LoginRequestDto;
import com.hospital.auth.dto.request.RegisterRequestDto;
import com.hospital.auth.dto.response.RegisterResponseDto;
import com.hospital.auth.dto.response.UserResponseDto;
import com.hospital.auth.service.AuthServiceImpl.LoginResult;

public interface IAuthService {

	public RegisterResponseDto registerUser(RegisterRequestDto req);

	public LoginResult login(LoginRequestDto req, String ipAddess, String deviceInfo);

	public List<UserResponseDto> findAllUsers();
}
