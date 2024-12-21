package com.example.filmservice.Repository;

import com.example.filmservice.Model.Actor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface ActorRepository extends JpaRepository<Actor,Long> {
    Optional<Actor> findByNameAndSurnameAndMiddleNameAndBirthday(String name, String surname, String middleName, LocalDate birthday);

}
