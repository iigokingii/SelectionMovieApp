package com.example.gokingateway.AuthenticationFilter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.http.HttpHeaders;
import reactor.core.publisher.Mono;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    private final WebClient.Builder webClientBuilder;
    private final String authServiceUrl;

    public AuthenticationFilter(WebClient.Builder webClientBuilder,
                                @Value("${authservice.url}") String authServiceUrl) {
        this.webClientBuilder = webClientBuilder;
        this.authServiceUrl = authServiceUrl;
    }

    public static class Config {
        // Параметры конфигурации фильтра (если нужно)
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            // Извлекаем JWT токен из cookies
            String accessToken = null;
            if (exchange.getRequest().getCookies().containsKey("ACCESS_TOKEN")) {
                accessToken = exchange.getRequest().getCookies().getFirst("ACCESS_TOKEN").getValue(); // Получаем значение токена из cookie
            }

            // Если токен не найден или его значение пусто
            if (accessToken == null) {
                return Mono.error(new RuntimeException("No token provided in cookies"));
            }

            // Выполняем запрос к AuthService для проверки JWT
            return webClientBuilder.baseUrl(authServiceUrl)
                    .build()
                    .post()
                    .uri("authservice/api/auth/validate") // Предположим, что у вас есть этот эндпоинт в AuthService для проверки токена
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken) // Если токен есть, передаем его как Bearer
                    .retrieve()
                    .bodyToMono(String.class) // Возвращаем информацию о валидности токена
                    .flatMap(response -> {
                        if ("valid".equals(response)) {  // Проверка валидности токена
                            return chain.filter(exchange);  // Если токен валиден, пропускаем запрос
                        } else {
                            return Mono.error(new RuntimeException("Invalid token"));
                        }
                    });
        };
    }

}

