package com.hospital.auth.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hospital.auth.entity.User;

public interface UserRepository extends JpaRepository<User, UUID> {
	/**
	 * Login query- loads user + all roles + all permission in ONE SQL Statement
	 * 
	 * Using LOWER() on both sides so login works regardless of mail case. The
	 * DISTINCT keyword removes duplicates produced by the cartesian JOIN.
	 */
	@Query("""
			SELECT DISTINCT u FROM User u
			LEFT JOIN FETCH u.roles r
			LEFT JOIN FETCH r.permissions
			WHERE LOWER(u.email) = LOWER(:email)
			""")
	Optional<User> findByEmailIgnoreCaseWithRoleAndPermission(@Param("email") String email);

	@Query("""
			SELECT DISTINCT u FROM User u
			LEFT JOIN FETCH u.roles r
			LEFT JOIN FETCH r.permissions
			WHERE u.id = :id AND u.isActive = true
			""")
	Optional<User> findByIdWithRolesAndPermissions(@Param("id") UUID id);

	boolean existsByUsername(String username);

	boolean existsByEmailIgnoreCase(String email);

}
