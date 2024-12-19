package com.gokin.authservice.Security.Service;

import com.gokin.authservice.DTO.JwtAuthenticationResponse;
import com.gokin.authservice.DTO.SignInRequest;
import com.gokin.authservice.DTO.SignUpRequest;
import com.gokin.authservice.DTO.SignUpResponse;
import com.gokin.authservice.Exceptions.InvalidUserCredentialsException;
import com.gokin.authservice.Model.Role;
import com.gokin.authservice.Model.User;
import com.gokin.authservice.Repository.UserRepository;
import com.gokin.authservice.Service.UserService;
import io.micrometer.common.util.StringUtils;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
	private final UserService userService;
	private final JwtService jwtService;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;
	private final UserRepository userRepository;
	@Value("${cookie.signing.refresh.expiration}")
	private long REFRESH_TOKEN_COOKIE_EXPIRATION;
	@Value("${cookie.signing.access.expiration}")
	private long ACCESS_TOKEN_COOKIE_EXPIRATION;
	private final String ACCESS_TOKEN = "ACCESS_TOKEN";
	private final String REFRESH_TOKEN = "REFRESH_TOKEN";
	/**
	 * Регистрация пользователя
	 *
	 * @param request данные пользователя
	 * @return токен
	 */
	public ResponseEntity<SignUpResponse> signUp(SignUpRequest request, HttpServletResponse response) {
		var user = User.builder()
				.username(request.getUsername())
				.email(request.getEmail())
				.password(passwordEncoder.encode(request.getPassword()))
				.role(Role.ROLE_USER)
				.build();
		
		var savedUser = userService.create(user);
		
		var accessToken = jwtService.generateTokenAccessToken(savedUser);
		var refreshToken = jwtService.generateRefreshToken(savedUser);
		
		ResponseCookie accessCookie = ResponseCookie.from("ACCESS_TOKEN", accessToken)
				.httpOnly(true)
				//.secure(false)
				.path("/")
				//.sameSite("None")
				.maxAge(ACCESS_TOKEN_COOKIE_EXPIRATION)
				.build();
		
		ResponseCookie refreshCookie = ResponseCookie.from("REFRESH_TOKEN", refreshToken)
				.httpOnly(true)
				//.secure(false)
				.path("/")
				//.sameSite("None")
				.maxAge(REFRESH_TOKEN_COOKIE_EXPIRATION)
				.build();
		
		response.addHeader("Set-Cookie", accessCookie.toString());
		response.addHeader("Set-Cookie", refreshCookie.toString());
		
		var resp = SignUpResponse.builder()
				.id(savedUser.getId())
				.username(savedUser.getUsername())
				.email(savedUser.getEmail())
				.role(savedUser.getRole().toString().split("_")[1].toLowerCase())
				.build();
		
		return ResponseEntity.ok(resp);
	}

	public ResponseEntity DeleteTokens(HttpServletResponse response) {
		invalidateAccessToken(response);
		invalidateRefreshToken(response);
		return ResponseEntity.ok().build();
	}

	private void invalidateAccessToken(HttpServletResponse response) {
		// Create a cookie with the same name as the old access token
		Cookie oldAccessTokenCookie = new Cookie(ACCESS_TOKEN, null);
		oldAccessTokenCookie.setMaxAge(0); // Set its age to 0 to delete it
		oldAccessTokenCookie.setPath("/"); // Set the path to ensure deletion
		response.addCookie(oldAccessTokenCookie);
	}

	private void invalidateRefreshToken(HttpServletResponse response) {
		// Create a cookie with the same name as the old refresh token
		Cookie oldRefreshTokenCookie = new Cookie(REFRESH_TOKEN, null);
		oldRefreshTokenCookie.setMaxAge(0); // Set its age to 0 to delete it
		oldRefreshTokenCookie.setPath("/"); // Set the path to ensure deletion
		response.addCookie(oldRefreshTokenCookie);
	}

	/**
	 * Аутентификация пользователя
	 *
	 * @param request данные пользователя
	 * @return токен
	 */
	public ResponseEntity<SignUpResponse> signIn(SignInRequest request, HttpServletResponse response) {
		authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
				request.getUsername(),
				request.getPassword()
		));
		
		var user = userRepository.findByUsername(request.getUsername());
		
		if(!passwordEncoder.matches(request.getPassword(),user.get().getPassword()))
			throw new InvalidUserCredentialsException("Username or password is incorrect.");

		var accessToken = jwtService.generateTokenAccessToken(user.get());
		var refreshToken = jwtService.generateRefreshToken(user.get());

		ResponseCookie accessCookie = ResponseCookie.from("ACCESS_TOKEN", accessToken)
				.httpOnly(true)
				//.secure(false)
				.path("/")
				//.sameSite("None")
				.maxAge(ACCESS_TOKEN_COOKIE_EXPIRATION)
				.build();

		ResponseCookie refreshCookie = ResponseCookie.from("REFRESH_TOKEN", refreshToken)
				.httpOnly(true)
				//.secure(false)
				.path("/")
				//.sameSite("None")
				.maxAge(REFRESH_TOKEN_COOKIE_EXPIRATION)
				.build();

		response.addHeader("Set-Cookie", accessCookie.toString());
		response.addHeader("Set-Cookie", refreshCookie.toString());

		var resp = SignUpResponse.builder()
				.id(user.get().getId())
				.username(user.get().getUsername())
				.email(user.get().getEmail())
				.role(user.get().getRole().toString().split("_")[1].toLowerCase())
				.build();

		return ResponseEntity.ok(resp);
	}

	public SignUpResponse getCredentials(HttpServletRequest request) {
		var authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !authentication.isAuthenticated()) {
			return null;
		}

		var userDetails = (UserDetails) authentication.getPrincipal();
		var user = userRepository.findByUsername(userDetails.getUsername());

		return SignUpResponse.builder()
				.id(user.get().getId())
				.username(user.get().getUsername())
				.role(user.get().getRole().toString().split("_")[1].toLowerCase())
				.email(user.get().getEmail())
				.build();
	}

}
