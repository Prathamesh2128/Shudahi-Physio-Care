package com.hospital.auth.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.security.auth.login.AccountLockedException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.auth.dto.request.LoginRequestDto;
import com.hospital.auth.dto.request.RegisterRequestDto;
import com.hospital.auth.dto.response.LoginResponseDto;
import com.hospital.auth.dto.response.RegisterResponseDto;
import com.hospital.auth.dto.response.UserResponseDto;
import com.hospital.auth.entity.Permission;
import com.hospital.auth.entity.Role;
import com.hospital.auth.entity.User;
import com.hospital.auth.exception.ForbiddenException;
import com.hospital.auth.exception.NotFoundException;
import com.hospital.auth.exception.UnauthorizedException;
import com.hospital.auth.repository.RoleRepository;
import com.hospital.auth.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class AuthServiceImpl implements IAuthService {

	private final UserRepository userRepository;
	private final RoleRepository roleRepository;
	private final AuditService auditService;
	private final PasswordEncoder passwordEncoder;
	private final TokenServiceImpl tokenService;

	@Value("${hms.security.max-login-attempts:5}")
	private int maxLoginAttempts;

	@Value("${hms.security.lockout-duration-minutes:30}")
	private int lockoutMinutes;

	// ── Internal result record (Java 16+)
	public record LoginResult(String accessToken, String rawRefreshToken, // goes to cookie only
			UserResponseDto userResponse) {
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public RegisterResponseDto registerUser(RegisterRequestDto userReqDto) {
		Set<Role> roles = roleRepository.findByNameIn(userReqDto.getRoles());
		if (userReqDto.getRoles().size() != roles.size()) {
			throw new NotFoundException("Selelct valid role :: " + userReqDto.getRoles());
		}

		User user = new User();
		user.setFullName(userReqDto.getFullName());
		user.setUsername(userReqDto.getUsername());
		user.setEmail(userReqDto.getEmail());
		user.setPasswordHash(userReqDto.getPassword());
		user.setPhone(userReqDto.getPhone());
		user.setRoles(new HashSet<>(roles));
		userRepository.save(user);

		RegisterResponseDto regResDto = new RegisterResponseDto();
		regResDto.setFullName(userReqDto.getFullName());
		regResDto.setUsername(userReqDto.getUsername());
		regResDto.setEmail(userReqDto.getEmail());
		regResDto.setPhone(userReqDto.getPhone());
		Set<String> roleNames = new HashSet<>();
		for (Role r : roles) {
			roleNames.add(r.getName());
		}

		regResDto.setRoles(roleNames);

		return regResDto;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
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
		List<String> permission = collectPermissions(user);

		// 8. Generate tokens
		String accessToken = tokenService.generateAccessToken(user, permission);
		String refreshToken = tokenService.generateRefreshToken(user);

		return LoginResponseDto.builder().username(user.getUsername()).phone(user.getPhone()).build();
	}

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
}
