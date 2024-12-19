package com.gokin.authservice.Exceptions;

public class InvalidUserCredentialsException extends RuntimeException{
	public InvalidUserCredentialsException(String message){
		super(message);
	}
}
