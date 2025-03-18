package com.gokin.authservice.Security.Service;

import com.gokin.authservice.Repository.UserRepository;
import com.gokin.authservice.Service.UserService;
import com.gokin.authservice.Model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class OAuthSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    @Value("${token.signing.refresh.expiration}")
    private long REFRESH_TOKEN_COOKIE_EXPIRATION;
    @Value("${token.signing.access.expiration}")
    private long ACCESS_TOKEN_COOKIE_EXPIRATION;
    @Autowired
    private final UserService userService;
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");

        Optional<User> existingUser = userRepository.findByEmail(email);

        User user;
        if (existingUser.isEmpty()) {
            user = userService.registerOAuthUser(oauthUser);
        } else {
            user = existingUser.get();
        }

        String accessToken = jwtService.generateTokenAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

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

        String redirectUrl = UriComponentsBuilder.fromUriString("http://localhost:3000/main")
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}

