package com.hospital.auth.exception;

public class BadRequestException extends RuntimeException {
	private static final long serialVersionUID = 6757309123461592950L;

	public BadRequestException(String message) {
		super(message);
	}
}
