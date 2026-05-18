package com.hospital.auth.exception;

public class CustomExceptionHandler extends RuntimeException {
	private static final long serialVersionUID = 1L;

	public CustomExceptionHandler(String message) {
		super(message);
	}
}
