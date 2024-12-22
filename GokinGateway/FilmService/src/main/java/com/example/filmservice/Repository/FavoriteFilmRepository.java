package com.example.filmservice.Repository;

import com.example.filmservice.Model.FavoriteFilm;
import com.gokin.authservice.Model.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteFilmRepository extends JpaRepository<FavoriteFilm,Long> {
    List<FavoriteFilm> findByUserId(Long userId);
    @Modifying
    @Transactional
    @Query("DELETE FROM FavoriteFilm f WHERE f.id = :id")
    void removeFavoriteFilmById(Long id);
}
