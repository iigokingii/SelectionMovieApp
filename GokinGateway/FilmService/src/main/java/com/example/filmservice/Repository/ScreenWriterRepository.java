package com.example.filmservice.Repository;

import com.example.filmservice.Model.ScreenWriter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface ScreenWriterRepository extends JpaRepository<ScreenWriter,Long> {
    Optional<ScreenWriter> findByNameAndSurnameAndMiddleNameAndBirthday(String name, String surname, String middleName, LocalDate birthday);

}
