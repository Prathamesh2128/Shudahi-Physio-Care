package com.hospital.auth.seeder;

import java.util.Set;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.hospital.auth.entity.Role;
import com.hospital.auth.entity.User;
import com.hospital.auth.repository.RoleRepository;
import com.hospital.auth.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@RequiredArgsConstructor
@Order(2)
public class SuperadminSeeder implements ApplicationRunner {

	private final UserRepository userRepo;
	private final RoleRepository roleRepo;
	private final PasswordEncoder passwordEncoder;

	@Override
	public void run(ApplicationArguments args) throws Exception {
		boolean exists = userRepo.existsByUsername("Superadmin");
		if (exists) {
			log.info("Superadmin already exists");
			return;
		}

		Role superadmin = roleRepo.findByName("super admin")
				.orElseThrow(() -> new RuntimeException("super admin role not found"));

		User user = new User();
		user.setEmail("superadmin@hospital.com");
		user.setEmployeeId("1");
		user.setFullName("Super Admin");
		user.setPasswordHash(passwordEncoder.encode("Superadmin@123"));
		user.setPhone("9821907236");
		user.setUsername("Superadmin");
		user.setEmailVerified(true);
		user.setRoles(Set.of(superadmin));
		userRepo.save(user);
	}

}
