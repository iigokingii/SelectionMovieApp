package com.example.filmservice.Repository;

import com.example.filmservice.Model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating,Long> {
    Optional<Rating> findRatingById(Long id);
    Optional<Rating> findByFilmIdAndUserId(Long filmId, Long userId);
    List<Rating> findRatingsByFilmId(Long filmId);
}
