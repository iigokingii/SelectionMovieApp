package com.example.filmservice.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO для фильма")
public class FilmDTO {
    @Schema(description = "Возрастное ограничение фильма", example = "16")
    int age;

    @Schema(description = "Рейтинг фильма на IMDB", example = "8.2")
    float imdb_rating;

    @Schema(description = "Рейтинг фильма на КиноПоиск", example = "7.9")
    float kinopoisk_rating;

    @Schema(description = "Общая касса фильма в мире", example = "1000000000")
    float total_box_office;

    @Schema(description = "Дата выхода фильма", example = "2022-05-15")
    Date year_of_posting;

    @Schema(description = "Страна производства фильма", example = "USA")
    String country_produced;

    @Schema(description = "Описание фильма", example = "Фильм о приключениях в будущем...")
    String description;

    @Schema(description = "Продолжительность фильма в минутах", example = "120")
    String duration;

    @Schema(description = "Оригинальное название фильма", example = "The Avengers")
    String original_title;

    @Schema(description = "Название фильма", example = "Мстители")
    String title;

    @Schema(description = "URL постера фильма", example = "https://example.com/poster.jpg")
    String poster;

    String youtubeUrl;
}
