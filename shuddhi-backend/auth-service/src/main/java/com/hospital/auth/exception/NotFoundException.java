package com.hospital.auth.exception;

public class NotFoundException extends RuntimeException {
	private static final long serialVersionUID = 3851082290332213871L;

	public NotFoundException(String message) {
		super(message);
	}
}
