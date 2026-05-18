package com.hospital.auth.exception;

import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.hospital.auth.dto.response.ApiResponse;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiResponse<?>> handleValidation(MethodArgumentNotValidException ex) {
		String error = ex.getBindingResult().getFieldErrors().stream().map(FieldError::getDefaultMessage)
				.collect(Collectors.joining(", "));
		return ResponseEntity.badRequest().body(ApiResponse.error(error));
	}

	@ExceptionHandler(AccountLockedException.class)
	public ResponseEntity<ApiResponse<?>> handleLocked(AccountLockedException ex) {
		return ResponseEntity.status(403).body(ApiResponse.error(ex.getMessage()));
	}

	@ExceptionHandler(BadRequestException.class)
	public ResponseEntity<ApiResponse<?>> handleBadRequest(BadRequestException ex) {
		return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
	}

	@ExceptionHandler(ConflictException.class)
	public ResponseEntity<ApiResponse<?>> handleConflict(ConflictException ex) {
		return ResponseEntity.status(409).body(ApiResponse.error(ex.getMessage()));
	}

	@ExceptionHandler(ForbiddenException.class)
	public ResponseEntity<ApiResponse<?>> handlForbidden(ForbiddenException ex) {
		return ResponseEntity.status(403).body(ApiResponse.error(ex.getMessage()));
	}

	@ExceptionHandler(NotFoundException.class)
	public ResponseEntity<ApiResponse<?>> handleNotFound(NotFoundException ex) {
		return ResponseEntity.status(404).body(ApiResponse.error(ex.getMessage()));
	}

	@ExceptionHandler(RateLimitException.class)
	public ResponseEntity<ApiResponse<?>> handleRateLimt(RateLimitException ex) {
		return ResponseEntity.status(429).body(ApiResponse.error(ex.getMessage()));
	}

	@ExceptionHandler(ServerException.class)
	public ResponseEntity<ApiResponse<?>> handleServer(ServerException ex) {
		log.error("Unhandled exception", ex);
		return ResponseEntity.status(500).body(ApiResponse.error("Internal server error"));
	}

	@ExceptionHandler(UnauthorizedException.class)
	public ResponseEntity<ApiResponse<?>> handleUnauthorized(UnauthorizedException ex) {
		return ResponseEntity.status(401).body(ApiResponse.error(ex.getMessage()));
	}
}
