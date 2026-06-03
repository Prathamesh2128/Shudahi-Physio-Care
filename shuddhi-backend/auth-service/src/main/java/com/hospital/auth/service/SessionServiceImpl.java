package com.hospital.auth.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.hospital.auth.entity.Session;
import com.hospital.auth.entity.User;
import com.hospital.auth.repository.SessionRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class SessionServiceImpl implements ISessionService {

	private final SessionRepository sessionRepository;

	@Override
	public void createSession(String jti, UUID userId, String ipAddress, String deviceInfo, int expirySeconds) {
		Session session = Session.builder().user(new User()).tokenJti(jti).ipAddress(ipAddress).deviceInfo(deviceInfo)
				.issuedAt(LocalDateTime.now()).lastActive(LocalDateTime.now())
				.expiresAt(LocalDateTime.now().plusSeconds(expirySeconds)).build();
		session.getUser().setId(userId);
		sessionRepository.save(session);

	}

}
