package com.example.filmservice.Repository;

import com.example.filmservice.Model.FavoriteFilm;
import com.gokin.authservice.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteFilmRepository extends JpaRepository<FavoriteFilm,Long> {
    List<FavoriteFilm> findByUserId(Long userId);
    FavoriteFilm removeFavoriteFilmById(Long id);
}
