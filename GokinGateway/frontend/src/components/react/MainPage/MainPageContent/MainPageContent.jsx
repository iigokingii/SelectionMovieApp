import React, { useEffect, useState } from 'react';
import MovieCard from './MovieCard/MovieCard';
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import _ from 'lodash';
import { Pagination } from '@mui/material';
import '../../../../static/MovieCard/MovieCard.css';

const MainPageContent = ({ search, genre, duration, rating, actors, directors, musicians, producers, screenwriters, countryProduced }) => {
  const movies = useSelector((state) => state.movieReducer.movies);
  const liked = useSelector((state) => state.movieOptionsReducer.movieOptions?.favoriteFilm);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 10;
  const location = useLocation();

  useEffect(() => {
    let sourceMovies = location.pathname === '/liked' ? liked?.map(item => item.film) : movies;

    if (sourceMovies) {
      let filtered = sourceMovies;

      // Фильтрация по поисковому запросу
      if (search) {
        filtered = filtered.filter((movie) =>
          movie.title.toLowerCase().includes(search.toLowerCase()) || 
          movie.originalTitle.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Фильтрация по жанру
      if (genre) {
        filtered = filtered.filter((movie) => movie.genres.some((g) => g.name === genre.name));
      }

      // Фильтрация по актерам
      if (actors && actors.length > 0) {
        filtered = filtered.filter((movie) => 
          movie.actors.some((actor) => 
            actors.some(a => a.name === actor.name && a.surname === actor.surname)
          )
        );
      }

      // Фильтрация по режиссерам
      if (directors && directors.length > 0) {
        filtered = filtered.filter((movie) => 
          movie.directors.some((director) => 
            directors.some(d => d.name === director.name && d.surname === director.surname)
          )
        );
      }

      // Фильтрация по музыкантам
      if (musicians && musicians.length > 0) {
        filtered = filtered.filter((movie) => 
          movie.musicians.some((musician) => 
            musicians.some(m => m.name === musician.name && m.surname === musician.surname)
          )
        );
      }

      // Фильтрация по продюсерам
      if (producers && producers.length > 0) {
        filtered = filtered.filter((movie) => 
          movie.producers.some((producer) => 
            producers.some(p => p.name === producer.name && p.surname === producer.surname)
          )
        );
      }

      // Фильтрация по сценаристам
      if (screenwriters && screenwriters.length > 0) {
        filtered = filtered.filter((movie) => 
          movie.screenwriters.some((screenwriter) => 
            screenwriters.some(s => s.name === screenwriter.name && s.surname === screenwriter.surname)
          )
        );
      }

      // Фильтрация по стране производства
      if (countryProduced) {
        filtered = filtered.filter((movie) => 
          movie.countryProduced?.toLowerCase() === countryProduced.toLowerCase()
        );
      }

      // Фильтрация по продолжительности (диапазон)
      if (duration && duration.length === 2) {
        filtered = filtered.filter(
          (movie) => movie.duration >= duration[0] && movie.duration <= duration[1]
        );
      }

      // Фильтрация по рейтингу (диапазон)
      if (rating && rating.length === 2) {
        filtered = filtered.filter(
          (movie) => movie.kinopoiskRating >= rating[0] && movie.kinopoiskRating <= rating[1]
        );
      }

      setFilteredMovies(filtered);
    }
  }, [search, genre, duration, rating, actors, directors, musicians, producers, screenwriters, countryProduced, movies, liked, location.pathname]);

  // Разбиение на страницы
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className='movie-cards'>
      <ul>
        {currentMovies.map((movie, idx) => (
          <MovieCard key={movie.id} movie={movie} idx={indexOfFirstMovie + idx} />
        ))}
      </ul>

      {filteredMovies.length > moviesPerPage && (
        <Pagination
          count={Math.ceil(filteredMovies.length / moviesPerPage)}
          page={currentPage}
          onChange={handleChangePage}
          color="primary"
          siblingCount={1}
        />
      )}
    </div>
  );
};

export default MainPageContent;
