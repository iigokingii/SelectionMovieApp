package com.gokin.authservice.Controller;


import com.gokin.authservice.DTO.JwtAuthenticationResponse;
import com.gokin.authservice.DTO.SignInRequest;
import com.gokin.authservice.DTO.SignUpRequest;
import com.gokin.authservice.DTO.SignUpResponse;
import com.gokin.authservice.Model.User;
import com.gokin.authservice.Security.Service.AuthenticationService;
import com.gokin.authservice.Service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Аутентификация",description = "Контроллер, отвечающий за авторизацию и регистрацию пользователей")
public class AuthController {
	private final AuthenticationService authenticationService;
	private final UserService userService;
	@Operation(summary = "Регистрация пользователя")
	@PostMapping("/auth/sign-up")
	public ResponseEntity<SignUpResponse> signUp(@RequestBody @Valid SignUpRequest request, HttpServletResponse response) {
		return authenticationService.signUp(request,response);
	}
	
	@Operation(summary = "Авторизация пользователя")
	@PostMapping("/auth/sign-in")
	public ResponseEntity<SignUpResponse> signIn(@RequestBody @Valid SignInRequest request, HttpServletResponse response) {
		return authenticationService.signIn(request, response);
	}

	@GetMapping("/auth/credentials")
	public ResponseEntity<SignUpResponse> getCredentials(HttpServletRequest request) {
		SignUpResponse credentials = authenticationService.getCredentials(request);

		if (credentials != null) {
			return ResponseEntity.ok(credentials);
		}

		return ResponseEntity.ok().build();
	}

	@DeleteMapping("/auth/logout")
	public ResponseEntity DeleteTokens(HttpServletResponse response) {
		return authenticationService.DeleteTokens(response);
	}

	@PostMapping("/auth/validate")
	public boolean validateToken() {
		return true;
	}

	@GetMapping("/auth/users")
	public List<User> GetAllUsers() {
		return userService.getUsers();
	}

	@GetMapping("/auth/users/user/{userId}")
	public User GetAllUsers(@PathVariable Long userId) {
		return userService.GetUser(userId);
	}

	@Operation(summary = "Тестовый метод")
	@GetMapping("/test")
	public String test(){
		return "test";
	}
}
