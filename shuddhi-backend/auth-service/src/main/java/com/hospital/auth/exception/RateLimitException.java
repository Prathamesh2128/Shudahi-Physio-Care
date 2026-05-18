package com.hospital.auth.exception;

public class RateLimitException extends RuntimeException {
	private static final long serialVersionUID = -6660434980005957051L;

	public RateLimitException(String message) {
		super(message);
	}
}
