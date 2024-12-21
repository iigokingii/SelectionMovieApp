package com.example.filmservice.Repository;

import com.example.filmservice.Model.Director;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FavoriteFilmRepository extends JpaRepository<Director,Long> {
}
