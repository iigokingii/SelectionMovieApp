import React, { useState } from "react";
import {
  Container,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Pagination,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";

// Функция для перевода текста через Google Translate API
const translateText = async (text) => {
  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ru&dt=t&q=${encodeURIComponent(text)}`
    );

    // Проверяем, что запрос прошел успешно
    if (!response.ok) {
      throw new Error("Ошибка при запросе перевода");
    }

    const data = await response.json();

    // В data[0] будут содержаться переведенные строки
    const translatedText = data[0].map((item) => item[0]).join(' '); // Объединяем все переведенные части в одну строку
    return translatedText;
  } catch (error) {
    console.error("Ошибка при переводе:", error);
    return text; // Возвращаем оригинальный текст, если произошла ошибка
  }
};

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [page, setPage] = useState(1);
  const [quizFetched, setQuizFetched] = useState(false);
  const [isError, setIsError] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Функция для получения и перевода вопросов
  const fetchQuiz = async () => {
    setIsError(false);
    try {
      const response = await fetch(
        `https://opentdb.com/api.php?amount=20&category=11&difficulty=easy&type=multiple`
      );
      const data = await response.json();
      if (data.response_code === 0) {
        // Переводим вопросы и ответы по одному
        const translatedQuestions = await Promise.all(
          data.results.map(async (q) => {
            const translatedQuestion = await translateText(q.question);
            const translatedAnswers = await Promise.all(
              q.incorrect_answers.map(async (answer) => await translateText(answer))
            );
            const translatedCorrectAnswer = await translateText(q.correct_answer);

            return {
              ...q,
              question: translatedQuestion,
              incorrect_answers: translatedAnswers,
              correct_answer: translatedCorrectAnswer,
            };
          })
        );

        setQuestions(translatedQuestions);
        setAnswers({});
        setPage(1);
        setQuizFetched(true);
      } else {
        throw new Error("Ошибка при получении данных");
      }
    } catch (error) {
      console.error("Ошибка загрузки квиза:", error);
      setIsError(true);
      setOpenSnackbar(true);
    }
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < 20) {
      alert("Ответьте на все вопросы!");
      return;
    }

    let score = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correct_answer) {
        score++;
      }
    });

    console.log(`Вы набрали ${score} из 20`);
  };

  const questionsPerPage = 10;
  const startIndex = (page - 1) * questionsPerPage;
  const paginatedQuestions = questions.slice(startIndex, startIndex + questionsPerPage);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Генератор квизов
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ display: "flex", justifyContent: "center", margin: "0 auto" }}
        onClick={fetchQuiz}
      >
        Сгенерировать квиз
      </Button>

      {quizFetched && (
        <Box sx={{ mt: 3 }}>
          {paginatedQuestions.map((q, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="h6">
                {q.question}
              </Typography>

              <RadioGroup
                value={answers[startIndex + index] || ""}
                onChange={(e) => handleAnswerChange(startIndex + index, e.target.value)}
              >
                {[...q.incorrect_answers, q.correct_answer]
                  .sort()
                  .map((option, i) => (
                    <FormControlLabel
                      key={i}
                      value={option}
                      control={<Radio />}
                      label={option}
                    />
                  ))}
              </RadioGroup>
            </Box>
          ))}

          <Pagination
            count={2}
            page={page}
            onChange={(_, value) => setPage(value)}
            sx={{ mt: 2, mb: 2 }}
          />

          {page === 2 && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <Button variant="contained" color="secondary" onClick={handleSubmit}>
                Завершить квиз
              </Button>
            </Box>
          )}
        </Box>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: "100%" }}>
          Ошибка при загрузке данных. Попробуйте позже.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Quiz;
