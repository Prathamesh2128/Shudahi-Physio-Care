package com.hospital.auth.mapper;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.hospital.auth.dto.response.RoleInfo;
import com.hospital.auth.dto.response.UserResponseDto;
import com.hospital.auth.entity.Role;
import com.hospital.auth.entity.User;

@Component
public class UserMapper {
	public UserResponseDto toUserResponse(User user, List<String> roleSlugs, List<String> permissions) {
		return UserResponseDto.builder().id(user.getId()).fullName(user.getFullName()).email(user.getEmail())
				.phone(user.getPhone()).employeeId(user.getEmployeeId()).departmentId(user.getDepartmentId())
				.avatarUrl(user.getAvatarUrl()).isActive(user.getIsActive()).emailVerified(user.getEmailVerified())
				.roles(roleSlugs).roleDetails(toRoleInfoList(user.getRoles())).permissions(permissions)
				.lastLoginAt(user.getLastLoginAt()).passwordChangedAt(user.getPasswordChangedAt())
				.createdAt(user.getCreatedAt()).updatedAt(user.getUpdatedAt()).build();
	}

	private List<RoleInfo> toRoleInfoList(Set<Role> roles) {
		return roles.stream().map(r -> RoleInfo.builder().id(r.getId()).name(r.getName()).slug(r.getSlug()).build())
				.sorted(java.util.Comparator.comparing(RoleInfo::getSlug)).collect(Collectors.toList());
	}
}
