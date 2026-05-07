package com.hospital.auth.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.auth.entity.User;

public interface UserRepository extends JpaRepository<User, UUID> {

}
