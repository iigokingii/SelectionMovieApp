import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Checkbox,
  FormControlLabel,
  Box,
  Pagination,
  Snackbar,
  Alert,
  Button,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [page, setPage] = useState(1);
  const [quizFetched, setQuizFetched] = useState(false);
  const [isError, setIsError] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [responseTitle, setResponseTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedMovies, setSuggestedMovies] = useState(null);

  const fetchQuiz = async (questionCount = 20) => {
    setIsError(false);
    try {
      const response = await fetch(
        `http://localhost:8082/quizservice/api/quizzes/random?questionCount=${questionCount}`
      );
      const data = await response.json();
      if (data && data.questions.length > 0) {
        setQuestions(data.questions);
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

  const handleAnswerChange = (questionIndex, answer, isChecked) => {
    setAnswers((prev) => {
      const updatedAnswers = { ...prev };
      if (!updatedAnswers[questionIndex]) {
        updatedAnswers[questionIndex] = [];
      }
      if (isChecked) {
        updatedAnswers[questionIndex].push(answer);
      } else {
        updatedAnswers[questionIndex] = updatedAnswers[questionIndex].filter(
          (item) => item !== answer
        );
      }
      return updatedAnswers;
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const userResponses = [];
    questions.forEach((q, index) => {
      const selectedAnswers = answers[index] || [];
      if (selectedAnswers.length > 0) {
        userResponses.push({
          question: q.text,
          selectedAnswers: selectedAnswers.join(", "),
        });
      }
    });

    console.log("Ответы пользователя:", userResponses);

    try {
      const response = await fetch(
        `http://localhost:8082/aiservice/api/suggest-movies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userResponses),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setResponseTitle(data.response);

        const moviesArray = data.movies.split("\n").map((movie, index) => {
          // Обновленное регулярное выражение для извлечения названия, оригинального названия и года, рейтингов, жанров и описания
          const regex = /^(\d+\.)\s*(.*?)(?:\s*\(([^)]+)\))?\.\s*Рейтинг:\s*KP:\s*(\d+\.\d+),\s*IMDB:\s*(\d+\.\d+)\.\s*Жанры:\s*(.*?)\.\s*Описание:\s*(.*)$/;

          // Применяем регулярное выражение к строке фильма
          const match = movie.match(regex);

          if (match) {
            const title = match[2].trim(); // Оригинальное название фильма
            const originalTitle = match[3]?.trim() || ''; // Название в скобках, например, "(The Lives of Others, 2006)"
            const ratingKP = match[4]; // Рейтинг KP
            const ratingIMDB = match[5]; // Рейтинг IMDB
            const genres = match[6].trim(); // Жанры
            const description = match[7].trim(); // Описание

            console.log(`Заголовок: ${title}`);
            console.log(`Оригинальное название: ${originalTitle}`);
            console.log(`Рейтинг KP: ${ratingKP}`);
            console.log(`Рейтинг IMDb: ${ratingIMDB}`);
            console.log(`Жанры: ${genres}`);
            console.log(`Описание: ${description}`);

            return { title, originalTitle, ratingKP, ratingIMDB, genres, description };
          } else {
            console.warn(`Фильм не соответствует формату: ${movie}`);
            return null; // Если не нашли совпадений, пропускаем фильм
          }
        }).filter(movie => movie !== null); // Убираем null значения, если фильм не соответствует формату

        setSuggestedMovies(moviesArray);
      }
      else {
        setIsError(true);
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Ошибка при получении данных о фильмах:", error);
      setIsError(true);
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const questionsPerPage = 10;
  const startIndex = (page - 1) * questionsPerPage;
  const paginatedQuestions = questions.slice(startIndex, startIndex + questionsPerPage);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    fetchQuiz(20);
  }, []);

  return (
    <Container maxWidth="md">
      {quizFetched && !loading && !suggestedMovies && (
        <Box>
          <Typography variant="h4" gutterBottom>
            Квиз, для определения рекомендаций
          </Typography>
          <Box sx={{ mt: 3 }}>
            {paginatedQuestions.map((q, index) => (
              <Box key={startIndex + index} sx={{ mb: 2 }}>
                <Typography variant="h6">{q.text}</Typography>
                <Box>
                  {q.answers.map((option, i) => (
                    <Box key={i} sx={{ marginBottom: "8px" }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={answers[startIndex + index]?.includes(option.text) || false}
                            onChange={(e) =>
                              handleAnswerChange(
                                startIndex + index,
                                option.text,
                                e.target.checked
                              )
                            }
                          />
                        }
                        label={option.text}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}

            <Pagination
              count={Math.ceil(questions.length / questionsPerPage)}
              page={page}
              onChange={(_, value) => setPage(value)}
              sx={{ mt: 2, mb: 2 }}
            />

            {page === Math.ceil(questions.length / questionsPerPage) && (
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                <Button variant="contained" color="secondary" onClick={handleSubmit}>
                  Завершить квиз
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {suggestedMovies && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="h5" gutterBottom>
            {responseTitle}
          </Typography>
          {suggestedMovies.map((movie, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{movie.title} ({`Original name: ${movie.originalTitle.split(',')[0]}, ${movie.originalTitle.split(',')[1]}`})</Typography>
                <Typography variant="body2">Рейтинг: KP {movie.ratingKP} IMdB: {movie.ratingIMDB}</Typography>
                <Typography variant="body2">Жанры: {movie.genres}</Typography>
                <Typography variant="body2">Краткое описание: {movie.description}</Typography>
              </CardContent>
            </Card>
          ))}
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
