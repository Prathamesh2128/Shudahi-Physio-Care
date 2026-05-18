package com.hospital.auth.filter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.hospital.auth.service.TokenServiceImpl;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
	private final TokenServiceImpl tokenService;

	@Override
	protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
			throws ServletException, IOException {

		String token = extractBearerToken(req);
		if (StringUtils.hasText(token)) {
			try {
				if (tokenService.isTokenValid(token)) {
					res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token is invalid or has been revoked");
					return;
				}
				Claims claims = tokenService.extractAllClaims(token);

				@SuppressWarnings("unchecked")
				List<String> permissions = (List<String>) claims.get("permission");
				List<SimpleGrantedAuthority> authorities = permissions.stream().map(SimpleGrantedAuthority::new)
						.collect(Collectors.toList());

				UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(claims.getSubject(),
						token, authorities);

				auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));

				SecurityContextHolder.getContext().setAuthentication(auth);

				req.setAttribute("userId", claims.getSubject());
				req.setAttribute("userEmail", claims.get("email", String.class));
				req.setAttribute("jti", claims.getId());

			} catch (ExpiredJwtException e) {
				log.debug("JWT expired: {}", e.getMessage());
				res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token expired");
				return;
			} catch (JwtException e) {
				log.warn("JWT invalid: {}", e.getMessage());
				res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token invalid");
				return;
			}
		}
	}

	private String extractBearerToken(HttpServletRequest req) {
		String header = req.getHeader("Authorization");
		if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
			return header.substring(7);
		}
		return null;
	}
}
