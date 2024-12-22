package com.example.filmservice.DTO;

import com.example.filmservice.Model.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieOptionsDTO {
    List<Genre> Genres;
    List<Director> Directors;
    List<Actor> Actors;
    List<ScreenWriter> ScreenWriters;
    List<Operator> Operators;
    List<Musician> Musicians;
    List<Producer> Producers;
    List<FavoriteFilm> FavoriteFilm;
}
