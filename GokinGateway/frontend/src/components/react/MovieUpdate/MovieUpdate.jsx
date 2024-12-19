import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import { updateMovie } from '../../redux/Movies/action';
import {
  TextField,
  Button,
  Typography,
  Box
} from '@mui/material';
import '../../../static/NewFilm/NewFilm.css';

const MovieUpdate = () => {
  const { movieId } = useParams(); // Получение ID фильма из URL
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Получение списка фильмов из Redux
  const movies = useSelector((state) => state.movieReducer.movies);
  const movie = movies.find((movie) => movie.id === parseInt(movieId));

  // Начальное состояние полей формы
  const [movieDetails, setMovieDetails] = useState({
    age: '',
    imdbrating: '',
    kinopoiskRating: '',
    totalBoxOffice: '',
    yearOfPosting: '',
    countryProduced: '',
    description: '',
    duration: '',
    originalTitle: '',
    title: '',
    poster: '',
  });

  // Заполнение формы данными фильма при наличии
  useEffect(() => {
    if (movie) {
      setMovieDetails({
        age: movie.age || '',
        imdb_rating: movie.imdbrating || '',
        kinopoisk_rating: movie.kinopoiskRating || '',
        total_box_office: movie.totalBoxOffice || '',
        year_of_posting: movie.yearOfPosting || '',
        country_produced: movie.countryProduced || '',
        description: movie.description || '',
        duration: movie.duration || '',
        original_title: movie.originalTitle || '',
        title: movie.title || '',
        poster: movie.poster || '',
      });
    }
  }, [movie]);

  // Обработка изменений в полях формы
  const handleMovieChange = (e) => {
    const { name, value } = e.target;
    setMovieDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Обработка загрузки изображения
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setMovieDetails((prevDetails) => ({
          ...prevDetails,
          poster: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`http://localhost:8082/filmservice/api/films/film/${movie.id}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieDetails),
      });
  
      if (response.ok) {
        const updatedMovie = await response.json();
        dispatch(updateMovie(updatedMovie));
        console.log('Фильм успешно обновлен');
        navigate('/movie-list');
      } else {
        console.error('Ошибка при обновлении фильма');
      }
    } catch (error) {
      console.error('Ошибка сети при обновлении фильма:', error);
    }
  };
  

  if (!movie) {
    return (
      <Typography variant="h6" color="error" gutterBottom>
        Фильм не найден
      </Typography>
    );
  }

  return (
    <React.Fragment>
      <Box className="new-movie-wrapper">
        <Box sx={{ maxWidth: '600px', width: '100%' }}>
          <Typography variant="h4" gutterBottom>
            Изменение информации о фильме
          </Typography>

          <form onSubmit={handleSubmit} className="form-section" style={{ marginTop: '20px' }}>
            <Box>
              <TextField
                label="Название фильма"
                variant="outlined"
                fullWidth
                name="title"
                value={movieDetails.title}
                onChange={handleMovieChange}
                placeholder="Введите название фильма"
                required
                sx={{ marginBottom: 2, backgroundColor: '#fff' }}
              />
              <TextField
                label="Оригинальное название фильма"
                variant="outlined"
                fullWidth
                name="original_title"
                value={movieDetails.original_title}
                onChange={handleMovieChange}
                placeholder="Введите оригинальное название фильма"
                required
                sx={{ marginBottom: 2, backgroundColor: '#fff' }}
              />
              <TextField
                label="Возрастное ограничение"
                variant="outlined"
                fullWidth
                name="age"
                value={movieDetails.age}
                onChange={handleMovieChange}
                placeholder="Введите возрастное ограничение"
                sx={{ marginBottom: 2, backgroundColor: '#fff' }}
              />
              <TextField
                label="IMdB рейтинг"
                variant="outlined"
                fullWidth
                name="imdb_rating"
                value={movieDetails.imdb_rating}
                onChange={handleMovieChange}
                placeholder="Введите IMdB рейтинг фильма"
                sx={{ marginBottom: 2, backgroundColor: '#fff' }}
              />
              <TextField
                label="Kinopoisk рейтинг"
                variant="outlined"
                fullWidth
                name="kinopoisk_rating"
                value={movieDetails.kinopoisk_rating}
                onChange={handleMovieChange}
                placeholder="Введите Kinopoisk рейтинг фильма"
                sx={{ marginBottom: 2, backgroundColor: '#fff' }}
              />
              <TextField
                label="Дата выхода"
                variant="outlined"
                fullWidth
                type="date"
                name="year_of_posting"
                value={movieDetails.year_of_posting}
                onChange={handleMovieChange}
                InputLabelProps={{ shrink: true }}
                sx={{ marginBottom: 2, backgroundColor: '#fff' }}
              />
              <TextField
                label="Кассовые сборы"
                variant="outlined"
                fullWidth
                name="total_box_office"
                value={movieDetails.total_box_office}
                onChange={handleMovieChange}
                placeholder="Введите кассовые сборы фильма"
                sx={{ marginBottom: 2, backgroundColor: '#fff' }}
              />
              <TextField
                label="Страна производитель"
                variant="outlined"
                fullWidth
                name="country_produced"
                value={movieDetails.country_produced}
                onChange={handleMovieChange}
                placeholder="Введите страну производитель фильма"
                sx={{ marginBottom: 2, backgroundColor: '#fff' }}
              />
              <TextField
                label="Продолжительность фильма"
                variant="outlined"
                fullWidth
                name="duration"
                value={movieDetails.duration}
                onChange={handleMovieChange}
                placeholder="Введите продолжительность фильма"
                sx={{ marginBottom: 2, backgroundColor: '#fff' }}
              />
              <TextField
                label="Описание"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                name="description"
                value={movieDetails.description}
                onChange={handleMovieChange}
                placeholder="Введите описание фильма"
                sx={{ marginBottom: 2, backgroundColor: '#fff' }}
              />
              {movieDetails.poster && (
                <Box sx={{ marginBottom: 2, textAlign: 'center' }}>
                  <img
                    src={movieDetails.poster}
                    alt="Превью"
                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                  />
                </Box>
              )}

              <label htmlFor="upload-image">
                <input
                  accept="image/*"
                  id="upload-image"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
                <Button
                  variant="contained"
                  component="span"
                  sx={{ marginBottom: 2, backgroundColor: '#007BFF', color: '#fff' }}
                >
                  Загрузить изображение
                </Button>
              </label>
            </Box>

            <Button type="submit" variant="contained" color="primary">
              Обновить фильм
            </Button>
          </form>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default MovieUpdate;
