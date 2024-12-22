package com.example.filmservice.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO для жанра фильма")
public class GenreDTO {
    @Schema(description = "Название жанра фильма", example = "Драма")
    String name;

    @Schema(description = "Описание жанра", example = "Жанр, в котором показываются эмоциональные переживания человека.")
    String description;
}
