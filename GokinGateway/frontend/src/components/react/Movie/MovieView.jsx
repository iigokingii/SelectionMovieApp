import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography } from "@mui/material";
import { Card, CardMedia, CardContent, IconButton } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { addComment } from "../../redux/Movies/action";
import { changeGokinRating } from "../../redux/Movies/action";
import _ from 'lodash';
import '../../../static/Movie/Movie.css';
import MovieDetail from "./MovieDetail/MovieDetail";
import MovieStaff from "./MovieStaff/MovieStaff";
import MovieComment from "./MovieComment/MovieComment";
import StarIcon from '@mui/icons-material/Star';
import TrailerPlayer from "../TrailerPlayer/TrailerPlayer";

const MovieView = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const movies = useSelector((state) => state.movieReducer.movies);
  const credentials = useSelector((state) => state.credentialReducer.credentials);
  const [movie, setMovie] = useState({});
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [rating, setRating] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [isRating, setIsRating] = useState(false);
  const [showArrows, setShowArrows] = useState(false);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === "left" ? -300 : 300, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        setShowArrows(scrollRef.current.scrollWidth > scrollRef.current.clientWidth);
      }
    };

    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [recommendedMovies]);

  const handleStarClick = async (index) => {
    setRating(index + 1);
    setIsRating(false);
    const response = await fetch(`http://localhost:8082/filmservice/api/films/film/${movieId}/rating/${credentials.id}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(index + 1),
    });

    if (response.ok) {
      const newRating = await response.json();
      dispatch(changeGokinRating(parseInt(movieId), newRating));
      console.log(newRating);
    }
  };

  const handleButtonClick = () => {
    setIsRating(true);
  };

  useEffect(() => {
    if (isNaN(Number(movieId))) {
      navigate("/main");
    }

    const findMovie = movies.find((m) => m.id == movieId);
    if (findMovie) {
      setMovie(findMovie);
      setLoading(false);
    }
    console.log(movies);
    if (!findMovie || !findMovie.genres) return;

    const recommendations = movies.filter(m =>
      m.genres?.some(genre =>
        findMovie.genres?.some(fg => fg.name === genre.name && m.id !== findMovie.id)
      )
    );
    const shuffledRecommendations = recommendations.slice();
    for (let i = shuffledRecommendations.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledRecommendations[i], shuffledRecommendations[j]] = [shuffledRecommendations[j], shuffledRecommendations[i]]; // Меняем местами
    }

    setRecommendedMovies(shuffledRecommendations);
  }, [movies, movieId, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const maxCharCount = 2000;

  const handleCommentChange = (e) => {
    if (e.target.value.length <= maxCharCount) {
      setComment(e.target.value);
    }
  };

  const handleAddComment = async () => {
    if (comment.trim()) {
      const newComment = { comment, userId: credentials.id };
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
        dispatch(addComment(movieId, comment));
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
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div className="movie-title">{movie.title}</div>
                <div className="movie-original-title">{movie.originalTitle}</div>
              </div>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Box sx={{ paddingLeft: "20px", display: "flex", alignItems: "center", marginRight: "40px" }}>
                  {movie.kinopoiskRating > 0 && (
                    <Typography>
                      Рейтинг Кинопоиск: <span style={{ color: "gold" }}>{movie.kinopoiskRating ? movie.kinopoiskRating.toFixed(1) : 'N/A'}</span>
                    </Typography>
                  )}
                  {movie.imdbrating > 0 && (
                    <Typography sx={{ marginLeft: "10px" }}>
                      Рейтинг IMDb: <span style={{ color: "gold" }}>{movie.imdbrating ? movie.imdbrating.toFixed(1) : 'N/A'}</span>
                    </Typography>
                  )}
                  {movie.gokinRating > 0 && (
                    <Typography sx={{ marginLeft: "10px" }}>
                      Рейтинг Gokin: <span style={{ color: "gold" }}>{movie.gokinRating ? movie.gokinRating.toFixed(1) : 'N/A'}</span>
                    </Typography>
                  )}
                </Box>
                {!isRating ? (
                  <Box width={{ justifyContent: "center", display: "flex" }}>
                    <Button
                      variant="contained"
                      onClick={handleButtonClick}
                      sx={{ marginTop: "10px", backgroundColor: "gold" }}
                    >
                      Оценить фильм
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: "center", marginTop: "10px" }}>
                    {[...Array(10)].map((_, index) => (
                      <StarIcon
                        key={index}
                        sx={{
                          cursor: 'pointer',
                          color: (rating && index < rating) || (hovered !== null && index <= hovered) ? 'orange' : 'gray',
                          fontSize: 30
                        }}
                        onClick={() => handleStarClick(index)}
                        onMouseEnter={() => setHovered(index)}
                        onMouseLeave={() => setHovered(null)}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </div>
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
                {/* <MovieDetail movieDetailName="Бюджет" movieDetail={movie.budget} /> */}
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
              </div>
            </div>
          </div>
        </div>
        <div className="movie-description-wrapper">
          <div className="movie-description">
            {movie.description}
          </div>
        </div>
        {!_.isNull(movie.youtubeUrl) && movie.youtubeUrl !== ""
          ? <TrailerPlayer videoUrl={movie.youtubeUrl} />
          : null}
        {!_.isNull(recommendedMovies)
          ? <Box sx={{ position: "relative", width: "100%", maxWidth: "100%", 
            overflow: "hidden",  overflow: "hidden", bgcolor: "white"}}>
            {showArrows && (
              <IconButton
                onClick={() => scroll("left")}
                sx={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 1,
                  bgcolor: "white",
                  boxShadow: 2,
                  "&:hover": { bgcolor: "gray.300" }
                }}
              >
                <ArrowBack />
              </IconButton>
            )}

            <Box
              ref={scrollRef}
              sx={{
                display: "flex",
                gap: 2,
                overflowX: "auto",
                scrollBehavior: "smooth",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
                whiteSpace: "nowrap",
                p: 1,
              }}
            >
              {recommendedMovies.map((movie) => (
                <Card
                  key={movie.id}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  sx={{
                    minWidth: 200,
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.05)" }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="300"
                    image={movie.poster}
                    alt={movie.title}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent>
                    <Typography variant="h6" noWrap>
                      {movie.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(movie.yearOfPosting).getFullYear()}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {showArrows && (
              <IconButton
                onClick={() => scroll("right")}
                sx={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 1,
                  bgcolor: "white",
                  boxShadow: 2,
                  "&:hover": { bgcolor: "gray.300" }
                }}
              >
                <ArrowForward />
              </IconButton>
            )}
          </Box>
          : null}
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
