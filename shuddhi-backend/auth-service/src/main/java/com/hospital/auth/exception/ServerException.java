package com.hospital.auth.exception;

public class ServerException extends RuntimeException {
	private static final long serialVersionUID = 3024108366410550898L;

	public ServerException(String message) {
		super(message);
	}
}
