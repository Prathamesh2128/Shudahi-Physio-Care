package com.hospital.auth.util;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class CookieUtil {

	@Value("${hms.cookie.refresh-token-name:hms_rt}")
	private String cookieName;

	@Value("${hms.cookie.secure:true}")
	private boolean secure;

	@Value("${hms.cookie.same-site:Strict}")
	private String sameSite;

	/**
	 * Builds the refresh-token httpOnly cookie.
	 *
	 * httpOnly : JS cannot read it (XSS protection). 
	 * Secure : HTTPS only in prod.
	 * SameSite : Strict — not sent on cross-site requests (CSRF protection). 
	 * Path : Scoped to /api/v1/auth/refresh — invisible to all other paths. 
	 * Max-Age : 7 days (matches refresh token DB expiry).
	 */
	public Cookie buildRefreshCookie(String token) {
		Cookie cookie = new Cookie(cookieName, token);
		cookie.setHttpOnly(true);
		cookie.setSecure(secure);
		cookie.setPath("/api/v1/auth/refresh");
		cookie.setMaxAge(7 * 24 * 3600); // 7 days
		cookie.setAttribute("SameSite", "Strict");
		return cookie;
	}

	public Cookie clearRefreshCookie() {
		Cookie cookie = new Cookie(cookieName, "");
		cookie.setHttpOnly(true);
		cookie.setSecure(secure);
		cookie.setPath("/api/v1/auth/refresh");
		cookie.setMaxAge(0); // Delete immediately
		return cookie;
	}

	public String extractRefreshToken(HttpServletRequest req) {
		if (req.getCookies() == null)
			return null;
		return Arrays.stream(req.getCookies()).filter(c -> cookieName.equals(c.getName())).map(Cookie::getValue)
				.findFirst().orElse(null);
	}
}
