package com.example.filmservice.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO для добавления фильма в избранное")
public class FavoriteFilmDTO {
    @Schema(description = "ID пользователя, добавившего фильм в избранное", example = "1")
    Long userId;

    @Schema(description = "ID фильма, добавленного в избранное", example = "123")
    Long filmId;
}
