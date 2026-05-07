package com.hospital.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.auth.dto.request.RegisterRequestDto;
import com.hospital.auth.dto.response.ApiResponse;
import com.hospital.auth.dto.response.RegisterResponseDto;
import com.hospital.auth.service.IAuthService;

@RestController
@RequestMapping("/api/auth/")
@CrossOrigin("http://localhost:5173")
public class AuthController {

	@Autowired
	IAuthService authService;

	@PostMapping
	public ResponseEntity<ApiResponse<RegisterResponseDto>> registerUser(@RequestBody RegisterRequestDto regReqDto) {
		RegisterResponseDto regResDto = authService.registerUser(regReqDto);
		ApiResponse<RegisterResponseDto> res = new ApiResponse<>(regResDto, "User successfully register", 201);
		return new ResponseEntity<>(res, HttpStatus.CREATED);
	}
}
