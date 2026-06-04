package com.hospital.auth.fixture;

import java.util.Set;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.hospital.auth.entity.Role;
import com.hospital.auth.entity.User;
import com.hospital.auth.repository.RoleRepository;
import com.hospital.auth.repository.UserRepository;

public class UserFixture {
	@Autowired
	UserRepository userRepository;

	@Autowired
	PasswordEncoder passwordEncoder;

	@Autowired
	RoleRepository roleRepository;

	// 1. CLASS-LEVEL SETUP FIXTURE (Runs once before ANY test starts)
	@BeforeAll
	public void setUpEntireSystem() {
		System.out.println("Starting external test database container or embedded Redis...");
	}

	// 2. METHOD-LEVEL SETUP FIXTURE (Runs before EVERY SINGLE individual test)
	@BeforeEach
	public void setUpTestData() {
		System.out.println("Intersting clean test user into the database");
		Role superadmin = roleRepository.findByName("super admin")
				.orElseThrow(() -> new RuntimeException("Super admin role not found"));

		userRepository.save(User.builder().email("superadmin@hospital.com").employeeId("1").fullName("Super Admin")
				.phone("9821907236").username("superadmin").emailVerified(true)
				.passwordHash(passwordEncoder.encode("Superadmin@123")).roles(Set.of(superadmin)).build());
	}

	// 3. METHOD-LEVEL TEARDOWN FIXTURE (Runs after EVERY SINGLE test)
	@AfterEach
	void clearTestData() {
		System.out.println("Cleaning up database so tests dont't leak into each other");

		userRepository.deleteAll();
	}

	// 4. CLASS-LEVEL TEARDOWN FIXTURE (Runs once after ALL tests finish)
	@AfterAll
	void tearDownEntireSystem() {
		System.out.println("Shutting down external test servers each");
	}
}
