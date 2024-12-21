package com.example.filmservice.Repository;

import com.example.filmservice.Model.Director;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface DirectorRepository extends JpaRepository<Director,Long> {
    Optional<Director> findByNameAndSurnameAndMiddleNameAndBirthday(String name, String surname, String middleName, LocalDate birthday);

}
