package com.gokin.authservice.Controller;

import com.gokin.authservice.DTO.*;
import com.gokin.authservice.Model.User;
import com.gokin.authservice.Security.Service.AuthenticationService;
import com.gokin.authservice.Security.Service.JwtTokenProvider;
import com.gokin.authservice.Service.EmailService;
import com.gokin.authservice.Service.UserService;
import io.jsonwebtoken.JwtException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Аутентификация", description = "Контроллер, отвечающий за авторизацию и регистрацию пользователей")
public class AuthController {
	@Value("${app.frontend.url}")
	private String frontendUrl;
	private final AuthenticationService authenticationService;
	private final UserService userService;
	@Autowired private final EmailService emailService;
	@Autowired
	private final JwtTokenProvider jwtTokenProvider;

	@Operation(summary = "Регистрация пользователя", description = "Регистрирует нового пользователя в системе.")
	@PostMapping("/auth/sign-up")
	public ResponseEntity<SignUpResponse> signUp(
			@RequestBody @Valid SignUpRequest request,
			HttpServletResponse response) {
		return authenticationService.signUp(request, response);
	}

	@PostMapping("/forgot-password")
	public String forgotPassword(@RequestParam String email) {
		String token = UUID.randomUUID().toString();
		String resetLink = frontendUrl + "/reset-password?token=" + token;

		emailService.sendPasswordResetEmail(email, resetLink);
		return "Инструкция по сбросу пароля отправлена на ваш email.";
	}

	@Operation(summary = "Авторизация пользователя", description = "Авторизует пользователя и выдает токен.")
	@PostMapping("/auth/sign-in")
	public ResponseEntity<SignUpResponse> signIn(
			@RequestBody @Valid SignInRequest request,
			HttpServletResponse response) {
		return authenticationService.signIn(request, response);
	}

	@Operation(summary = "Проверка сессии", description = "Проверяет, действительна ли текущая сессия пользователя.")
	@GetMapping("/auth/check-session")
	public ResponseEntity<?> checkSession(HttpServletRequest request) {
		Cookie[] cookies = request.getCookies();
		String accessToken = null;
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if ("ACCESS_TOKEN".equals(cookie.getName())) {
					accessToken = cookie.getValue();
				}
			}
		}
		if (accessToken == null || accessToken.isEmpty()) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Session expired or not logged in.");
		}

		try {
			String username = jwtTokenProvider.validateTokenAndGetUsername(accessToken);
			return ResponseEntity.ok("Session is valid.");
		} catch (JwtException | IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
		}
	}

	@Operation(summary = "Получение данных пользователя", description = "Возвращает данные пользователя, если он авторизован.")
	@GetMapping("/auth/credentials")
	public ResponseEntity<SignUpResponse> getCredentials(HttpServletRequest request) {
		SignUpResponse credentials = authenticationService.getCredentials(request);

		if (credentials != null) {
			return ResponseEntity.ok(credentials);
		}

		return ResponseEntity.ok().build();
	}

	@Operation(summary = "Обновление данных пользователя", description = "Обновляет данные пользователя, если он авторизован.")
	@PostMapping("/auth/credentials")
	public ResponseEntity<SignUpResponse> updateUser(
			HttpServletRequest request,
			HttpServletResponse response,
			@RequestBody UserDTO user) {
		SignUpResponse credentials = authenticationService.updateCredentials(request, response, user);
		return ResponseEntity.ok(credentials);
	}

	@Operation(summary = "Выход из системы", description = "Удаляет токены и завершает сессию пользователя.")
	@DeleteMapping("/auth/logout")
	public ResponseEntity<?> DeleteTokens(HttpServletResponse response) {
		return authenticationService.DeleteTokens(response);
	}

	@Operation(summary = "Проверка валидности токена", description = "Проверяет, является ли текущий токен действительным.")
	@PostMapping("/auth/validate")
	public boolean validateToken() {
		return true;
	}

	@Operation(summary = "Получить всех пользователей", description = "Возвращает список всех пользователей в системе.")
	@GetMapping("/auth/users")
	public List<User> GetAllUsers() {
		return userService.getUsers();
	}

	@Operation(summary = "Получить пользователя по ID", description = "Возвращает данные пользователя по его ID.")
	@GetMapping("/auth/users/user/{userId}")
	public User GetAllUsers(@Parameter(description = "ID пользователя") @PathVariable Long userId) {
		return userService.GetUser(userId);
	}

	@Operation(summary = "Тестовый метод", description = "Простой тестовый метод, возвращающий строку.")
	@GetMapping("/test")
	public String test() {
		return "test";
	}
}
