package com.example.gokingateway.Filters;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.stream.Collectors;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    private static final Logger log = LoggerFactory.getLogger(AuthenticationFilter.class);
    private final WebClient webClient;
    private final String authServiceBaseUrl;

    public AuthenticationFilter(WebClient.Builder webClientBuilder,
                                @Value("${authservice.url}") String authServiceBaseUrl) {
        this.webClient = webClientBuilder.baseUrl(authServiceBaseUrl).build();
        this.authServiceBaseUrl = authServiceBaseUrl;
    }

    public static class Config {

    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String url = "/api/auth/validate";

            String cookies = extractCookies(exchange);
            if (cookies.isEmpty()) {
                return Mono.error(new RuntimeException("No cookies provided in request"));
            }

            HttpHeaders headers = new HttpHeaders();
            headers.add("Cookie", cookies);
            //headers.addAll(exchange.getRequest().getHeaders());

            return webClient.post()
                    .uri(url)
                    .headers(httpHeaders -> httpHeaders.addAll(headers))
                    .retrieve()
                    .bodyToMono(Boolean.class)
                    .flatMap(result -> {
                        if (result) {
                            return chain.filter(exchange); // Если пользователь прошел аутентификацию, продолжаем выполнение фильтра
                        } else {
                            return Mono.error(new RuntimeException("Invalid user or token"));
                        }
                    })
                    .onErrorResume(e -> Mono.error(new RuntimeException("Failed to authenticate user", e)));
        };
    }

    private String extractCookies(ServerWebExchange exchange) {
        return exchange.getRequest().getCookies().entrySet().stream()
                .map(entry -> entry.getKey() + "=" + entry.getValue().get(0).getValue())
                .collect(Collectors.joining("; "));
    }
}
