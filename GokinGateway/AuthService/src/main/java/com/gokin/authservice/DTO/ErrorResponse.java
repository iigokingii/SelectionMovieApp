package com.gokin.authservice.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Ответ с ошибкой")
public class ErrorResponse {
	@Schema(description = "Тип ошибки", example = "Unauthorized")
	private String error;

	@Schema(description = "Сообщение об ошибке", example = "Invalid credentials")
	private String message;
}
