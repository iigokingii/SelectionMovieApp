package com.gokin.authservice.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Ответ после регистрации нового пользователя")
public class SignUpResponse {

	@Schema(description = "ID пользователя", example = "1")
	private Long id;

	@Schema(description = "Роль пользователя", example = "USER")
	private String role;

	@Schema(description = "Имя пользователя", example = "Jon")
	private String username;

	@Schema(description = "Email пользователя", example = "jon.doe@example.com")
	private String email;

	@Schema(description = "Аватар пользователя (URL)", example = "http://example.com/avatar.jpg")
	private String avatar;
}
