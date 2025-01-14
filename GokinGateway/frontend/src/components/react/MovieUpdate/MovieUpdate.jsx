import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { updateMovie } from '../../redux/Movies/action';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { TextField, Button, Typography, Box } from '@mui/material';
import _ from 'lodash';
import '../../../static/NewFilm/NewFilm.css';

const MovieUpdate = () => {
  const { movieId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const movies = useSelector((state) => state.movieReducer.movies);
  const movie = movies.find((movie) => movie.id === parseInt(movieId));
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [description, setDescription] = React.useState('');
  const maxCharCount = 2000;

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const [movieDetails, setMovieDetails] = useState({
    age: '',
    imdb_rating: '',
    kinopoisk_rating: '',
    total_box_office: '',
    year_of_posting: '',
    country_produced: '',
    description: '',
    duration: '',
    original_title: '',
    title: '',
    poster: '',
  });

  const [errors, setErrors] = useState({});

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

  const handleMovieChange = (e) => {
    const { name, value } = e.target;
    setMovieDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        return;
      }

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


  const handleDialogCancel = () => {
    setOpenDialog(false);
    setConfirmAction(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    const ageValue = Number(movieDetails.age);
    const foundOtherMovie = movies.find(m => m.id !== movie.id && (m.title.toLowerCase() === movie.title.toLowerCase() || m.originalTitle.toLowerCase() === movie.originalTitle.toLowerCase()))
    if (_.isNaN(ageValue)) {
      newErrors.age = 'Возраст должен быть числом.';
    } else if (ageValue < 0 || ageValue > 18) {
      newErrors.age = 'Возраст должен быть в диапазоне от 0 до 18.';
    }

    const imdbRating = Number(movieDetails.imdb_rating.toString().replace(',', '.'));
    const kinopoiskRating = Number(movieDetails.kinopoisk_rating.toString().replace(',', '.'));
    if (imdbRating < 0 || imdbRating > 10 || _.isNaN(imdbRating)) {
      newErrors.imdb_rating = 'IMDB рейтинг должен быть от 0 до 10.';
    }
    if (kinopoiskRating < 0 || kinopoiskRating > 10 || _.isNaN(kinopoiskRating)) {
      newErrors.kinopoisk_rating = 'Kinopoisk рейтинг должен быть от 0 до 10.';
    }

    const postingDate = new Date(movieDetails.year_of_posting);
    if (!movieDetails.year_of_posting) {
      newErrors.year_of_posting = 'Дата выхода не может быть пустой.';
    } else if (isNaN(postingDate.getTime())) {
      newErrors.year_of_posting = 'Некорректная дата. Пожалуйста, используйте формат YYYY-MM-DD.';
    }

    const boxOfficeValue = Number(movieDetails.total_box_office.toString().replace(',', '.'));
    if (boxOfficeValue === '' || isNaN(boxOfficeValue)) {
      newErrors.total_box_office = 'Кассовые сборы должны быть числом.';
    }

    const countryPattern = /^[A-Za-zА-Яа-яЁё\s]+$/;
    if (!countryPattern.test(movieDetails.country_produced)) {
      newErrors.country_produced = 'Страна производитель может содержать только буквы.';
    }

    if (isNaN(movieDetails.duration) || movieDetails.duration.trim() === '') {
      newErrors.duration = 'Продолжительность фильма должна быть числом минут.';
    }

    if (movieDetails.description.length > maxCharCount) {
      newErrors.description = 'Описание не может превышать 2000 символов.';
    }

    if (!movieDetails.poster) {
      newErrors.poster = 'Пожалуйста, загрузите постер для фильма.';
    }

    if (_.isEmpty(newErrors)) {
      if (!movieDetails.title.trim()) {
        newErrors.title = 'Название фильма не может быть пустым.';
      } else if (!_.isUndefined(foundOtherMovie)) {
        newErrors.title = 'Фильм с таким названием уже существует.';
        setConfirmAction('title');
        setOpenDialog(true);
      }

      if (!movieDetails.original_title.trim()) {
        newErrors.original_title = 'Оригинальное название не может быть пустым.';
      } else if (!_.isUndefined(foundOtherMovie)) {
        newErrors.original_title = 'Фильм с таким названием уже существует.';
        setConfirmAction('original_title');
        setOpenDialog(true);
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() && !openDialog) return;

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
        setOpenDialog(false);
        setConfirmAction(null);
        setMovieDetails({
          age: '',
          imdb_rating: '',
          kinopoisk_rating: '',
          total_box_office: '',
          year_of_posting: '',
          country_produced: '',
          description: '',
          duration: '',
          original_title: '',
          title: '',
          poster: '',
        });
        setErrors({});
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
                error={!!errors.title}
                helperText={errors.title}
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
                error={!!errors.original_title}
                helperText={errors.original_title}
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
                error={!!errors.age}
                helperText={errors.age}
                sx={{ marginBottom: 2, backgroundColor: '#fff' }}
              />
              <TextField
                label="IMDB рейтинг"
                variant="outlined"
                fullWidth
                name="imdb_rating"
                value={movieDetails.imdb_rating}
                onChange={handleMovieChange}
                placeholder="Введите IMDB рейтинг фильма"
                error={!!errors.imdb_rating}
                helperText={errors.imdb_rating}
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
                error={!!errors.kinopoisk_rating}
                helperText={errors.kinopoisk_rating}
                sx={{ marginBottom: 2, backgroundColor: '#fff' }}
              />
              <TextField
                label="Дата выхода"
                variant="outlined"
                fullWidth
                type="date"
                name="year_of_posting"
                value={movieDetails.year_of_posting.split('T')[0]}
                onChange={handleMovieChange}
                InputLabelProps={{ shrink: true }}
                error={!!errors.year_of_posting}
                helperText={errors.year_of_posting}
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
                error={!!errors.total_box_office}
                helperText={errors.total_box_office}
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
                error={!!errors.country_produced}
                helperText={errors.country_produced}
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
                error={!!errors.duration}
                helperText={errors.duration}
                sx={{ marginBottom: 2, backgroundColor: '#fff' }}
              />
              <Box>
                <Typography
                  variant="body2"
                  color={description.length === maxCharCount ? "error" : "textSecondary"}
                  sx={{ textAlign: 'right', marginBottom: 1 }}
                >
                  {description.length} / {maxCharCount}
                </Typography>

                <TextField
                  label="Описание"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  name="description"
                  value={movieDetails.description}
                  error={!!errors.description}
                  helperText={errors.description}
                  onChange={handleMovieChange}
                  inputProps={{ maxLength: maxCharCount }}
                  sx={{ marginBottom: 2, backgroundColor: '#fff' }}
                />
              </Box>
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
                  onChange={(event) => handleFileUpload(event)}
                />
                <Button
                  variant="contained"
                  component="span"
                  sx={{ marginBottom: 2, backgroundColor: '#007BFF', color: '#fff' }}
                >
                  Загрузить изображение
                </Button>
              </label>
              {errors.poster && (
                <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>
                  {errors.poster}
                </Typography>
              )}
            </Box>

            <Button type="submit" variant="contained" color="primary">
              Обновить фильм
            </Button>
          </form>
        </Box>
      </Box>
      {openDialog &&
        <Dialog
          open={openDialog}
          onClose={handleDialogCancel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Фильм с таким названием уже существует в базе."}
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              {confirmAction === 'title'
                ? 'Фильм с таким названием уже существует. Уверены ли вы, что хотите его обновить?'
                : 'Фильм с таким оригинальным названием уже существует. Уверены ли вы, что хотите его обновить?'}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogCancel} color="primary">
              Отменить
            </Button>
            <Button onClick={handleSubmit} color="primary" autoFocus>
              Добавить
            </Button>
          </DialogActions>
        </Dialog>}
    </React.Fragment>
  );
};

export default MovieUpdate;