package com.example.filmservice.Repository;

import com.example.filmservice.Model.Musician;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface MusicianRepository extends JpaRepository<Musician, Long> {
    Optional<Musician> findByNameAndSurnameAndMiddleNameAndBirthday(String name, String surname, String middleName, LocalDate birthday);

}

