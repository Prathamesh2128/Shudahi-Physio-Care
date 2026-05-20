package com.hospital.auth.dto.response;

import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoleInfo {
	private UUID id;
	private String name;
	private String slug;
}
