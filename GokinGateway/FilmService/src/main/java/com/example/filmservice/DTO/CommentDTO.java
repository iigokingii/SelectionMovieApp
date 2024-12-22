package com.example.filmservice.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO для комментария фильма")
public class CommentDTO {
    @Schema(description = "Текст комментария", example = "Очень интересный фильм!")
    String comment;

    @Schema(description = "ID пользователя, оставившего комментарий", example = "1")
    Long userId;
}
