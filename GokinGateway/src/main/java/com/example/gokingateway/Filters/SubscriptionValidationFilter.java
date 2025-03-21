package com.example.gokingateway.Filters;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class SubscriptionValidationFilter extends AbstractGatewayFilterFactory<SubscriptionValidationFilter.Config> {

    private static final Logger log = LoggerFactory.getLogger(SubscriptionValidationFilter.class);
    private final WebClient webClient;
    private final String subscriptionServiceUrl;

    public SubscriptionValidationFilter(WebClient.Builder webClientBuilder,
                                        @Value("${stripeservice.url}") String subscriptionServiceUrl) {
        this.webClient = webClientBuilder.baseUrl(subscriptionServiceUrl).build();
        this.subscriptionServiceUrl = subscriptionServiceUrl;
    }

    public static class Config {
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String requestPath = exchange.getRequest().getURI().getPath();

            if (!requestPath.equals("/aiservice/api/ai-chat")) {
                return chain.filter(exchange);
            }

            String url = "/api/subscription/validate";
            String cookies = extractCookies(exchange);

            if (cookies.isEmpty()) {
                return respondWithError(exchange, HttpStatus.UNAUTHORIZED, "Авторизуйтесь, чтобы выполнять запрос");
            }

            HttpHeaders headers = new HttpHeaders();
            headers.add("Cookie", cookies);

            String email = exchange.getRequest().getQueryParams().getFirst("email");
            if (email == null || email.isEmpty()) {
                return respondWithError(exchange, HttpStatus.BAD_REQUEST, "Не указан email в запросе");
            }

            return webClient.get()
                    .uri(uriBuilder -> uriBuilder.path(url).queryParam("email", email).build())
                    .headers(httpHeaders -> httpHeaders.addAll(headers))
                    .retrieve()
                    .bodyToMono(Boolean.class)
                    .flatMap(isValid -> {
                        if (isValid) {
                            return chain.filter(exchange);
                        } else {
                            return respondWithError(exchange, HttpStatus.FORBIDDEN, "Доступ заблокирован: превышен лимит запросов. Приобретите подписку, чтобы снять лимит");
                        }
                    })
                    .onErrorResume(e -> {
                        log.error("Ошибка при проверке подписки", e);
                        return respondWithError(exchange, HttpStatus.INTERNAL_SERVER_ERROR, "Не удалось проверить подписку");
                    });
        };
    }


    private final ObjectMapper objectMapper = new ObjectMapper();

    private Mono<Void> respondWithError(ServerWebExchange exchange, HttpStatus status, String message) {
        exchange.getResponse().setStatusCode(status);
        exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);

        String jsonResponse;
        try {
            jsonResponse = objectMapper.writeValueAsString(Map.of(
                    "status", status.value(),
                    "error", status.getReasonPhrase(),
                    "message", message
            ));
        } catch (Exception e) {
            jsonResponse = "{\"status\":500,\"error\":\"Internal Server Error\",\"message\":\"Ошибка обработки JSON\"}";
        }

        byte[] bytes = jsonResponse.getBytes(StandardCharsets.UTF_8);
        DataBuffer buffer = exchange.getResponse().bufferFactory().wrap(bytes);
        return exchange.getResponse().writeWith(Mono.just(buffer));
    }

    private String extractCookies(ServerWebExchange exchange) {
        return exchange.getRequest().getCookies().entrySet().stream()
                .map(entry -> entry.getKey() + "=" + entry.getValue().get(0).getValue())
                .collect(Collectors.joining("; "));
    }
}
