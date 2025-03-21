import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from '@mui/material';
import { useDispatch } from "react-redux";
import { KinopoiskDev, MovieQueryBuilder } from '@openmoviedb/kinopoiskdev_client';
import { Card, CardContent, CardMedia, Typography, Grid, Box } from '@mui/material';
import { addMovie } from '../../../redux/Movies/action';

const MovieCardKP = ({ movie, idx }) => {
  const kp = new KinopoiskDev('FRS0QBR-W624BQ5-H8FVGZD-6EW7ZHY');
  const [addedMovie, setMovie] = useState({});  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const handleAddClick = async (event) => {
    event.stopPropagation();
    const responseKP = await kp.movie.getById(movie.id);
    console.log(responseKP);
    const movieKP = responseKP.data;
    const convertedMovie = {
      age: movieKP.ageRating,
      imdb_rating: movieKP.rating.imdb,
      kinopoisk_rating: movieKP.rating.kp,
      total_box_office: movieKP.fees.world.value || 0,
      year_of_posting: movieKP.premiere.world,
      country_produced: movieKP.countries && movieKP.countries[0].name,
      description: movieKP.description,
      duration: movieKP.movieLength.toString(),
      original_title: movieKP.alternativeName || movieKP.name,
      title: movieKP.name,
      poster: movieKP.poster.url
    };

    const response = await fetch('http://localhost:8082/filmservice/api/films/film', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(convertedMovie),
    });

    if (response.ok) {
      const addedMovieResp = await response.json();
      dispatch(addMovie(addedMovieResp));
      setMovie(addedMovieResp);
    }

    // const actors = responseKP.persons.filter(person => person.profession === 'actor');
    // for(var idx = 0; idx < 5 && idx< actors.length; idx ++){
    //   const response = await fetch(`http://localhost:8082/filmservice/api/films/${movie.id}/actors`, {
    //     method: 'POST',
    //     credentials: 'include',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(convertedMovie),
    //   });
  
    //   if (response.ok) {
    //     const movie = await response.json();
    //     dispatch(addMovie(movie));
    //   }
    // }
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
