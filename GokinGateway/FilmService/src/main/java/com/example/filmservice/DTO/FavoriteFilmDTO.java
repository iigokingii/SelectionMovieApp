package com.example.filmservice.DTO;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteFilmDTO {
    Long userId;
    Long filmId;
}
