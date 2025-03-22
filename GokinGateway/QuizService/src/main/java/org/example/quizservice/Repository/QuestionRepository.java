package org.example.quizservice.Repository;

import org.example.quizservice.Model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Long>{
}
