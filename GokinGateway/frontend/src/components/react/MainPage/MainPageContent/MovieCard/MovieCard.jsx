import React from 'react';
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Box,
  Stack,
} from '@mui/material';

const MovieCard = ({ movie, idx }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <Box sx={{ padding: 2, cursor: "pointer", marginBottom: "20px", width: "100%" }} onClick={handleClick}>
      <Grid container spacing={2}>
        <Grid item xs={12} key={movie.id}>
          <Card sx={{ display: 'flex', alignItems: 'flex-start', padding: 2 }}>
            {/* Индекс фильма */}
            <Box sx={{ display: 'flex', alignItems: 'center', paddingRight: 2 }}>
              <Typography variant="h6" color="text.secondary">
                {idx + 1}
              </Typography>
            </Box>

            {/* Постер фильма */}
            <CardMedia
              component="img"
              sx={{ width: 100, height: 150, borderRadius: 1 }}
              image={movie.poster}
              alt={movie.title}
            />

            <CardContent sx={{ flex: 1, marginLeft: 2 }}>
              {/* Название и год фильма */}
              <Typography variant="h6" component="div">
                {movie.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {movie.originalTitle}, {movie.yearOfPosting.split('T')[0]}
              </Typography>

              {/* Дополнительная информация */}
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {movie.countryProduced} • {movie.genres?.[0]?.name || 'N/A'} • Режиссёр: {movie.directors?.[0]?.name || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                В ролях: {movie.actors?.[0]?.name || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Длительность: {movie.duration || 'N/A'}
              </Typography>

              {/* Рейтинг */}
              <Stack direction="row" alignItems="center" spacing={1} mt={1}>
                <Typography variant="h6" color="gold">
                  {movie.kinopoiskRating || 'N/A'}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MovieCard;
