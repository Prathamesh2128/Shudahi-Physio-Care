package com.hospital.auth.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.auth.dto.request.LoginRequestDto;
import com.hospital.auth.dto.request.RegisterRequestDto;
import com.hospital.auth.dto.response.ApiResponse;
import com.hospital.auth.dto.response.LoginResponseDto;
import com.hospital.auth.dto.response.LogoutResponse;
import com.hospital.auth.dto.response.RegisterResponse;
import com.hospital.auth.dto.response.UserResponseDto;
import com.hospital.auth.exception.UnauthorizedException;
import com.hospital.auth.service.AuthServiceImpl;
import com.hospital.auth.service.IAuthService;
import com.hospital.auth.util.CookieUtil;
import com.hospital.auth.util.RequestUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

	private final IAuthService authService;
	private final CookieUtil cookieUtil;

	/**
	 * POST /api/v1/auth/login
	 *
	 * Authenticates the user and returns:
	 * 
	 * - Access token → response body (15 min, used as Bearer header)
	 * 
	 * - Refresh token → httpOnly cookie (7 days, never accessible via JS)
	 * 
	 * Rate limit : 5 requests / 60 seconds per IP (enforced by RateLimitFilter)
	 * Auth : Public — no JWT required Lockout : Account locked after 5 failed
	 * attempts for 30 minutes
	 */
	@PostMapping("/login")
	public ResponseEntity<ApiResponse<LoginResponseDto>> login(@Valid @RequestBody LoginRequestDto req,
			HttpServletRequest httpReq, HttpServletResponse httpRes) {

		String ip = RequestUtil.getClientIp(httpReq);
		String deviceInfo = RequestUtil.resolveDeviceInfo(req, httpReq);

		AuthServiceImpl.LoginResult result = authService.login(req, ip, deviceInfo);

		System.out.println("result :: " + result);
		System.out.println("refreshToken :: " + result.rawRefreshToken());

		// Refresh token → httpOnly secure cookie (never in response body)
		httpRes.addCookie(cookieUtil.buildRefreshCookie(result.rawRefreshToken()));

		LoginResponseDto body = LoginResponseDto.builder().accessToken(result.accessToken()).tokenType("Bearer")
				.expiresIn(900).user(result.userResponse()).build();

		return ResponseEntity.ok().body(ApiResponse.ok("Login sucessfully", body));
	}

	/**
	 * POST /api/v1/auth/logout
	 *
	 * Logs out the current session only.
	 * 
	 * - Blacklists the current access token JTI in Redis
	 * 
	 * - Revokes the refresh token stored in the httpOnly cookie
	 * 
	 * - Marks the DB session as revoked
	 * 
	 * - Clears the refresh-token cookie (Max-Age = 0)
	 *
	 * Auth : Requires valid JWT Bearer token
	 * 
	 * Rate limit : None — logout must always be allowed
	 */

	@PostMapping("/logout")
	public ResponseEntity<ApiResponse<LogoutResponse>> logout(@AuthenticationPrincipal String userId,
			HttpServletRequest httpReq, HttpServletResponse httpRes) {
		String jti = (String) httpReq.getAttribute("jti");
		String rawRefreshToken = cookieUtil.extractRefreshToken(httpReq).orElse(null);
		String ipAddress = RequestUtil.getClientIp(httpReq);
		System.out.println("rawRefreshToken :: " + rawRefreshToken);
		LogoutResponse result = authService.logout(UUID.fromString(userId), jti, rawRefreshToken, ipAddress);

		// Clear the refresh-token cookie immediately
		httpRes.addCookie(cookieUtil.clearRefreshCookie());

		return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.ok("Logout successfully", result));
	}

	/**
	 * POST /api/v1/auth/logout/all
	 *
	 * Logs out from ALL devices — revokes every session and refresh token the user
	 * has across every device.
	 *
	 * Auth : Requires valid JWT Bearer token
	 */

	@PostMapping("/logout/all")
	public ResponseEntity<ApiResponse<LogoutResponse>> logoutAll(@AuthenticationPrincipal String userId,
			HttpServletRequest httpReq, HttpServletResponse httpRes) {

		String jti = (String) httpReq.getAttribute("jti");
		String ipAddress = RequestUtil.getClientIp(httpReq);

		LogoutResponse result = authService.logoutFromAllDevice(UUID.fromString(userId), jti, ipAddress);
		httpRes.addCookie(cookieUtil.clearRefreshCookie());
		return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.ok(result));
	}

	@PostMapping("/refresh")
	public ResponseEntity<ApiResponse<LoginResponseDto>> refresh(HttpServletRequest httpReq,
			HttpServletResponse httpRes) {
		String rawToken = cookieUtil.extractRefreshToken(httpReq)
				.orElseThrow(() -> new UnauthorizedException("Refresh token not found. Please login again"));

		AuthServiceImpl.RefreshResult result = authService.refreshAccessToken(rawToken,
				RequestUtil.getClientIp(httpReq));

		// Set the new rotated refresh token as httpOnly cookie
		httpRes.addCookie(cookieUtil.buildRefreshCookie(result.newRawRefreshToken()));

		LoginResponseDto body = LoginResponseDto.builder().accessToken(result.newAccessToken()).tokenType("Bearer")
				.expiresIn(900).user(result.userResponse()).build();
		return ResponseEntity.ok(ApiResponse.ok(body));
	}

	@PostMapping("/register")
	public ResponseEntity<ApiResponse<RegisterResponse>> registerUser(
			@Valid @RequestBody RegisterRequestDto regReqDto) {
		RegisterResponse regResDto = authService.registerUser(regReqDto);
		return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("User successfully register.", regResDto));
	}

	@GetMapping("/all")
	public ResponseEntity<ApiResponse<?>> getAllUsers() {
		List<UserResponseDto> res = authService.findAllUsers();
		return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.ok("Get all users.", res));
	}
}
