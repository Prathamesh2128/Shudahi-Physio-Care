package com.hospital.auth.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL) // जर एखादा field null असेल तर response मध्ये पाठवू नको.
public class ApiResponse<T> {
	private boolean success;
	private T data;
	private String message;
	private String error;

	public static <T> ApiResponse<T> ok(String message, T data) {
		return ApiResponse.<T>builder().success(true).message(message).data(data).build();
	}

	public static <T> ApiResponse<T> ok(String message) {
		return ApiResponse.<T>builder().success(true).message(message).build();
	}

	public static <T> ApiResponse<T> error(String error) {
		return ApiResponse.<T>builder().success(false).error(error).build();
	}
}
