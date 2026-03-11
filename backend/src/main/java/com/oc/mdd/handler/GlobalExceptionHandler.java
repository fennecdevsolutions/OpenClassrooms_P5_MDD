package com.oc.mdd.handler;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import com.oc.mdd.dto.ErrorResponseDto;
import com.oc.mdd.exceptions.InvalidCredentialsException;
import com.oc.mdd.exceptions.ResourceAlreadyExistsException;
import com.oc.mdd.exceptions.ResourceNotFoundException;
import com.oc.mdd.exceptions.ValidationException;

@ControllerAdvice
public class GlobalExceptionHandler {
	private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ErrorResponseDto> handleResourceNotFound(ResourceNotFoundException ex, WebRequest request) {
		return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage(), request);
	}

	@ExceptionHandler(ResourceAlreadyExistsException.class)
	public ResponseEntity<ErrorResponseDto> handleResourceAlreadyExists(ResourceAlreadyExistsException ex,
			WebRequest request) {
		return buildResponse(HttpStatus.CONFLICT, ex.getMessage(), request);
	}

	@ExceptionHandler(InvalidCredentialsException.class)
	public ResponseEntity<ErrorResponseDto> handleInvalidCredentials(InvalidCredentialsException ex,
			WebRequest request) {
		return buildResponse(HttpStatus.UNAUTHORIZED, ex.getMessage(), request);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponseDto> handleUnexpected(Exception ex, WebRequest request) {
		logger.error("SYSTEM ERROR: An unhandled exception occurred at {}", request.getDescription(false), ex);
		return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected server error has occured", request);
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorResponseDto> handleValidation(MethodArgumentNotValidException ex, WebRequest request) {
		String firstErroMsg = ex.getBindingResult().getFieldError().getDefaultMessage();
		return buildResponse(HttpStatus.BAD_REQUEST, firstErroMsg, request);
	}

	@ExceptionHandler(ValidationException.class)
	public ResponseEntity<ErrorResponseDto> handleBusinessValidation(ValidationException ex, WebRequest request) {
		return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
	}

	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<ErrorResponseDto> handleAccessDenial(AccessDeniedException ex, WebRequest request) {
		return buildResponse(HttpStatus.FORBIDDEN,
				"Access Denied: you do not have authorization to access the requested data", request);
	}

	private ResponseEntity<ErrorResponseDto> buildResponse(HttpStatus status, String message, WebRequest request) {
		ErrorResponseDto error = new ErrorResponseDto(LocalDateTime.now(), status.value(), status.getReasonPhrase(),
				message, request.getDescription(false).replace("uri=", ""));
		return new ResponseEntity<>(error, status);
	}
}
