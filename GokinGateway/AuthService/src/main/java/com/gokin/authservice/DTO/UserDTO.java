package com.gokin.authservice.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO для обновления или создания пользователя")
public class UserDTO {

    @Schema(description = "ID пользователя", example = "1")
    private Long id;

    @Schema(description = "Имя пользователя", example = "Jon")
    private String username;

    @Schema(description = "Email пользователя", example = "jon.doe@example.com")
    private String email;

    @Schema(description = "Пароль пользователя", example = "my_1secret1_password")
    private String password;

    @Schema(description = "Аватар пользователя (URL)", example = "http://example.com/avatar.jpg")
    private String avatar;
}
