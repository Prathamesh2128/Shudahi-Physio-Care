package com.hospital.auth.config;

import java.util.concurrent.Executor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
@EnableAsync
public class AsyncConfig {

	@Bean(name = "auditExecutor")
	Executor auditExecutor() {
		System.out.println("In AsyncConfig");
		ThreadPoolTaskExecutor exec = new ThreadPoolTaskExecutor();
		exec.setCorePoolSize(2);
		exec.setMaxPoolSize(5);
		exec.setQueueCapacity(200);
		exec.setThreadNamePrefix("audit-");
		exec.setRejectedExecutionHandler(new java.util.concurrent.ThreadPoolExecutor.CallerRunsPolicy());
		exec.initialize();
		return exec;
	}
}
