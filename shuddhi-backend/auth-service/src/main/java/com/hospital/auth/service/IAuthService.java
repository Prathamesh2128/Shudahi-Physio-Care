package com.hospital.auth.service;

import com.hospital.auth.dto.request.RegisterRequestDto;
import com.hospital.auth.dto.response.RegisterResponseDto;

public interface IAuthService {
	public RegisterResponseDto registerUser(RegisterRequestDto userReqDto);
}
