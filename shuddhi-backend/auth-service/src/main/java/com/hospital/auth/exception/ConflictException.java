package com.hospital.auth.exception;

public class ConflictException extends RuntimeException {
	private static final long serialVersionUID = -3251912009052583561L;

	public ConflictException(String message) {
		super(message);
	}

}
