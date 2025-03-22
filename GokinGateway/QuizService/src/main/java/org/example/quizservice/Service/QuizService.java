package org.example.quizservice.Service;

import org.example.quizservice.Model.Question;
import org.example.quizservice.Model.Quiz;
import org.example.quizservice.Repository.QuestionRepository;
import org.example.quizservice.Repository.QuizRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QuizService {
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;

    public QuizService(QuizRepository quizRepository, QuestionRepository questionRepository) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
    }

    public Quiz GenerateQuiz(int questionCount) {
        return Quiz.builder().title("random").questions(GenerateQuestions(questionCount)).build();
    }

//    public List<Quiz> getAllQuizzes() {
//        return quizRepository.findAll();
//    }
//
//    public Optional<Quiz> getQuizById(Long id) {
//        return quizRepository.findById(id);
//    }
//
//    public Quiz createQuiz(Quiz quiz) {
//        return quizRepository.save(quiz);
//    }
//
//    public void deleteQuiz(Long id) {
//        quizRepository.deleteById(id);
//    }

    private List<Question> GenerateQuestions(int questionCount) {
        var questions = questionRepository.findAll();

        Collections.shuffle(questions);

        return questions.stream().limit(questionCount).collect(Collectors.toList());
    }
}

