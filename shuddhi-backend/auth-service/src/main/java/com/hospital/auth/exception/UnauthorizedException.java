package com.hospital.auth.exception;

public class UnauthorizedException extends RuntimeException {
	private static final long serialVersionUID = 5587582140890797L;

	public UnauthorizedException(String message) {
		super(message);
	}
}
