package com.hospital.auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.hospital.auth.filter.JwtAuthenticationFilter;
import com.hospital.auth.filter.RateLimitFilter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	private final RateLimitFilter rateLimitFilter;
	private final JwtAuthenticationFilter jwtFilter;

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		System.out.println("In Security filter chain");
		http.csrf(csrf -> csrf.disable())
				.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Server session
																									// store करणार नाही.
																									// Every request
																									// must bring auth
																									// token.
				.authorizeHttpRequests(auth -> auth
						.requestMatchers("/api/v1/auth/login", "/api/v1/auth/register", "/api/v1/auth/forgot-password",
								"/api/v1/auth/reset-password", "/api/v1/auth/verify-email",
								"/api/v1/auth/resend-verification", "/api/v1/auth/refresh", "/actuator/health")
						.permitAll().anyRequest().authenticated()) // User must be authenticated. Is Authentication
																	// present in SecurityContext?
				.exceptionHandling(ex -> ex.authenticationEntryPoint((req, res, e) -> {
					res.setContentType("application/json");
					res.setStatus(401);
					res.getWriter().write("{\"success\":false,\"error\":\"Unauthorized\"}");
				}).accessDeniedHandler((req, res, e) -> {
					res.setContentType("application/json");
					res.setStatus(403);
					res.getWriter().write("{\"success\":false,\"error\":\"Access denied\"}");
				})).addFilterBefore(rateLimitFilter, UsernamePasswordAuthenticationFilter.class) // Insert my filters
																									// BEFORE
																									// UsernamePasswordAuthenticationFilter
				.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class); // Insert my filters BEFORE
																							// UsernamePasswordAuthenticationFilter

		return http.build();
	}

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder(12);
	}

	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}

//	@Bean
//	CorsConfigurationSource corsConfigurationSource() {
//		CorsConfiguration config = new CorsConfiguration();
//		config.setAllowedOrigins(List.of("http://localhost:3000"));
//		config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
//		config.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Request-ID"));
//		config.setAllowCredentials(true); // needed for httpOnly cookie
//		config.setMaxAge(3600L);
//
//		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//		source.registerCorsConfiguration("/api/**", config);
//		return source;
//	}

}
