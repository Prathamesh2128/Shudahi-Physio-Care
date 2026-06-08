package com.hospital.auth.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.auth.dto.request.LoginRequestDto;
import com.hospital.auth.dto.request.RegisterRequestDto;
import com.hospital.auth.dto.response.LogoutResponse;
import com.hospital.auth.dto.response.UserResponseDto;
import com.hospital.auth.entity.Permission;
import com.hospital.auth.entity.RefreshToken;
import com.hospital.auth.entity.Role;
import com.hospital.auth.entity.Session;
import com.hospital.auth.entity.User;
import com.hospital.auth.exception.AccountLockedException;
import com.hospital.auth.exception.ConflictException;
import com.hospital.auth.exception.ForbiddenException;
import com.hospital.auth.exception.ServerException;
import com.hospital.auth.exception.UnauthorizedException;
import com.hospital.auth.mapper.UserMapper;
import com.hospital.auth.repository.RefreshTokenRepository;
import com.hospital.auth.repository.RoleRepository;
import com.hospital.auth.repository.SessionRepository;
import com.hospital.auth.repository.UserRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class AuthServiceImpl implements IAuthService {

	private final UserRepository userRepository;
	private final AuditService auditService;
	private final PasswordEncoder passwordEncoder;
	private final TokenServiceImpl tokenService;
	private final RefreshTokenRepository refreshTokenRepository;
	private final CacheEvictionService cacheEvictionService;
	private final UserMapper userMapper;
	private final SessionRepository sessionRepository;
	private final RoleRepository roleRepository;

	@Value("${hms.security.max-login-attempts:5}")
	private int maxLoginAttempts;

	@Value("${hms.security.lockout-duration-minutes:30}")
	private int lockoutMinutes;

	// ── Internal result record (Java 16+)
	public record LoginResult(String accessToken, String rawRefreshToken, UserResponseDto userResponse) {
	}

	public record RefreshResult(String newAccessToken, String newRawRefreshToken, UserResponseDto userResponse) {
	}

	@Override
	@Transactional
	public LoginResult login(LoginRequestDto req, String ipAddress, String deviceInfo) {
		// 1. Load user — generic message to prevent email enumeration
		User user = userRepository.findByEmailIgnoreCaseWithRoleAndPermission(req.getEmail()).orElseThrow(() -> {
			auditService.log(null, "login.failed.unknown_email", null, null, null, null, ipAddress);
			return new UnauthorizedException("Invalid email or password");
		});

		// 2. Lockout check — before password comparison (fail fast)
		if (user.isLocked()) {
			auditService.log(user.getId(), "login.blocked.locked", "user", user.getId(), null, null, ipAddress);
			throw new AccountLockedException(
					"Account locked until " + user.getLockedUntil() + ". Too many failed attempts.");
		}

		// 3. Email verification check
		if (!user.getEmailVerified()) {
			auditService.log(user.getId(), "login.failed.unverified_email", "user", user.getId(), null, null,
					ipAddress);
			throw new ForbiddenException("Please verified your email address before logging in");
		}

		// 4. Active account check
		if (!user.getIsActive()) {
			auditService.log(user.getId(), "login.failed.inactive", "user", user.getId(), null, null, ipAddress);
			throw new ForbiddenException("Your account has been deactivated. Please contact the administrator");
		}

		// 5. Password check — constant-time comparison via BCrypt
		if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
			handleFailedLoginAttempt(user, ipAddress);
			throw new UnauthorizedException("Invalid email or password");
		}

		// 6. Success — reset failed login counter
		user.setFailedLoginCount(0);
		user.setLockedUntil(null);
		user.setLastLoginAt(LocalDateTime.now());
		userRepository.save(user);

		// 7. Collect permissions from all assigned roles
		List<String> permissions = collectPermissions(user);

		// 8. Generate tokens
		String accessToken = tokenService.generateAccessToken(user, permissions, ipAddress, deviceInfo);
		String refreshToken = tokenService.generateRefreshToken(user);

		System.out.println("accessToken :: " + accessToken);
		System.out.println("refreshToken :: " + refreshToken);

		// 9. Persist refresh token (stored as SHA-256 hash, never raw)
		String tokenHash = tokenService.hashToken(refreshToken);
		refreshTokenRepository.save(RefreshToken.builder().user(user).tokenHash(tokenHash).deviceInfo(deviceInfo)
				.ipAddress(ipAddress).issuedAt(LocalDateTime.now()).expiresAt(LocalDateTime.now().plusDays(7)).build());

		// 10. Evict any stale cached profile so /me returns fresh permissions
		cacheEvictionService.evictUserProfile(user.getId());

		// 11. Async audit log
		auditService.log(user.getId(), "login.success", "user", user.getId(), null, null, ipAddress);

		List<String> roleSlugs = user.getRoles().stream().map(Role::getSlug).sorted().collect(Collectors.toList());

		return new LoginResult(accessToken, refreshToken, userMapper.toUserResponse(user, roleSlugs, permissions));
	}

	@Override
	@Transactional
	public LogoutResponse logout(UUID userId, String jti, String rawRefreshToken, String ipAddress) {
		System.out.println("In logout");
		int revoked = 0;

		// 1. Blacklist the current access token JTI in Redis so it stops working
		// instantly — even before it expires
		System.out.println("In above if");
		if (jti != null) {
			System.out.println("jti In if");
			tokenService.blacklistToken(jti, 900); // TTL matches access token lifetime
			revoked++;
		}

		if (rawRefreshToken != null) {
			String hash = tokenService.hashToken(rawRefreshToken);
			refreshTokenRepository.revokeByHash(hash, LocalDateTime.now());
		}

		if (jti != null) {
			sessionRepository.findByTokenJti(jti).ifPresent(session -> {
				session.setIsRevoked(true);
				sessionRepository.save(session);
			});
		}

		cacheEvictionService.evictUserProfile(userId);
		auditService.log(userId, "logout", "user", userId, null, Map.of("sesionRevoked", revoked), ipAddress);

		log.info("User {} logged out (jti={})", userId, jti);

		return LogoutResponse.builder().message("Logged out successfully").allDevices(false).sessionsRevoked(revoked)
				.build();
	}

	@Override
	@Transactional
	public LogoutResponse logoutFromAllDevice(UUID userId, String currentJti, String ipAddress) {
		System.out.println("In logoutFromAllDevice service");
		// 1. Collect all active sessions for this user
		List<Session> activeSessions = sessionRepository.findActiveSessionsByUserId(userId, LocalDateTime.now());

		// 2. Blacklist every JTI immediately in Redis
		activeSessions.forEach(s -> tokenService.blacklistToken(s.getTokenJti(), 900));

		// 3. Revoke all sessions in DB at once
		sessionRepository.revokeAllForUser(userId);

		// 4. Revoke all refresh tokens in DB
		refreshTokenRepository.revokeAllForUser(userId, LocalDateTime.now());

		int count = activeSessions.size();

		// 5. Evict cache
		cacheEvictionService.evictUserProfile(userId);

		// 6. Audit
		auditService.log(userId, "logout.all_devices", "user", userId, null, java.util.Map.of("sessionsRevoked", count,
				"triggeredByJti", currentJti != null ? currentJti : "unknown"), ipAddress);

		log.info("User {} logged out from all {} devices", userId, count);

		return LogoutResponse.builder().message("Signed out from all " + count + " device(s)").allDevices(true)
				.sessionsRevoked(count).build();
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public UserResponseDto register(RegisterRequestDto req) {
		if (userRepository.existsByEmailIgnoreCase(req.getEmail())) {
			throw new ConflictException("Emial already register");
		}

		if (userRepository.existsByUsername(req.getUsername())) {
			throw new ConflictException("Username already register");
		}

		Role patinetRole = roleRepository.findBySlug("patient")
				.orElseThrow(() -> new ServerException("Default role not found"));

		User user = User.builder().fullName(req.getFullName()).email(req.getEmail()).username(req.getUsername())
				.phone(req.getPhone()).passwordHash(passwordEncoder.encode(req.getPassword()))
				.employeeId(req.getEmployeeId()).roles(Set.of(patinetRole)).isActive(false).emailVerified(false)
				.build();
		user = userRepository.save(user);

		List<String> roleSlugs = user.getRoles().stream().map(Role::getSlug).sorted().collect(Collectors.toList());
		return userMapper.toUserResponse(user, roleSlugs, Collections.emptyList());
	}

	@Override
	@Transactional
	public RefreshResult refreshAccessToken(String rawRefreshToken, String ipAddress) {
		// 1. Verify JWT signature and expiry on the raw token
		Claims claims;
		try {
			claims = tokenService.extractRefreshClaims(rawRefreshToken);
		} catch (ExpiredJwtException e) {
			throw new UnauthorizedException("Session expired. Please login again");
		} catch (JwtException e) {
			throw new UnauthorizedException("Invalid refresh token");
		}

		UUID userId = UUID.fromString(claims.getSubject());
		String inHash = tokenService.hashToken(rawRefreshToken);

		// 2. Look up the hashed token in the database
		RefreshToken stored = refreshTokenRepository.findByTokenHashAndRevokedAtIsNull(inHash).orElseGet(() -> {
			log.warn("Refresh token reuse detected for user {}. Revoking all sessions.", userId);
			refreshTokenRepository.revokeAllForUser(userId, LocalDateTime.now());
			auditService.log(userId, "refresh.token.reuse_detected", "user", userId, null, null, ipAddress);
			throw new UnauthorizedException("Session invalidated due to suspicious activity. Please login again.");
		});

		// 3. Extra validity check (double-check DB-level expiry)
		if (stored.isExpired()) {
			stored.setRevokedAt(LocalDateTime.now());
			refreshTokenRepository.save(stored);
		}

		// 4. Load user with fresh roles and permissions from DB
		User user = userRepository.findByIdWithRolesAndPermissions(userId)
				.orElseThrow(() -> new UnauthorizedException("User account not found."));
		if (!user.getIsActive()) {
			throw new ForbiddenException("Account deactivated. Please contact admin.");
		}

		// 5. Generate new tokens BEFORE revoking old one
		// (avoids a window where user has no valid token if generation fails)
		List<String> permissions = collectPermissions(user);
		String newAccessToken = tokenService.generateAccessToken(user, permissions, ipAddress, inHash);
		String newRawRefresh = tokenService.generateRefreshToken(user);
		String newHash = tokenService.hashToken(newRawRefresh);

		// 6. Rotate: revoke old refresh token and link to new one
		stored.setRevokedAt(LocalDateTime.now());
		stored.setReplacedByHash(newHash);
		refreshTokenRepository.save(stored);

		// 7. Persist new refresh token
		refreshTokenRepository.save(RefreshToken.builder().user(user).tokenHash(newHash)
				.deviceInfo(stored.getDeviceInfo()).ipAddress(ipAddress).issuedAt(LocalDateTime.now())
				.expiresAt(LocalDateTime.now().plusDays(7)).build());

		// 8. Evict cached profile so any role changes take effect immediately
		cacheEvictionService.evictUserProfile(userId);

		// 9. Async audit
		auditService.log(userId, "token.refreshed", "user", userId, null, null, ipAddress);
		log.debug("Token rotated for user {}", user.getEmail());

		List<String> roleSlugs = user.getRoles().stream().map(Role::getSlug).sorted().collect(Collectors.toList());

		return new RefreshResult(newAccessToken, newRawRefresh,
				userMapper.toUserResponse(user, roleSlugs, permissions));
	}

	@Override
	public List<UserResponseDto> findAllUsers() {
		List<User> usersList = userRepository.findAll();
		List<UserResponseDto> userResDto = new ArrayList<>();

		for (User u : usersList) {
			UserResponseDto dto = UserResponseDto.builder().id(u.getId()).fullName(u.getFullName()).phone(u.getPhone())
					.employeeId(u.getEmployeeId()).isActive(u.getIsActive()).emailVerified(u.getEmailVerified())
					.build();

			userResDto.add(dto);
		}
		return userResDto;
	}

	// Healper Methods
	private List<String> collectPermissions(User user) {
		return user.getRoles().stream().flatMap(role -> role.getPermissions().stream()).map(Permission::getSlug)
				.distinct().sorted().collect(Collectors.toList());
	}

	private void handleFailedLoginAttempt(User user, String ipAddress) {
		int attempts = user.getFailedLoginCount() + 1;
		user.setFailedLoginCount(attempts);
		if (attempts >= maxLoginAttempts) {
			user.setLockedUntil(LocalDateTime.now().plusMinutes(lockoutMinutes));
			auditService.log(user.getId(), "account.locked", "user", user.getId(), null,
					Map.of("lockedUntil", user.getLockedUntil().toString()), ipAddress);
		} else {
			userRepository.save(user);
			auditService.log(user.getId(), "login.failed", "user", user.getId(), null,
					Map.of("attempt", attempts, "remaing", maxLoginAttempts - attempts), ipAddress);
		}
	}

}
