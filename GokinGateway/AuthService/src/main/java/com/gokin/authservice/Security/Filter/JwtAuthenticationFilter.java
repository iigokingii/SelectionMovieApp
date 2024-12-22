package com.gokin.authservice.Security.Filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gokin.authservice.DTO.ErrorResponse;
import com.gokin.authservice.Security.Service.JwtService;
import com.gokin.authservice.Service.UserService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
	private static final String ACCESS_TOKEN = "ACCESS_TOKEN";
	private static final String REFRESH_TOKEN = "REFRESH_TOKEN";
	@Value("${token.signing.access.expiration}")
	private long ACCESS_TOKEN_COOKIE_EXPIRATION;
	
	private final JwtService jwtService;
	private final UserService userService;
	
	@Override
	protected void doFilterInternal(
			@NonNull HttpServletRequest request,
			@NonNull HttpServletResponse response,
			@NonNull FilterChain filterChain
	) throws ServletException, IOException {
		
		String accessToken = getTokenFromCookies(request, ACCESS_TOKEN);
		String refreshToken = getTokenFromCookies(request, REFRESH_TOKEN);
		
		if (StringUtils.isEmpty(accessToken) && StringUtils.isEmpty(refreshToken)) {
			filterChain.doFilter(request, response);
			return;
		}
		
		if (StringUtils.isNotEmpty(accessToken)) {
			authenticateWithAccessToken(request, accessToken);
		}
		
		if (StringUtils.isNotEmpty(refreshToken) && SecurityContextHolder.getContext().getAuthentication() == null) {
			handleRefreshToken(refreshToken, request, response);
		}
		
		filterChain.doFilter(request, response);
	}
	
	private String getTokenFromCookies(HttpServletRequest request, String tokenName) {
		Cookie[] cookies = request.getCookies();
		if (cookies == null) {
			return "";
		}
		
		return Arrays.stream(request.getCookies())
				.filter(cookie -> cookie.getName().equals(tokenName))
				.map(Cookie::getValue)
				.findFirst()
				.orElse("");
	}

	private void authenticateWithAccessToken(HttpServletRequest request, String accessToken) {
		try {
			String username = jwtService.extractUserName(accessToken);
			if (StringUtils.isNotEmpty(username) && SecurityContextHolder.getContext().getAuthentication() == null) {
				UserDetails userDetails = userService.userDetailsService().loadUserByUsername(username);

				if (jwtService.isTokenValid(accessToken, userDetails)) {
					setAuthentication(username, userDetails, request);
				}
			}
		} catch (ExpiredJwtException ex) {
			logger.info(ex.getMessage());
		} catch (Exception ex) {
			logger.error("Error while validating access token.", ex);
		}
	}

	private void handleRefreshToken(String refreshToken, HttpServletRequest request, HttpServletResponse response) throws IOException {
		String username;
		try {
			username = jwtService.extractUserName(refreshToken);
		} catch (ExpiredJwtException | IllegalArgumentException e) {
			response.addHeader("Location","/sign-in");
			response.setStatus(302);
			return;
		}
		UserDetails userDetails = null;
		try{
			userDetails = userService.userDetailsService().loadUserByUsername(username);
		}
		catch (UsernameNotFoundException ex){
			invalidateOldAccessToken(response);
			invalidateOldRefreshToken(response);
			response.setStatus(HttpServletResponse.SC_NOT_FOUND); // 404
			ErrorResponse errorResponse = new ErrorResponse("Username doesn't found", ex.getMessage());
			// Set the error response in the body
			response.setContentType("application/json");
			response.getWriter().write(new ObjectMapper().writeValueAsString(errorResponse));
			return;
		}

		if (jwtService.isTokenValid(refreshToken, userDetails)) {
			String newAccessToken = jwtService.generateTokenAccessToken(userDetails);

			invalidateOldAccessToken(response);
			ResponseCookie accessCookie = ResponseCookie.from("ACCESS_TOKEN", newAccessToken)
					.httpOnly(true)
					.path("/")
					.maxAge(ACCESS_TOKEN_COOKIE_EXPIRATION)
					.build();
			response.addHeader("Set-Cookie", accessCookie.toString());

			setAuthentication(username, userDetails, request);
		} else {
			response.addHeader("Location","/sign-in");
			response.setStatus(302);
		}
	}


	private void invalidateOldAccessToken(HttpServletResponse response) {
		Cookie oldAccessTokenCookie = new Cookie(ACCESS_TOKEN, null);
		oldAccessTokenCookie.setMaxAge(0); // Set its age to 0 to delete it
		oldAccessTokenCookie.setPath("/"); // Set the path to ensure deletion
		response.addCookie(oldAccessTokenCookie);
	}

	private void invalidateOldRefreshToken(HttpServletResponse response) {
		Cookie oldRefreshTokenCookie = new Cookie(REFRESH_TOKEN, null);
		oldRefreshTokenCookie.setMaxAge(0); // Set its age to 0 to delete it
		oldRefreshTokenCookie.setPath("/"); // Set the path to ensure deletion
		response.addCookie(oldRefreshTokenCookie);
	}
	
	private void setAuthentication(String username, UserDetails userDetails, HttpServletRequest request) {
		SecurityContext context = SecurityContextHolder.createEmptyContext();
		UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
				userDetails,
				null,
				userDetails.getAuthorities()
		);
		authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
		context.setAuthentication(authToken);
		SecurityContextHolder.setContext(context);
	}
}