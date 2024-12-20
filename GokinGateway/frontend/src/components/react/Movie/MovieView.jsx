import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addComment } from "../../redux/Movies/action";
import _ from 'lodash';
import '../../../static/Movie/Movie.css';
import MovieDetail from "./MovieDetail/MovieDetail";
import MovieStaff from "./MovieStaff/MovieStaff";
import MovieComment from "./MovieComment/MovieComment";
import Header from '../Header/Header';

const MovieView = () => {
  const { movieId } = useParams();
  console.log(movieId);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const movies = useSelector((state) => state.movieReducer.movies);
  const credentials = useSelector((state) => state.credentialReducer.credentials);

  const [movie, setMovie] = useState({});
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (isNaN(Number(movieId))) {
      navigate("/main");
    }

    const findMovie = movies.find((m) => m.id == movieId);

    console.log(movies);
    console.log(findMovie);
    if(findMovie){
      setMovie(findMovie);
      setLoading(false);
    }
  }, [movies, movieId, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const maxCharCount = 5000;

  const handleCommentChange = (e) => {
    if (e.target.value.length <= maxCharCount) {
      setComment(e.target.value);
    }
  };

  const handleAddComment = async () => {
    console.log(comment);
    if (comment.trim()) {
      const newComment = { comment, userId:credentials.id };
      console.log(newComment);
      const response = await fetch(`http://localhost:8082/filmservice/api/films/film/${movieId}/comment`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComment),
      });

      if (response.ok) {
        const comment = await response.json();
        console.log(comment);
        dispatch(addComment(movieId, comment));
      }

      else {
        console.log('пиздак');
      }
      setComment("");
    }
  };

  return (
    <React.Fragment>
      <div className="movie-content-wrapper">
        <div className="movie-info-wrapper">
          <div className="movie-poster-wrapper">
            <img src={movie.poster} alt="Постер" className="movie-poster" />
          </div>
          <div className="movie-info">
            <div className="movie-title">{movie.title}</div>
            <div className="movie-original-title">{movie.originalTitle}</div>
            <div className="movie-about-section">О фильме</div>
            <div className="movie-details-wrapper">
              <div className="movie-details">
                <MovieDetail movieDetailName="Дата производства" movieDetail={movie.yearOfPosting.split('T')[0]} />
                <MovieDetail movieDetailName="Страна" movieDetail={movie.countryProduced} />
                <MovieDetail movieDetailName="Жанр" movieDetail={movie.genres.map(genre => genre.name).join(', ')} />
                <MovieDetail movieDetailName="Режиссер" movieDetail={movie.directors.map(director => director.name + " " + director.middleName + " " + director.surname).join(', ')} />
                <MovieDetail movieDetailName="Сценарий" movieDetail={movie.screenWriters.map(screenWriter => screenWriter.name + " " + screenWriter.middleName + " " + screenWriter.surname).join(', ')} />
                <MovieDetail movieDetailName="Оператор" movieDetail={movie.operators.map(operator => operator.name + " " + operator.middleName + " " + operator.surname).join(', ')} />
                <MovieDetail movieDetailName="Композитор" movieDetail={movie.musicians.map(musician => musician.name + " " + musician.middleName + " " + musician.surname).join(', ')} />
                <MovieDetail movieDetailName="Бюджет" movieDetail={movie.countryProduced} />
                <MovieDetail movieDetailName="Сборы в мире" movieDetail={movie.totalBoxOffice} />
                <MovieDetail movieDetailName="Возраст" movieDetail={`${movie.age}+`} />
                <MovieDetail movieDetailName="Время" movieDetail={`${movie.duration} мин`} />
                <MovieDetail movieDetailName="Imdb рейтинг" movieDetail={movie.imdbrating} />
                <MovieDetail movieDetailName="КиноПоиск рейтинг" movieDetail={movie.kinopoiskRating} />
              </div>
              <div className="movie-staff-wrapper">
                <div className="movie-staff">
                  <div className="movie-actors-header">{'В главных ролях:'}</div>
                  {movie.actors.map((actor, idx) => {
                    return (
                      <MovieStaff staff={actor} key={idx} />
                    )
                  })}
                </div>
                <div>
                  <div>{'Роли дублировали: '}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="movie-description-wrapper">
          <div className="movie-description">
            {movie.description}
          </div>
        </div>
        <div className="movie-comments-wrapper">
          <Box sx={{ padding: "10px 40px 0px 40px", minWidth: "400px", maxWidth: "600px" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 2,

              }}
            >
              <Typography variant="h6">Добавить комментарий</Typography>
              <Typography
                variant="body2"
                color={comment.length === maxCharCount ? "error" : "textSecondary"}
              >
                {comment.length} / {maxCharCount}
              </Typography>
            </Box>

            <TextField
              label="Введите ваш комментарий"
              multiline
              rows={4}
              variant="outlined"
              value={comment}
              onChange={handleCommentChange}
              fullWidth
            />

            <Box sx={{ marginTop: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddComment}
                disabled={!comment.trim()}
              >
                Добавить комментарий
              </Button>
            </Box>


          </Box>
          <Box sx={{ marginTop: 4, padding: "10px 40px 0px 40px" }}>
            {
              !_.isEmpty(movie.comments)
                ? [...movie.comments]
                  .sort((a, b) => new Date(b.dateOfPosting) - new Date(a.dateOfPosting))
                  .map((comment) => (
                    <MovieComment key={comment.id} comment={comment} movieId={movieId} />
                ))
                : null
            }
          </Box>
        </div>
      </div>
    </React.Fragment>
  );
};

export default MovieView;
