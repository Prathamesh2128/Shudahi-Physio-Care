package com.hospital.auth.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Data
@Configuration
@ConfigurationProperties(prefix = "hms.jwt")
public class JwtConfig {
	private String accessSecret;
	private String refreshSecret;
	private int accessExpirySeconds; // 900
	private int refreshExpiryDays; // 7
}
