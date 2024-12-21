package com.example.filmservice.Repository;

import com.example.filmservice.Model.Operator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface OperatorRepository extends JpaRepository<Operator,Long> {
    Optional<Operator> findByNameAndSurnameAndMiddleNameAndBirthday(String name, String surname, String middleName, LocalDate birthday);

}
