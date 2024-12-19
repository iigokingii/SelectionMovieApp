package com.example.swaggerservice.Controller;

import com.example.swaggerservice.Constants.SwaggerURLConstants;
import io.swagger.v3.oas.models.*;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import io.swagger.v3.oas.models.media.Schema;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.function.Supplier;

@RestController
public class SwaggerAggregatorController {
	
	private final RestTemplate restTemplate;
	
	public SwaggerAggregatorController(RestTemplate restTemplate) {
		this.restTemplate = restTemplate;
	}
	
	@GetMapping("/api/swagger")
	public OpenAPI aggregateSwagger() {
		OpenAPI aggregatedApi = new OpenAPI().info(new Info().title("Общий API").version("1.0"));
		
		// Инициализация объектов Paths и Components
		Paths aggregatedPaths = new Paths();
		Components aggregatedComponents = new Components();
		
		aggregatedApi.setPaths(aggregatedPaths);
		aggregatedApi.setComponents(aggregatedComponents);
		
		List<String> microservices = SwaggerURLConstants.ALL_SWAGGER_URL;
		
		for (String url : microservices) {
			OpenAPI api = restTemplate.getForObject(url, OpenAPI.class);
			if (api != null) {
				// Объединение путей
				if (api.getPaths() != null) {
					aggregatedPaths.putAll(api.getPaths());
				}
				// Объединение схем
				if (api.getComponents() != null && api.getComponents().getSchemas() != null) {
					aggregatedComponents.setSchemas(mergeSchemas(aggregatedComponents.getSchemas(), api.getComponents().getSchemas()));
				}
			}
		}
		
		return aggregatedApi;
	}
	
	// Метод для объединения схем
	private Map<String, Schema> mergeSchemas(Map<String, Schema> existingSchemas, Map<String, Schema> newSchemas) {
		if (existingSchemas == null) {
			return newSchemas;
		}
		
		existingSchemas.putAll(newSchemas);
		return existingSchemas;
	}
}