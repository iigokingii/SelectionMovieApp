import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { addMovie } from '../../redux/Movies/action';
import { useDispatch } from "react-redux";
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { TextField, Radio, RadioGroup, FormControl, FormControlLabel, Button, Typography, Box } from '@mui/material';
import _ from 'lodash';
import '../../../static/NewFilm/NewFilm.css';

const NewFilm = () => {
  const dispatch = useDispatch();
  const movies = useSelector((state) => state.movieReducer.movies);
  const [isAddViaApi, setIsAddViaApi] = useState(false);
  const [movieName, setMovieName] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [manualMovieDetails, setManualMovieDetails] = useState({
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
  const maxCharCount = 2000;

  const handleCheckboxChange = (event) => {
    setIsAddViaApi(event.target.value === 'api');
  };

  const handleManualChange = (e) => {
    const { name, value } = e.target;
    setManualMovieDetails((prevDetails) => ({
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
        setManualMovieDetails((prevDetails) => ({
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
    const ageValue = parseInt(manualMovieDetails.age);
    const existingTitles = movies.map(m => m.title.toLowerCase())
    const existingOriginalTitles = movies.map(m => m.originalTitle.toLowerCase());
    if (_.isNaN(ageValue)) {
      newErrors.age = 'Возраст должен быть числом.';
    } else if (ageValue < 0 || ageValue > 18) {
      newErrors.age = 'Возраст должен быть в диапазоне от 0 до 18.';
    }

    const imdbRating = parseFloat(manualMovieDetails.imdb_rating.toString().replace(',', '.'));
    const kinopoiskRating = parseFloat(manualMovieDetails.kinopoisk_rating.toString().replace(',', '.'));
    if (imdbRating < 0 || imdbRating > 10 || _.isNaN(imdbRating)) {
      newErrors.imdb_rating = 'IMDB рейтинг должен быть от 0 до 10.';
    }
    if (kinopoiskRating < 0 || kinopoiskRating > 10 || _.isNaN(kinopoiskRating)) {
      newErrors.kinopoisk_rating = 'Kinopoisk рейтинг должен быть от 0 до 10.';
    }

    const postingDate = new Date(manualMovieDetails.year_of_posting);
    if (!manualMovieDetails.year_of_posting) {
      newErrors.year_of_posting = 'Дата выхода не может быть пустой.';
    } else if (isNaN(postingDate.getTime())) {
      newErrors.year_of_posting = 'Некорректная дата. Пожалуйста, используйте формат YYYY-MM-DD.';
    }

    const boxOfficeValue = parseFloat(manualMovieDetails.total_box_office.toString().replace(',', '.'));
    if (boxOfficeValue === '' || isNaN(boxOfficeValue)) {
      newErrors.total_box_office = 'Кассовые сборы должны быть числом.';
    }

    const countryPattern = /^[A-Za-zА-Яа-яЁё\s]+$/;
    if (!countryPattern.test(manualMovieDetails.country_produced)) {
      newErrors.country_produced = 'Страна производитель может содержать только буквы.';
    }

    if (isNaN(manualMovieDetails.duration) || manualMovieDetails.duration.trim() === '') {
      newErrors.duration = 'Продолжительность фильма должна быть числом минут.';
    }

    if (manualMovieDetails.description.length > maxCharCount) {
      newErrors.description = 'Описание не может превышать 2000 символов.';
    }

    if (!manualMovieDetails.poster) {
      newErrors.poster = 'Пожалуйста, загрузите постер для фильма.';
    }

    if (_.isEmpty(newErrors)) {
      if (!manualMovieDetails.title.trim()) {
        newErrors.title = 'Название фильма не может быть пустым.';
      } else if (existingTitles.includes(manualMovieDetails.title.toLowerCase())) {
        newErrors.title = 'Фильм с таким названием уже существует.';
        setConfirmAction('title');
        setOpenDialog(true);
      }

      if (!manualMovieDetails.original_title.trim()) {
        newErrors.original_title = 'Оригинальное название не может быть пустым.';
      } else if (existingOriginalTitles.includes(manualMovieDetails.original_title.toLowerCase())) {
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

    if (isAddViaApi) {
      console.log('Добавить фильм через API:', movieName);
    } else {
      console.log('Добавить фильм вручную:', manualMovieDetails);
      const response = await fetch('http://localhost:8082/filmservice/api/films/film', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(manualMovieDetails),
      });

      if (response.ok) {
        const movie = await response.json();
        dispatch(addMovie(movie));
        setOpenDialog(false);
        setConfirmAction(null);
        setManualMovieDetails({
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
        console.log('Фильм успешно добавлен');
      } else {
        console.log('Ошибка при добавлении фильма');
      }
    }
  };

  return (
    <React.Fragment>
      <Box className="new-movie-wrapper">
        <Box sx={{ maxWidth: '600px', width: '100%' }}>
          <Typography variant="h4" gutterBottom>
            Добавление фильма в каталог
          </Typography>

          <FormControl component="fieldset">
            <RadioGroup
              row
              name="addMethod"
              value={isAddViaApi ? 'api' : 'manual'}
              onChange={handleCheckboxChange}
            >
              <FormControlLabel
                value="api"
                control={<Radio />}
                label="Добавить через API"
              />
              <FormControlLabel
                value="manual"
                control={<Radio />}
                label="Заполнить вручную"
              />
            </RadioGroup>
          </FormControl>

          <form onSubmit={handleSubmit} className="form-section" style={{ marginTop: '20px' }}>
            {isAddViaApi
              ? <div style={{
                display: 'flex',
                height: '100vh',
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#333'
              }}> Ведется интеграция с API Кинопоиск </div>
              : <Box>
                <TextField
                  label="Название фильма"
                  variant="outlined"
                  fullWidth
                  name="title"
                  value={manualMovieDetails.title}
                  onChange={handleManualChange}
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
                  value={manualMovieDetails.original_title}
                  onChange={handleManualChange}
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
                  value={manualMovieDetails.age}
                  onChange={handleManualChange}
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
                  value={manualMovieDetails.imdb_rating}
                  onChange={handleManualChange}
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
                  value={manualMovieDetails.kinopoisk_rating}
                  onChange={handleManualChange}
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
                  value={manualMovieDetails.year_of_posting}
                  onChange={handleManualChange}
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
                  value={manualMovieDetails.total_box_office}
                  onChange={handleManualChange}
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
                  value={manualMovieDetails.country_produced}
                  onChange={handleManualChange}
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
                  value={manualMovieDetails.duration}
                  onChange={handleManualChange}
                  placeholder="Введите продолжительность фильма"
                  error={!!errors.duration}
                  helperText={errors.duration}
                  sx={{ marginBottom: 2, backgroundColor: '#fff' }}
                />
                <Box>
                  <Typography
                    variant="body2"
                    color={manualMovieDetails.description.length === maxCharCount ? "error" : "textSecondary"}
                    sx={{ textAlign: 'right', marginBottom: 1 }}
                  >
                    {manualMovieDetails.description.length} / {maxCharCount}
                  </Typography>

                  <TextField
                    label="Описание"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    name="description"
                    value={manualMovieDetails.description}
                    onChange={handleManualChange}
                    placeholder="Введите описание фильма"
                    error={!!errors.description}
                    helperText={errors.description}
                    sx={{ marginBottom: 2, backgroundColor: '#fff' }}
                  />
                </Box>
                {manualMovieDetails.poster && (
                  <Box
                    sx={{
                      marginBottom: 2,
                      textAlign: 'center',
                    }}
                  >
                    <img
                      src={manualMovieDetails.poster}
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
            }
            {isAddViaApi
              ? null
              : <Button type="submit" variant="contained" color="primary">
                Добавить фильм
              </Button>
            }
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
            {"Этот фильм уже существует в базе."}
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              {confirmAction === 'title'
                ? 'Фильм с таким названием уже существует. Уверены ли вы, что хотите его добавить?'
                : 'Фильм с таким оригинальным названием уже существует. Уверены ли вы, что хотите его добавить?'}
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

export default NewFilm;