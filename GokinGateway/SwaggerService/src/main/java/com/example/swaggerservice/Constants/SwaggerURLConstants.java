package com.example.swaggerservice.Constants;

import java.util.List;

public class SwaggerURLConstants {
	public static String AUTH_SWAGGER_URL = "http://localhost:8083/v3/api-docs";
	//public static String USER_SWAGGER_URL = "http://localhost:8084/v3/api-docs";
	public static String FILM_SWAGGER_URL = "http://localhost:8085/v3/api-docs";
	public static String CHAT_SWAGGER_URL = "http://localhost:8086/v3/api-docs";
	//	public static List<String> ALL_SWAGGER_URL = List.of(AUTH_SWAGGER_URL,USER_SWAGGER_URL,FILM_SWAGGER_URL);
	public static List<String> ALL_SWAGGER_URL = List.of(AUTH_SWAGGER_URL, FILM_SWAGGER_URL, CHAT_SWAGGER_URL);
}
