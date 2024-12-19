package com.gokin.authservice.Controller;

import com.gokin.authservice.DTO.ErrorResponse;
import com.gokin.authservice.Exceptions.EmailAlreadyExistsException;
import com.gokin.authservice.Exceptions.InvalidUserCredentialsException;
import com.gokin.authservice.Exceptions.UsernameAlreadyExistsException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
	
	@ExceptionHandler(UsernameAlreadyExistsException.class)
	public ResponseEntity<ErrorResponse> handleUsernameAlreadyExists(UsernameAlreadyExistsException ex) {
		ErrorResponse errorResponse = new ErrorResponse("Username Conflict", ex.getMessage());
		return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
	}
	
	@ExceptionHandler(EmailAlreadyExistsException.class)
	public ResponseEntity<ErrorResponse> handleEmailAlreadyExists(EmailAlreadyExistsException ex) {
		ErrorResponse errorResponse = new ErrorResponse("Email Conflict", ex.getMessage());
		return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
	}
	
	@ExceptionHandler(UsernameNotFoundException.class)
	public ResponseEntity<ErrorResponse> handleUsernameNotFound(UsernameNotFoundException ex){
		ErrorResponse errorResponse = new ErrorResponse("Username doesn't found",ex.getMessage());
		return new ResponseEntity<>(errorResponse,HttpStatus.NOT_FOUND);
	}
	
	@ExceptionHandler(InvalidUserCredentialsException.class)
	public ResponseEntity<ErrorResponse> handleInvalidUserCredentials(InvalidUserCredentialsException ex){
		ErrorResponse errorResponse = new ErrorResponse("Invalid credentials",ex.getMessage());
		return new ResponseEntity<>(errorResponse,HttpStatus.BAD_REQUEST);
	}
	// Обработка других исключений...
}
