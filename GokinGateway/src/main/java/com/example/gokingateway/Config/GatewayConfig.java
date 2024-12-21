//package com.example.gokingateway.Config;
//
//import org.springframework.cloud.gateway.route.RouteLocator;
//import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//@Configuration
//public class GatewayConfig {
//	@Bean
//	public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
//		return builder.routes()
//				.route("UserService", r -> r.path("/userservice/**")
//						.filters(f -> f.stripPrefix(1))
//						.uri("lb://UserService"))
//
//				.route("AuthService", r -> r.path("/authservice/**")
//						.filters(f -> f.stripPrefix(1))
//						.uri("lb://AuthService"))
//
//				.route("SwaggerService", r -> r.path("/swaggerservice/**")
//						.filters(f -> f.stripPrefix(1))
//						.uri("lb://SwaggerService"))
//
//				.route("FilmService", r -> r.path("/filmservice/**")
//						.filters(f -> f.stripPrefix(1))
//						.uri("lb://FilmService"))
//
//				.route("AiService", r -> r.path("/aiservice/**")
//						.filters(f -> f.stripPrefix(1))
//						.uri("lb://AiService"))
//
//                .route("CommentService", r -> r.path("/commentservice/**")
//                        .filters(f -> f.stripPrefix(1))
//                        .uri("lb://AiService"))
////				// Можно добавить другие маршруты
//				.build();
//	}
//}

package com.example.gokingateway.Config;

import org.apache.commons.lang.StringUtils;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.example.gokingateway.AuthenticationFilter.AuthenticationFilter;
import org.springframework.http.HttpStatus;
import reactor.core.publisher.Mono;

import java.net.URI;

@Configuration
public class GatewayConfig {

	private final AuthenticationFilter authenticationFilter;

	public GatewayConfig(AuthenticationFilter authenticationFilter) {
		this.authenticationFilter = authenticationFilter;
	}

	@Bean
	public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
		return builder.routes()
				.route("UserService", r -> r.path("/userservice/**")
						.filters(f -> f.filter(authenticationFilter.apply(new AuthenticationFilter.Config())))
						.uri("lb://UserService"))
				.route("AuthService", r -> r.path("/authservice/**")
						.filters(f -> f.stripPrefix(1)
								.filter(checkRedirectCondition()))
						.uri("lb://AuthService"))
				.route("SwaggerService", r -> r.path("/swaggerservice/**")
						.filters(f -> f.filter(authenticationFilter.apply(new AuthenticationFilter.Config())))
						.uri("lb://SwaggerService"))
				.route("FilmService", r -> r.path("/filmservice/**")
						.filters(f -> f.stripPrefix(1))
						.uri("lb://FilmService"))
				.route("AiService", r -> r.path("/aiservice/**")
						.filters(f -> f.stripPrefix(1)
								.filter(authenticationFilter.apply(new AuthenticationFilter.Config())))
						.uri("lb://AiService"))
				.build();
	}

	private GatewayFilter checkRedirectCondition() {
		return (exchange, chain) -> {
			return chain.filter(exchange).then(Mono.defer(() -> {
				var response = exchange.getResponse();
				String locationHeader = response.getHeaders().getFirst("Location");

				if (!StringUtils.isEmpty(locationHeader)) {
					response.getHeaders().remove("Location");
					response.setStatusCode(HttpStatus.FOUND); // 302
					response.getHeaders().add("Set-Cookie", "ACCESS_TOKEN=; Path=/; Max-Age=0; HttpOnly");
					response.getHeaders().add("Set-Cookie", "REFRESH_TOKEN=; Path=/; Max-Age=0; HttpOnly");
				}

				return Mono.empty();
			}));
		};
	}

}

