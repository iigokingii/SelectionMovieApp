package com.gokin.authservice.Security.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

@Component
public class JwtTokenProvider {

    @Value("${token.signing.key}")
    private String JWT_SIGNIN_SECRET;
    @Autowired
    JwtService jwtService;

    public String validateTokenAndGetUsername(String token) {
        try {
            return jwtService.extractUserName(token);
        } catch (ExpiredJwtException e) {
            throw new JwtException("Token expired", e);
        } catch (JwtException e) {
            throw new JwtException("Invalid token", e);
        }
    }
}

