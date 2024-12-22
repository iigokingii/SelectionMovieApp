import React from 'react';
import { useNavigate } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Box,
} from '@mui/material';
import { addUniqueFavorite, deleteUniqueFavorite } from '../../../../redux/MovieOptions/Action';

const MovieCard = ({ movie, idx }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favoriteMovie = useSelector((state) => state.movieOptionsReducer?.movieOptions?.favoriteFilm);
  const userCredentials = useSelector((state) => state.credentialReducer.credentials);

  const isFavorite = favoriteMovie?.some(fav => fav.film.id === movie.id);
  
  const favoriteId = favoriteMovie?.find(fav => fav.film.id === movie.id)?.id;

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const handleFavoriteClick = async (event, filmId, isFavorite, favoriteId) => {
    event.stopPropagation();
    
    const url = isFavorite
      ? `http://localhost:8082/filmservice/api/films/favorites/${favoriteId}`
      : 'http://localhost:8082/filmservice/api/films/favorites';

    const method = isFavorite ? 'DELETE' : 'POST';

    const response = await fetch(url, {
      method: method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filmId: filmId, userId: userCredentials.id }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }

    const data = await response.json();
    if (isFavorite) {
      dispatch(deleteUniqueFavorite(data));
    } else {
      dispatch(addUniqueFavorite(data));
    }

    console.log(`Фильм с ID ${filmId} ${isFavorite ? 'удален' : 'добавлен'} в избранное`);
  };

  return (
    <Box sx={{ padding: 2, cursor: "pointer", marginBottom: "20px", width: "95%", display: "flex" }} onClick={handleClick}>
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
              alt={movie.title}
            />

            <CardContent sx={{ flex: 1, marginLeft: 2, display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex" }}>
                <Box sx={{ width: "300px" }}>
                  <Typography variant="h6" component="div">
                    {movie.title}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {movie.originalTitle}, {movie.yearOfPosting.split('T')[0]}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {movie.countryProduced} • {movie.genres?.[0]?.name || 'N/A'} • Режиссёр: {`${movie.directors?.[0]?.name} ${movie.directors?.[0]?.surname}` || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    В ролях: {`${movie.actors?.[0]?.name} ${movie.actors?.[0]?.surname}` || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Длительность: {movie.duration || 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ paddingLeft: "20px" }}>
                  <Typography>
                    Рейтинг Кинопоиск: <span style={{ color: "gold" }}>{movie.kinopoiskRating || 'N/A'}</span>
                  </Typography>
                  <Typography>
                    Рейтинг IMDb: <span style={{ color: "gold" }}>{movie.imdbrating || 'N/A'}</span>
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ marginTop: "-5px" }}>
                <IconButton
                  aria-label="add to favorites"
                  onClick={(event) => handleFavoriteClick(event, movie.id, isFavorite, favoriteId)}>
                  <FavoriteIcon sx={{ color: isFavorite ? "red" : "gray" }} />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MovieCard;
