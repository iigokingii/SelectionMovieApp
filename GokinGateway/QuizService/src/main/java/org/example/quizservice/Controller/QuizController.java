package org.example.quizservice.Controller;


import org.example.quizservice.Model.Quiz;
import org.example.quizservice.Service.QuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {
    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping("/random")
    public Quiz getQuiz(@RequestParam int questionCount) {
        return quizService.GenerateQuiz(questionCount);
    }

//    @GetMapping
//    public List<Quiz> getAllQuizzes() {
//        return quizService.getAllQuizzes();
//    }

//    @GetMapping("/{id}")
//    public ResponseEntity<Quiz> getQuizById(@PathVariable Long id) {
//        return quizService.getQuizById(id)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }
//
//    @PostMapping
//    public Quiz createQuiz(@RequestBody Quiz quiz) {
//        return quizService.createQuiz(quiz);
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteQuiz(@PathVariable Long id) {
//        quizService.deleteQuiz(id);
//        return ResponseEntity.noContent().build();
//    }
}

