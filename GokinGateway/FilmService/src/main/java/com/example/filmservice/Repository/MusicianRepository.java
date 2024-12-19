package com.example.filmservice.Repository;

import com.example.filmservice.Model.Musician;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MusicianRepository extends JpaRepository<Musician,Long> {
}
