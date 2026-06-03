package com.hospital.auth.filter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class RateLimitFilter extends OncePerRequestFilter {

	private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

	// Limits per endpoint group
	private static final Map<String, long[]> LIMITS = Map.of("/api/v1/auth/login", new long[] { 5, 60 }, // 5 req / 60
																											// sec
			"/api/v1/auth/register", new long[] { 10, 3600 }, // 10 / hour
			"/api/v1/auth/forgot-password", new long[] { 3, 3600 }, // 3 / hour
			"/api/v1/auth/reset-password", new long[] { 5, 3600 }, // 5 / hour
			"/api/v1/auth/verify-email", new long[] { 10, 3600 }, // 10 / hour
			"/api/v1/auth/resend-verification", new long[] { 3, 3600 }, // 3 / hour
			"/api/v1/auth/refresh", new long[] { 30, 60 } // 30 / min
	);

	@Override
	protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
			throws ServletException, IOException {
		System.out.println("In RateLimitFilter");
		String path = req.getServletPath();
		long[] limit = LIMITS.get(path);

		if (limit != null) {
			String ip = getClientIp(req);
			String key = ip + ":" + path;

			Bucket bucket = buckets.computeIfAbsent(key,
					k -> Bucket.builder().addLimit(
							Bandwidth.classic(limit[0], Refill.intervally(limit[0], Duration.ofSeconds(limit[1]))))
							.build());

			ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
			if (!probe.isConsumed()) {
				res.setStatus(429);
				res.setContentType("application/json");
				res.setHeader("Retry-After", String.valueOf(probe.getNanosToWaitForRefill() / 1_000_000_000));
				res.getWriter().write("{\"success\":false,\"error\":\"Too many requests. Please slow down.\"}");
				return;
			}
			res.setHeader("X-RateLimit-Remaining", String.valueOf(probe.getRemainingTokens()));
		}
		chain.doFilter(req, res);
	}

	private String getClientIp(HttpServletRequest req) {
		String xff = req.getHeader("X-Forwarded-For");
		return xff != null ? xff.split(",")[0].trim() : req.getRemoteAddr();
	}

}
