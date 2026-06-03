package com.hospital.auth.config;

import java.time.Duration;
import java.util.Map;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;

@Configuration
@EnableCaching
public class CacheConfig {

	@Bean
	RedisCacheManager cacheManager(RedisConnectionFactory factory) {
		System.out.println("In CacheConfig");
		RedisSerializationContext.SerializationPair<Object> json = RedisSerializationContext.SerializationPair
				.fromSerializer(new GenericJackson2JsonRedisSerializer());

		// default 60-second TTL
		RedisCacheConfiguration defaults = RedisCacheConfiguration.defaultCacheConfig().entryTtl(Duration.ofSeconds(60))
				.serializeValuesWith(json).disableCachingNullValues();

		// Per-cache TTL overrides
		Map<String, RedisCacheConfiguration> cacheConfigs = Map.of("user:profile",
				defaults.entryTtl(Duration.ofSeconds(60)), "roles:all", defaults.entryTtl(Duration.ofMinutes(10)),
				"permissions", defaults.entryTtl(Duration.ofMinutes(30)));

		return RedisCacheManager.builder(factory).cacheDefaults(defaults).withInitialCacheConfigurations(cacheConfigs)
				.build();
	}
}
