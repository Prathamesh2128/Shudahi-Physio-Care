package com.hospital.auth.exception;

public class AccountLockedException extends RuntimeException {
	private static final long serialVersionUID = -5952243638111237435L;

	public AccountLockedException(String message) {
		super(message);
	}
}
