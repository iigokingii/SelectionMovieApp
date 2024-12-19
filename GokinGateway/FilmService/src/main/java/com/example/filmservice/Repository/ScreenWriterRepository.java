package com.example.filmservice.Repository;

import com.example.filmservice.Model.ScreenWriter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScreenWriterRepository extends JpaRepository<ScreenWriter,Long> {
}
