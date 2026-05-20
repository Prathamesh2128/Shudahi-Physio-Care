package com.hospital.auth.service;

import java.util.UUID;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CacheEvictionService {

	// Evict on profile update
	@CacheEvict(value = "user:profile", key = "#userId")
	public void evictUserProfile(UUID userId) {
	}

	// Evict on role assignment / revocation
	@CacheEvict(value = "user:profile", key = "#userId")
	public void evictOnRoleChange() {
	}

	// Evict on password change
	@CacheEvict(value = "user:profile", key = "#userId")
	public void evictOnPasswordChange() {
	}

	// Nuclear option — wipe all user caches (e.g. permission seeder reruns)
	@CacheEvict(value = "user:profile", allEntries = true)
	public void evictAllUserProfiles() {
	}
}
