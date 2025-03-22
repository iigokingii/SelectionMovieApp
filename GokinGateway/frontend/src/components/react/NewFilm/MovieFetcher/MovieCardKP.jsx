import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from '@mui/material';
import { useDispatch } from "react-redux";
import { KinopoiskDev, MovieQueryBuilder } from '@openmoviedb/kinopoiskdev_client';
import { Card, CardContent, CardMedia, Typography, Grid, Box } from '@mui/material';
import { addMovie } from '../../../redux/Movies/action';
import * as Actions from '../../../redux/Movies/action';
import * as MovieOptionsActions from '../../../redux/MovieOptions/Action';
import _ from 'lodash';

const MovieCardKP = ({ movie, idx, AddMovie }) => {
  const kp = new KinopoiskDev('FRS0QBR-W624BQ5-H8FVGZD-6EW7ZHY');
  const [addedMovie, setMovie] = useState({});  
  const [currentMovieId, setCurrentMovieId] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClick = () => {
    //navigate(`/movie/${movie.id}`);
  };

  const filterPersons = (persons) => {
    const directors = [];
    const actors = [];
    const producers = [];
    const screenwriters = [];
    const operators = [];
    const musicians = [];

    persons.forEach(person => {
        switch (person.profession) {
            case 'режиссеры':
                if (directors.length < 6) directors.push(person);
                break;
            case 'актеры':
                if (actors.length < 6) actors.push(person);
                break;
            case 'продюсеры':
                if (producers.length < 6) producers.push(person);
                break;
            case 'сценаристы':
                if (screenwriters.length < 6) screenwriters.push(person);
                break;
            case 'операторы':
                if (operators.length < 6) operators.push(person);
                break;
            case 'композиторы':
                if (musicians.length < 6) musicians.push(person);
                break;
            default:
                break;
        }
    });

    return {
        directors,
        actors,
        producers,
        screenwriters,
        operators,
        musicians
    };
};

const convertPerson = (person) => {
  const [surname, name, middle_name] = !_.isNull(person.name) ?  person.name?.split(' ') : person.enName?.split(' ');
  return {
      name,
      surname,
      middle_name: middle_name || '',
      birthday: null
  };
};

const handleAddGenre = async (genre, movieId) => {
  console.log(genre);
  const response = await fetch(`http://localhost:8082/filmservice/api/films/${movieId}/genres`, {
      method: 'POST',
      body: JSON.stringify({ name: genre.name, description: '' }),
      headers: {
          'Content-Type': 'application/json',
      },
  });

  if (response.ok) {
      const addedGenre = await response.json();
      dispatch(MovieOptionsActions.addUniqueGenre(addedGenre));
      dispatch(Actions.addGenre(movieId, addedGenre));
  }
};

const handleAddPerson = async (profession, persons, movieId) => {
  const convertedPersons = persons.map(convertPerson);
  
  for (const person of convertedPersons) {
      const response = await fetch(`http://localhost:8082/filmservice/api/films/${movieId}/${profession}`, {
          method: 'POST',
          body: JSON.stringify(person),
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (response.ok) {
          console.log()
          const addedPerson = await response.json();
          console.log('addedPerson')
          console.log(addedPerson)
          console.log('/addedPerson')
          switch (profession) {
              case 'directors':
                  dispatch(MovieOptionsActions.addUniqueDirector(addedPerson));
                  dispatch(Actions.addDirector(movieId, addedPerson));
                  break;
              case 'actors':
                  dispatch(MovieOptionsActions.addUniqueActor(addedPerson));
                  dispatch(Actions.addActor(movieId, addedPerson));
                  break;
              case 'producers':
                  dispatch(MovieOptionsActions.addUniqueProducer(addedPerson));
                  dispatch(Actions.addProducer(movieId, addedPerson));
                  break;
              case 'screenwriters':
                  dispatch(MovieOptionsActions.addUniqueScreenwriter(addedPerson));
                  dispatch(Actions.addScreenwriter(movieId, addedPerson));
                  break;
              case 'operators':
                  dispatch(MovieOptionsActions.addUniqueOperator(addedPerson));
                  dispatch(Actions.addOperator(movieId, addedPerson));
                  break;
              case 'musicians':
                  dispatch(MovieOptionsActions.addUniqueMusician(addedPerson));
                  dispatch(Actions.addMusician(movieId, addedPerson));
                  break;
              default:
                  console.error('Unknown profession:', profession);
                  break;
          }
      }
  }
};

const handleAddClick = async (event) => {
  event.stopPropagation();
  
  const responseKP = await kp.movie.getById(movie.id);
  console.log(responseKP);
  const movieKP = responseKP.data;

  const convertedMovie = {
      age: movieKP.ageRating,
      imdb_rating: movieKP.rating?.imdb,
      kinopoisk_rating: movieKP.rating?.kp,
      total_box_office: movieKP.fees?.world?.value || 0,
      year_of_posting: movieKP.premiere?.world,
      country_produced: movieKP.countries && movieKP.countries[0].name,
      description: movieKP.description,
      duration: movieKP.movieLength ? movieKP.movieLength : Math.floor(Math.random() * (150 - 20 + 1)) + 20,
      original_title: movieKP.alternativeName || movieKP.name,
      title: movieKP.name,
      poster: movieKP.poster?.url
  };

  const formData = new FormData();
  formData.append("film", new Blob([JSON.stringify(convertedMovie)], { type: "application/json" }));

  const response = await fetch('http://localhost:8082/filmservice/api/films/film', {
      method: 'POST',
      credentials: 'include',
      body: formData,
  });

  if (response.ok) {
      const addedMovieResp = await response.json();
      console.log('addedMovieResp')
      console.log(addedMovieResp);
      console.log('/addedMovieResp')
      dispatch(addMovie(addedMovieResp));
      setMovie(addedMovieResp);
      setCurrentMovieId(addedMovieResp.id)
      movieKP.genres.forEach(genre => {
          handleAddGenre(genre, addedMovieResp.id);
      });

      const filteredPersons = filterPersons(movieKP.persons);

      await handleAddPerson('directors', filteredPersons.directors, addedMovieResp.id);
      await handleAddPerson('actors', filteredPersons.actors, addedMovieResp.id);
      await handleAddPerson('producers', filteredPersons.producers, addedMovieResp.id);
      await handleAddPerson('screenwriters', filteredPersons.screenwriters, addedMovieResp.id);
      await handleAddPerson('operators', filteredPersons.operators, addedMovieResp.id);
      await handleAddPerson('musicians', filteredPersons.musicians, addedMovieResp.id);
      
      AddMovie(movie.id);
  }
};

  return (
    <Box sx={{ padding: 2, cursor: "pointer", marginBottom: "20px", width: "1200px", display: "flex" }} onClick={handleClick}>
      <Grid container spacing={2}>
        <Grid item xs={12} key={movie.id}>
          <Card sx={{ display: 'flex', alignItems: 'flex-start', padding: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', paddingRight: 2 }}>
              <Typography variant="h6" color="text.secondary">
                {idx + 1}
              </Typography>
            </Box>

            <CardMedia
              component="img"
              sx={{ width: 100, height: 160, borderRadius: 1 }}
              image={movie.poster}
              alt={movie.name}
            />

            <CardContent sx={{ flex: 1, marginLeft: 2, display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex" }}>
                <Box sx={{ width: "300px" }}>
                  <Typography variant="h6" component="div">
                    {movie.name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {movie.alternativeName || 'N/A'}, {movie.year}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {movie.countries?.join(', ') || 'N/A'} • Жанры: {movie.genres?.join(', ') || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Рейтинг: {movie.rating || 'N/A'} • Голоса: {movie.votes || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Длительность: {movie.movieLength ? `${movie.movieLength} мин` : 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ paddingLeft: "20px" }}>
                  <Typography variant="body2" color="text.secondary">
                    Описание: {movie.description || 'Нет описания'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>

            <Box sx={{ marginTop: "-5px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <Button
                variant="contained"
                onClick={handleAddClick}
                sx={{ marginTop: "20px", width: "120px", height: "40px", textAlign: "center" }}
              >
                Добавить
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MovieCardKP;
