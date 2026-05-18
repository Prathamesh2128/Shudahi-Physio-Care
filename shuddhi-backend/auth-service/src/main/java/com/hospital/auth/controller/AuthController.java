package com.hospital.auth.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.auth.config.RequestUtil;
import com.hospital.auth.dto.request.LoginRequestDto;
import com.hospital.auth.dto.request.RegisterRequestDto;
import com.hospital.auth.dto.response.ApiResponse;
import com.hospital.auth.dto.response.LoginResponseDto;
import com.hospital.auth.dto.response.RegisterResponseDto;
import com.hospital.auth.dto.response.UserResponseDto;
import com.hospital.auth.service.AuthServiceImpl;
import com.hospital.auth.service.IAuthService;
import com.hospital.auth.util.CookieUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth/")
@RequiredArgsConstructor
public class AuthController {

	private final IAuthService authService;
	private final CookieUtil cookieUtil;

	/**
     * POST /api/v1/auth/login
     *
     * Authenticates the user and returns:
     *   - Access token  → response body  (15 min, used as Bearer header)
     *   - Refresh token → httpOnly cookie (7 days, never accessible via JS)
     *
     * Rate limit : 5 requests / 60 seconds per IP  (enforced by RateLimitFilter)
     * Auth       : Public — no JWT required
     * Lockout    : Account locked after 5 failed attempts for 30 minutes
     */
	@PostMapping("/login")
	public ResponseEntity<ApiResponse<LoginResponseDto>> login(@Valid @RequestBody LoginRequestDto req,
			HttpServletRequest httpReq, HttpServletResponse httpRes) {
		log.info("In login controller");

		String ip = RequestUtil.getClientIp(httpReq);
		String deviceInfo = RequestUtil.resolveDeviceInfo(req, httpReq);

		AuthServiceImpl.LoginResult result = authService.login(req, ip, deviceInfo);

		httpRes.addCookie(cookieUtil.buildRefreshCookie(result.rawRefreshToken()));

		LoginResponseDto body = LoginResponseDto.builder().accessToken(result.accessToken()).tokenType("Bearer")
				.expiresIn(900).user(result.userResponse()).build();

		return ResponseEntity.ok().body(ApiResponse.ok("Login sucessfully", body));
	}

	@PostMapping("/register")
	public ResponseEntity<ApiResponse<RegisterResponseDto>> registerUser(
			@Valid @RequestBody RegisterRequestDto regReqDto) {
		RegisterResponseDto regResDto = authService.registerUser(regReqDto);
		return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("User successfully register.", regResDto));
	}

	@GetMapping("/all")
	public ResponseEntity<ApiResponse<?>> getAllUsers() {
		List<UserResponseDto> res = authService.findAllUsers();
		return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.ok("Get all users.", res));
	}
}
