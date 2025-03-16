package com.gokin.authservice.Security.Service;

import com.gokin.authservice.DTO.*;
import com.gokin.authservice.Exceptions.EmailAlreadyExistsException;
import com.gokin.authservice.Exceptions.InvalidUserCredentialsException;
import com.gokin.authservice.Exceptions.UsernameAlreadyExistsException;
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
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
	private final String DEFAULT_AVATAR = "qwe";
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
				.avatar("data:image/png;base64,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")
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
				.avatar(savedUser.getAvatar())
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
		try {
			authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
					request.getUsername(),
					request.getPassword()
			));

			var user = userRepository.findByUsername(request.getUsername());
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
					.avatar(user.get().getAvatar())
					.build();

			return ResponseEntity.ok(resp);
		}
		catch (UsernameNotFoundException ex){
			throw new UsernameNotFoundException("User with such email already exists");
		}
		catch(AuthenticationException ex){
			throw new InvalidUserCredentialsException("Username or password is incorrect.");
		}
	}

	public SignUpResponse getCredentials(HttpServletRequest request) {
		var authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !authentication.isAuthenticated()) {
			return null;
		}

		User user = (User)authentication.getPrincipal();
		//var user = userRepository.findByUsername(userPrincipal);

		return SignUpResponse.builder()
				.id(user.getId())
				.username(user.getUsername())
				.role(user.getRole().toString().split("_")[1].toLowerCase())
				.email(user.getEmail())
				.avatar(user.getAvatar())
				.build();
	}

	public SignUpResponse updateCredentials(HttpServletRequest request, HttpServletResponse response, UserDTO userDTO) {
		var user = userRepository.findById(userDTO.getId())
				.orElseThrow(() -> new RuntimeException("User not found with id: " + userDTO.getId()));

		if(!passwordEncoder.matches(userDTO.getPassword(), user.getPassword()))
			throw new InvalidUserCredentialsException("Password is incorrect.");

//		if (userRepository.existsByUsername(userDTO.getUsername()) && user.getId().longValue() != userDTO.getId().longValue()) {
//			throw new UsernameAlreadyExistsException("User with such username already exists");
//		}
//
//		if (userRepository.existsByEmail(userDTO.getEmail()) && user.getId().longValue() != userDTO.getId().longValue()) {
//			throw new EmailAlreadyExistsException("User with such email already exists");
//		}

		if (userRepository.existsByUsernameAndIdNot(userDTO.getUsername(), user.getId())) {
			throw new UsernameAlreadyExistsException("User with such username already exists");
		}

		if (userRepository.existsByEmailAndIdNot(userDTO.getEmail(), user.getId())) {
			throw new EmailAlreadyExistsException("User with such email already exists");
		}

		// Update user details
		user.setAvatar(userDTO.getAvatar());
		user.setEmail(userDTO.getEmail());
		user.setUsername(userDTO.getUsername());
		user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
		var saved = userRepository.save(user);

		// Generate JWT tokens
		var accessToken = jwtService.generateTokenAccessToken(saved);
		var refreshToken = jwtService.generateRefreshToken(saved);

		// Add cookies before returning response body
		ResponseCookie accessCookie = ResponseCookie.from("ACCESS_TOKEN", accessToken)
				.httpOnly(true)
				.path("/")
				.maxAge(ACCESS_TOKEN_COOKIE_EXPIRATION)
				.build();

		ResponseCookie refreshCookie = ResponseCookie.from("REFRESH_TOKEN", refreshToken)
				.httpOnly(true)
				.path("/")
				.maxAge(REFRESH_TOKEN_COOKIE_EXPIRATION)
				.build();

		response.addHeader("Set-Cookie", accessCookie.toString());
		response.addHeader("Set-Cookie", refreshCookie.toString());

		// Return the response body after cookies are set
		var resp = SignUpResponse.builder()
				.id(saved.getId())
				.username(saved.getUsername())
				.email(saved.getEmail())
				.role(saved.getRole().toString().split("_")[1].toLowerCase())
				.avatar(saved.getAvatar())
				.build();

		return resp; // ResponseEntity or other methods can be used if needed
	}



}
