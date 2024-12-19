package com.example.filmservice.DTO;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FilmDTO {
    int age;
    float imdb_rating;
    float kinopoisk_rating;
    float total_box_office;
    Date year_of_posting;
    String country_produced;
    String description;
    String duration;
    String original_title;
    String title;
    String poster;
}
