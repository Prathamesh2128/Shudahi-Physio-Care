package com.hospital.auth.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LogoutResponse {
	private String message;
	private boolean allDevices; // true if user chose "logout everywhere"
	private int sessionsRevoked; // how many sessions were cleared
}
