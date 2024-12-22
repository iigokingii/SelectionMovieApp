import React, { useEffect, useState } from 'react';
import MovieCard from './MovieCard/MovieCard';
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import _ from 'lodash';
import '../../../../static/MovieCard/MovieCard.css';

const MainPageContent = ({ search, genre, duration, rating }) => {
  const movies = useSelector((state) => state.movieReducer.movies);
  const liked = useSelector((state) => state.movieOptionsReducer.movieOptions?.favoriteFilm);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const location = useLocation();

  useEffect(() => {
    let sourceMovies = location.pathname === '/liked' ? liked?.map(item => item.film) : movies;;

    if (sourceMovies) {
      let filtered = sourceMovies;

      if (search) {
        filtered = filtered.filter((movie) =>
          movie.title.toLowerCase().includes(search.toLowerCase()) || 
          movie.originalTitle.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (genre) {
        filtered = filtered.filter((movie) => movie.genres.some((g) => g.name === genre));
      }

      filtered = filtered.filter(
        (movie) => movie.duration >= duration[0] && movie.duration <= duration[1]
      );

      filtered = filtered.filter(
        (movie) => movie.kinopoiskRating >= rating[0] && movie.kinopoiskRating <= rating[1]
      );

      setFilteredMovies(filtered);
    }
  }, [search, genre, duration, rating, movies, liked, location.pathname]);

  return (
    <div className='movie-cards'>
      <ul>
        {filteredMovies.map((movie, idx) => (
          <MovieCard key={movie.id} movie={movie} idx={idx} />
        ))}
      </ul>
    </div>
  );
};

export default MainPageContent;
