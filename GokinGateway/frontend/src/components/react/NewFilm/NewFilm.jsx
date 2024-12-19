import React, { useState } from 'react';
import Header from '../Header/Header';
import { addMovie } from '../../redux/Movies/action';
import { useDispatch } from "react-redux";

import {
  TextField,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Button,
  Typography,
  Box
} from '@mui/material';
import '../../../static/NewFilm/NewFilm.css';

const NewFilm = () => {
  const dispatch = useDispatch();
  const [isAddViaApi, setIsAddViaApi] = useState(false);
  const [movieName, setMovieName] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        console.log('заебок')
      }
      else {
        console.log('пиздак');
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
              // ? <TextField
              //   label="Название фильма"
              //   variant="outlined"
              //   fullWidth
              //   value={movieName}
              //   onChange={(e) => setMovieName(e.target.value)}
              //   placeholder="Введите название фильма"
              //   required
              //   sx={{ marginBottom: 2, backgroundColor: '#fff' }}
              // />
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
                  sx={{ marginBottom: 2, backgroundColor: '#fff' }}
                />
                <TextField
                  label="IMdB рейтинг"
                  variant="outlined"
                  fullWidth
                  name="imdb_rating"
                  value={manualMovieDetails.imdb_rating}
                  onChange={handleManualChange}
                  placeholder="Введите IMdB рейтинг фильма"
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
                  sx={{ marginBottom: 2, backgroundColor: '#fff' }}
                />
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
                  sx={{ marginBottom: 2, backgroundColor: '#fff' }}
                />
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

                {/* Добавляем загрузку изображения */}
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
    </React.Fragment>
  );
};

export default NewFilm;
