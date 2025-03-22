import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  TextField,
  FormControl,
  InputLabel,
  Slider,
  Box,
  Typography,
  CircularProgress,
  Autocomplete,
} from '@mui/material';



const LeftFilters = ({
  search, setSearch, genre, setGenre, duration, setDuration, rating, setRating,
  actors, setActors, directors, setDirectors, musicians, setMusicians, producers, setProducers,
  screenwriters, setScreenwriters, countryProduced, setCountryProduced
}) => {
  const movieOptions = useSelector(state => state.movieOptionsReducer.movieOptions);
  const movies = useSelector(state => state.movieReducer.movies);

  const [genres, setGenres] = useState('');
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    if (movieOptions && movies) {
      setGenres(movieOptions.genres);
      const countries = [...new Set(movies.map(movie => movie.countryProduced))];
      setCountries(countries);
      setLoading(false);
    }
  }, [movieOptions, movies]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleGenreChange = (event, newValue) => {
    console.log(newValue);
    setGenre(newValue);
  };

  const handleDurationChange = (event, newValue) => {
    setDuration(newValue);
  };

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  const handleActorsChange = (event, newValue) => {
    console.log(newValue);
    setActors(newValue);
  };

  const handleDirectorsChange = (event, newValue) => {
    setDirectors(newValue);
  };

  const handleMusiciansChange = (event, newValue) => {
    setMusicians(newValue);
  };

  const handleProducersChange = (event, newValue) => {
    setProducers(newValue);
  };

  const handleScreenwritersChange = (event, newValue) => {
    setScreenwriters(newValue);
  };

  const handleCountryChange = (event, newValue) => {
    setCountryProduced(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ padding: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', gap: 3, maxWidth:"250px" }}>
      <TextField
        label="Поиск по названию"
        variant="outlined"
        value={search}
        onChange={handleSearchChange}
        fullWidth
      />

      <FormControl fullWidth>
        <Autocomplete
          value={genre}
          onChange={handleGenreChange}
          options={movieOptions?.genres || []}
          getOptionLabel={(option) => option?.name || ''}
          renderInput={(params) => <TextField {...params} label="Жанр" />}
          isOptionEqualToValue={(option, value) => option.name === value}
          filterOptions={(options, state) =>
            options.filter((option) =>
              option.name.toLowerCase().includes(state.inputValue.toLowerCase())
            )
          }
        />
      </FormControl>

      <FormControl fullWidth>
        <Autocomplete
          multiple
          value={actors}
          onChange={handleActorsChange}
          options={movieOptions?.actors || []}
          getOptionLabel={(option) => `${option.name} ${option.surname}`}
          renderInput={(params) => <TextField {...params} label="Актеры" />}
          isOptionEqualToValue={(option, value) => `${option.name} ${option.surname}` === value}
          filterOptions={(options, state) =>
            options.filter((option) =>
              `${option.name} ${option.surname}`
                .toLowerCase()
                .includes(state.inputValue.toLowerCase())
            )
          }
        />
      </FormControl>

      <FormControl fullWidth>
        <Autocomplete
          multiple
          value={directors}
          onChange={handleDirectorsChange}
          options={movieOptions?.directors || []}
          getOptionLabel={(option) => `${option.name} ${option.surname}`}
          renderInput={(params) => <TextField {...params} label="Режиссеры" />}
          isOptionEqualToValue={(option, value) => `${option.name} ${option.surname}` === value}
          filterOptions={(options, state) =>
            options.filter((option) =>
              `${option.name} ${option.surname}`
                .toLowerCase()
                .includes(state.inputValue.toLowerCase())
            )
          }
        />
      </FormControl>

      <FormControl fullWidth>
        <Autocomplete
          multiple
          value={musicians}
          onChange={handleMusiciansChange}
          options={movieOptions?.musicians || []}
          getOptionLabel={(option) => `${option.name} ${option.surname}`}
          renderInput={(params) => <TextField {...params} label="Музыканты" />}
          isOptionEqualToValue={(option, value) => `${option.name} ${option.surname}` === value}
          filterOptions={(options, state) =>
            options.filter((option) =>
              `${option.name} ${option.surname}`
                .toLowerCase()
                .includes(state.inputValue.toLowerCase())
            )
          }
        />
      </FormControl>

      <FormControl fullWidth>
        <Autocomplete
          multiple
          value={producers}
          onChange={handleProducersChange}
          options={movieOptions?.producers || []}
          getOptionLabel={(option) => `${option.name} ${option.surname}`}
          renderInput={(params) => <TextField {...params} label="Продюсеры" />}
          isOptionEqualToValue={(option, value) => `${option.name} ${option.surname}` === value}
          filterOptions={(options, state) =>
            options.filter((option) =>
              `${option.name} ${option.surname}`
                .toLowerCase()
                .includes(state.inputValue.toLowerCase())
            )
          }
        />
      </FormControl>

      <FormControl fullWidth>
        <Autocomplete
          multiple
          value={screenwriters}
          onChange={handleScreenwritersChange}
          options={movieOptions?.screenwriters || []}
          getOptionLabel={(option) => `${option.name} ${option.surname}`}
          renderInput={(params) => <TextField {...params} label="Сценаристы" />}
          isOptionEqualToValue={(option, value) => `${option.name} ${option.surname}` === value}
          filterOptions={(options, state) =>
            options.filter((option) =>
              `${option.name} ${option.surname}`
                .toLowerCase()
                .includes(state.inputValue.toLowerCase())
            )
          }
        />
      </FormControl>

      <FormControl fullWidth>
        <Autocomplete
          value={countryProduced}
          onChange={handleCountryChange}
          options={countries || []}
          renderInput={(params) => <TextField {...params} label="Страна производства" />}
          filterOptions={(options, state) =>
            options.filter((option) =>
              option.toLowerCase().includes(state.inputValue.toLowerCase())
            )
          }
        />
      </FormControl>

      <Box>
        <Typography gutterBottom>Продолжительность (в минутах)</Typography>
        <Slider
          value={duration}
          onChange={handleDurationChange}
          valueLabelDisplay="auto"
          min={0}
          max={300}
        />
      </Box>

      <Box>
        <Typography gutterBottom>Рейтинг</Typography>
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
