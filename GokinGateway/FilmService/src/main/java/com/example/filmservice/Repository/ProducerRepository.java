package com.example.filmservice.Repository;

import com.example.filmservice.Model.Producer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface ProducerRepository extends JpaRepository<Producer,Long> {
    Optional<Producer> findByNameAndSurnameAndMiddleNameAndBirthday(String name, String surname, String middleName, LocalDate birthday);

}
