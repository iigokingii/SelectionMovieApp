import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';

const LeftFilters = ({ search, setSearch, genre, setGenre, duration, setDuration, rating, setRating }) => {
  const movieOptions = useSelector(state => state.movieOptionsReducer.movieOptions);

  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (movieOptions) {
      setGenres(movieOptions.genres);
      setLoading(false);
    }
  }, [movieOptions]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleGenreChange = (event) => {
    setGenre(event.target.value);
  };

  const handleDurationChange = (event, newValue) => {
    setDuration(newValue);
  };

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ padding: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <TextField
        label="Search by Title"
        variant="outlined"
        value={search}
        onChange={handleSearchChange}
        fullWidth
      />
      <FormControl fullWidth>
        <InputLabel>Genre</InputLabel>
        <Select value={genre} onChange={handleGenreChange} label="Genre">
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {genres && genres.length > 0 ? (
            genres.map((genre) => (
              <MenuItem key={genre.id} value={genre.name}>
                {genre.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No genres available</MenuItem>
          )}
        </Select>
      </FormControl>
      <Box>
        <Typography gutterBottom>Duration (minutes)</Typography>
        <Slider
          value={duration}
          onChange={handleDurationChange}
          valueLabelDisplay="auto"
          min={0}
          max={300}
        />
      </Box>
      <Box>
        <Typography gutterBottom>Rating</Typography>
        <Slider
          value={rating}
          onChange={handleRatingChange}
          valueLabelDisplay="auto"
          min={0}
          max={10}
          step={0.1}
        />
      </Box>
    </Box>
  );
};

export default LeftFilters;
