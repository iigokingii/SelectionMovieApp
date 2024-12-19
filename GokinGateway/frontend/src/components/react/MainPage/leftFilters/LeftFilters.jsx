import React from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Box,
  Typography,
} from '@mui/material';

const LeftFilters = ({ search, setSearch, genre, setGenre, duration, setDuration, rating, setRating }) => {
  const genres = [
    'Action',
    'Comedy',
    'Drama',
    'Fantasy',
    'Horror',
    'Romance',
    'Sci-Fi',
    'Thriller',
  ];

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

  return (
    <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', gap: 3}}>
      {/* Search Field */}
      <TextField
        label="Search by Title"
        variant="outlined"
        value={search}
        onChange={handleSearchChange}
        fullWidth
      />

      {/* Genre Filter */}
      <FormControl fullWidth>
        <InputLabel>Genre</InputLabel>
        <Select value={genre} onChange={handleGenreChange} label="Genre">
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {genres.map((genre) => (
            <MenuItem key={genre} value={genre}>
              {genre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Duration Filter */}
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

      {/* Rating Filter */}
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
