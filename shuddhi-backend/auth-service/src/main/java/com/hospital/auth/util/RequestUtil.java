package com.hospital.auth.util;

import com.hospital.auth.dto.request.LoginRequestDto;

import jakarta.servlet.http.HttpServletRequest;

public class RequestUtil {
	private RequestUtil() {
	}

	private static final String[] IP_HEADERS = { "X-Forwarded-For", "Proxy-Client-IP", "WL-Proxy-Client-IP",
			"HTTP_X_FORWARDED_FOR", "HTTP_CLIENT_IP" };

	/**
	 * Resolves the real client IP address Handles reverse proxies and load
	 * balancers via X-Forwarded-for
	 */

	public static String getClientIp(HttpServletRequest req) {
		for (String header : IP_HEADERS) {
			String value = req.getHeader(header);
			if (value != null && !value.isEmpty() && !"unknown".equalsIgnoreCase(value)) {
				// X-Forwarded-For may be comma-separated — first entry is the real client
				return value.split(",")[0].trim();
			}
		}
		return req.getRemoteAddr();
	}

	public static String resolveDeviceInfo(LoginRequestDto req, HttpServletRequest httpReq) {
		if (req.getDeviceInfo() != null && !req.getDeviceInfo().isBlank()) {
			return req.getDeviceInfo();
		}
		String ua = httpReq.getHeader("User-Agent");
		return ua != null ? ua.substring(0, Math.min(ua.length(), 200)) : "Unknown device";
	}
}
