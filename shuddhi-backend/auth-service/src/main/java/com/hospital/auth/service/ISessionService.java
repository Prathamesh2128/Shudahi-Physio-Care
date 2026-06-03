package com.hospital.auth.service;

import java.util.UUID;

public interface ISessionService {
	public void createSession(String jti, UUID userId, String ipAddress, String deviceInfo, int expirySeconds);
}
