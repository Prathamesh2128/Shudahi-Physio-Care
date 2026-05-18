package com.hospital.auth.entity;

import com.hospital.entity.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class Permission extends BaseEntity {
	private String module;
	private String action;

	@Column(nullable = false, unique = true, length = 120)
	private String slug; // e.g. "pharmacy:dispense"

	private String description;
}
