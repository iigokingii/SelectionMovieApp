package com.example.filmservice.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import com.example.filmservice.Model.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO с опциями для фильма (жанры, режиссеры, актеры и т. д.)")
public class MovieOptionsDTO {
    @Schema(description = "Список жанров фильма")
    List<Genre> Genres;

    @Schema(description = "Список режиссеров фильма")
    List<Director> Directors;

    @Schema(description = "Список актеров фильма")
    List<Actor> Actors;

    @Schema(description = "Список сценаристов фильма")
    List<ScreenWriter> ScreenWriters;

    @Schema(description = "Список операторов фильма")
    List<Operator> Operators;

    @Schema(description = "Список музыкантов фильма")
    List<Musician> Musicians;

    @Schema(description = "Список продюсеров фильма")
    List<Producer> Producers;

    @Schema(description = "Список избранных фильмов пользователя")
    List<FavoriteFilm> FavoriteFilm;
}
