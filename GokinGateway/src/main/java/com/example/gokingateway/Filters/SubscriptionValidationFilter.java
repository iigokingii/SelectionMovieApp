//package com.example.gokingateway.Filters;
//
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.cloud.gateway.filter.GatewayFilter;
//import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
//import org.springframework.http.HttpHeaders;
//import org.springframework.stereotype.Component;
//import org.springframework.web.reactive.function.client.WebClient;
//import org.springframework.web.server.ServerWebExchange;
//import reactor.core.publisher.Mono;
//
//import java.util.stream.Collectors;
//
//@Component
//public class SubscriptionValidationFilter extends AbstractGatewayFilterFactory<SubscriptionValidationFilter.Config> {
//
//    private static final Logger log = LoggerFactory.getLogger(SubscriptionValidationFilter.class);
//    private final WebClient webClient;
//    private final String subscriptionServiceUrl;
//
//    public SubscriptionValidationFilter(WebClient.Builder webClientBuilder,
//                                        @Value("${stripeservice.url}") String subscriptionServiceUrl) {
//        this.webClient = webClientBuilder.baseUrl(subscriptionServiceUrl).build();
//        this.subscriptionServiceUrl = subscriptionServiceUrl;
//    }
//
//    public static class Config {
//    }
//
//    @Override
//    public GatewayFilter apply(Config config) {
//        return (exchange, chain) -> {
//            String url = "/api/subscription/validate";
//
//            String cookies = extractCookies(exchange);
//            if (cookies.isEmpty()) {
//                return Mono.error(new RuntimeException("No cookies provided in request"));
//            }
//
//            HttpHeaders headers = new HttpHeaders();
//            headers.add("Cookie", cookies);
//
//            return webClient.get()
//                    .uri(url)
//                    .headers(httpHeaders -> httpHeaders.addAll(headers))
//                    .retrieve()
//                    .bodyToMono(Boolean.class)
//                    .flatMap(isValid -> {
//                        if (isValid) {
//                            return chain.filter(exchange);
//                        } else {
//                            return Mono.error(new RuntimeException("Access denied: No subscription or exceeded request limit"));
//                        }
//                    })
//                    .onErrorResume(e -> {
//                        log.error("Error validating subscription", e);
//                        return Mono.error(new RuntimeException("Failed to validate subscription", e));
//                    });
//        };
//    }
//
//    private String extractCookies(ServerWebExchange exchange) {
//        return exchange.getRequest().getCookies().entrySet().stream()
//                .map(entry -> entry.getKey() + "=" + entry.getValue().get(0).getValue())
//                .collect(Collectors.joining("; "));
//    }
//}
