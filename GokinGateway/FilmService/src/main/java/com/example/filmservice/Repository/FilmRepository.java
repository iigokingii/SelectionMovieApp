package com.example.filmservice.Repository;

import com.example.filmservice.Model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FilmRepository extends JpaRepository<Film,Long> {
    long countByGenres(Genre genre);

    long countByDirectors(Director director);

    long countByActors(Actor actor);

    long countByScreenWriters(ScreenWriter screenwriter);

    long countByOperators(Operator operator);

    long countByMusicians(Musician musician);
    long countByProducers(Producer musician);
}
