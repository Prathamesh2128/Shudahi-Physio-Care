package com.hospital.apigateway.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

	@Bean
	CorsFilter corsFilter() {
		// CorsConfiguration config = new CorsConfiguration();

		// config.setAllowedOrigins(List.of("http://localhost:3000"));
		// config.setAllowedMethods(List.of("*"));
		// config.setAllowedHeaders(List.of("*"));
		// config.setAllowCredentials(true);

		// UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

		// source.registerCorsConfiguration("/**", config);

		// return new CorsFilter(source);

		CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Request-ID"));
        config.setAllowCredentials(true); // needed for httpOnly cookie
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return new CorsFilter(source);
	}
}
