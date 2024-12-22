const initialState = {
    movies: []
};

const movieReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_MOVIES':
            return {
                ...state,
                movies: action.payload
            };
        case 'DELETE_MOVIE':
            var updatedMovies = state.movies.filter(movie => movie.id !== action.payload);
            return {
                ...state,
                movies: updatedMovies
            };
        case 'ADD_MOVIE':
            var updatedMovies = [...state.movies, action.payload];
            return {
                ...state,
                movies: updatedMovies
            };

        case 'UPDATE_MOVIE':
            var updateMovies = state.movies.map(movie => {
                if (movie.id === action.payload.id)
                    return action.payload
                return movie;
            })
            return {
                ...state,
                movies: updateMovies,
            }

        case 'ADD_COMMENT':
            var { movieId, comment } = action.payload;
            var updatedMovies = state.movies.map((movie) => {
                if (movie.id != movieId) return movie;
                return {
                    ...movie,
                    comments: [comment, ...movie.comments]
                };
            });

            return {
                ...state,
                movies: updatedMovies
            };

        case 'DELETE_COMMENT':
            var { movieId, commentId } = action.payload;
            var updatedMovies = state.movies.map((movie) => {
                if (movie.id != movieId) return movie;
                return {
                    ...movie,
                    comments: movie.comments.filter(comment => comment.id !== commentId)
                };
            });
            return {
                ...state,
                movies: updatedMovies
            };

        case 'UPDATE_COMMENT':
            var { movieId, commentId } = action.payload;
            var updatedMovies = state.movies.map((movie) => {
                if (movie.id != movieId) return movie;
                return {
                    ...movie,
                    comments: movie.comments.map(comment => {
                        if (comment.id !== commentId)
                            return comment
                        return action.payload.comment
                    })
                };
            });
            return {
                ...state,
                movies: updatedMovies
            };

        case 'DELETE_GENRE':
            var { movieId, itemId } = action.payload;
            var updatedMoviesGenres = state.movies.map((movie) => {
                if (movie.id !== movieId) return movie;
                return {
                    ...movie,
                    genres: movie.genres.filter((genre) => genre.id !== itemId)
                };
            });
            return {
                ...state,
                movies: updatedMoviesGenres
            };

        case 'DELETE_DIRECTOR':
            var { movieId, itemId } = action.payload;
            var updatedMoviesDirectors = state.movies.map((movie) => {
                if (movie.id !== movieId) return movie;
                return {
                    ...movie,
                    directors: movie.directors.filter((director) => director.id !== itemId)
                };
            });

            return {
                ...state,
                movies: updatedMoviesDirectors
            };

        case 'DELETE_ACTOR':
            var { movieId, itemId } = action.payload;
            var updatedMoviesActors = state.movies.map((movie) => {
                if (movie.id !== movieId) return movie;
                return {
                    ...movie,
                    actors: movie.actors.filter((actor) => actor.id !== itemId)
                };
            });

            return {
                ...state,
                movies: updatedMoviesActors
            };

        case 'DELETE_PRODUCER':
            var { movieId, itemId } = action.payload;
            var updatedMoviesProducers = state.movies.map((movie) => {
                if (movie.id !== movieId) return movie;
                return {
                    ...movie,
                    producers: movie.producers.filter((producer) => producer.id !== itemId)
                };
            });

            return {
                ...state,
                movies: updatedMoviesProducers
            };

        case 'DELETE_SCREENWRITER':
            var { movieId, itemId } = action.payload;
            var updatedMoviesScreenwriters = state.movies.map((movie) => {
                if (movie.id !== movieId) return movie;
                return {
                    ...movie,
                    screenWriters: movie.screenWriters.filter((screenWriter) => screenWriter.id !== itemId)
                };
            });

            return {
                ...state,
                movies: updatedMoviesScreenwriters
            };

        case 'DELETE_OPERATOR':
            var { movieId, itemId } = action.payload;
            var updatedMoviesOperators = state.movies.map((movie) => {
                if (movie.id !== movieId) return movie;
                return {
                    ...movie,
                    operators: movie.operators.filter((operator) => operator.id !== itemId)
                };
            });

            return {
                ...state,
                movies: updatedMoviesOperators
            };

        case 'DELETE_MUSICIAN':
            var { movieId, itemId } = action.payload;
            var updatedMoviesMusicians = state.movies.map((movie) => {
                if (movie.id !== movieId) return movie;
                return {
                    ...movie,
                    musicians: movie.musicians.filter((musician) => musician.id !== itemId)
                };
            });

            return {
                ...state,
                movies: updatedMoviesMusicians
            };
        case 'ADD_GENRE':
            var { movieId, item } = action.payload;
            var updatedMoviesGenres = state.movies.map((movie) => {
                if (movie.id !== movieId) return movie;
                return {
                    ...movie,
                    genres: [...movie.genres, item]
                };
            });
            return {
                ...state,
                movies: updatedMoviesGenres
            };

        case 'ADD_DIRECTOR':
            var { movieId, item } = action.payload;
            var updatedMoviesDirectors = state.movies.map((movie) => {
                if (movie.id !== movieId) return movie;
                return {
                    ...movie,
                    directors: [...movie.directors, item]
                };
            });

            return {
                ...state,
                movies: updatedMoviesDirectors
            };

        case 'ADD_ACTOR':
            var { movieId, item } = action.payload;
            var updatedMoviesActors = state.movies.map((movie) => {
                if (movie.id !== movieId) return movie;
                return {
                    ...movie,
                    actors: [...movie.actors, item]
                };
            });

            return {
                ...state,
                movies: updatedMoviesActors
            };

        case 'ADD_PRODUCER':
            var { movieId, item } = action.payload;
            
            var updatedMoviesProducers = state.movies.map((movie) => {
                if (movie.id !== movieId) return movie;
                return {
                    ...movie,
                    producers: [...movie.producers, item]
                };
            });

            return {
                ...state,
                movies: updatedMoviesProducers
            };

        case 'ADD_SCREENWRITER':
            var { movieId, item } = action.payload;
            var updatedMoviesScreenwriters = state.movies.map((movie) => {
                if (movie.id !== movieId) return movie;
                return {
                    ...movie,
                    screenWriters: [...movie.screenWriters, item]
                };
            });

            return {
                ...state,
                movies: updatedMoviesScreenwriters
            };

        case 'ADD_OPERATOR':
            var { movieId, item } = action.payload;
            var updatedMoviesOperators = state.movies.map((movie) => {
                if (movie.id !== movieId) return movie;
                return {
                    ...movie,
                    operators: [...movie.operators, item]
                };
            });

            return {
                ...state,
                movies: updatedMoviesOperators
            };

        case 'ADD_MUSICIAN':
            var { movieId, item } = action.payload;
            var updatedMoviesMusicians = state.movies.map((movie) => {
                if (movie.id !== movieId) return movie;
                return {
                    ...movie,
                    musicians: [...movie.musicians, item]
                };
            });

            return {
                ...state,
                movies: updatedMoviesMusicians
            };


        default:
            return state;
    }
};

export default movieReducer;