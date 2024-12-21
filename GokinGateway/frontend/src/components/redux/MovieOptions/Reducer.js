const initialState = {
    movieOptions: {}
};

const movieOptionsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_MOVIE_OPTIONS':
            return {
                ...state,
                movieOptions: action.payload
            };

        case 'ADD_UNIQUE_GENRE':
            if (!state.movieOptions.genres.find(genre => genre.id === action.payload.id)) {
                return {
                    ...state,
                    movieOptions: {
                        ...state.movieOptions,
                        genres: [...state.movieOptions.genres, action.payload]
                    }
                };
            }
            return state;

        case 'ADD_UNIQUE_DIRECTOR':
            if (!state.movieOptions.directors.find(director => director.id === action.payload.id)) {
                return {
                    ...state,
                    movieOptions: {
                        ...state.movieOptions,
                        directors: [...state.movieOptions.directors, action.payload]
                    }
                };
            }
            return state;

        case 'ADD_UNIQUE_ACTOR':
            if (!state.movieOptions.actors.find(actor => actor.id === action.payload.id)) {
                return {
                    ...state,
                    movieOptions: {
                        ...state.movieOptions,
                        actors: [...state.movieOptions.actors, action.payload]
                    }
                };
            }
            return state;

        case 'ADD_UNIQUE_SCREENWRITER':
            if (!state.movieOptions.screenWriters.find(screenwriter => screenwriter.id === action.payload.id)) {
                return {
                    ...state,
                    movieOptions: {
                        ...state.movieOptions,
                        screenWriters: [...state.movieOptions.screenWriters, action.payload]
                    }
                };
            }
            return state;

            case 'ADD_UNIQUE_PRODUCER':
                if (!state.movieOptions.producers.find(producer => producer.id === action.payload.id)) {
                    return {
                        ...state,
                        movieOptions: {
                            ...state.movieOptions,
                            producers: [...state.movieOptions.producers, action.payload]
                        }
                    };
                }
                return state;

        case 'ADD_UNIQUE_OPERATOR':
            if (!state.movieOptions.operators.find(operator => operator.id === action.payload.id)) {
                return {
                    ...state,
                    movieOptions: {
                        ...state.movieOptions,
                        operators: [...state.movieOptions.operators, action.payload]
                    }
                };
            }
            return state;

        case 'ADD_UNIQUE_MUSICIAN':
            if (!state.movieOptions.musicians.find(musician => musician.id === action.payload.id)) {
                return {
                    ...state,
                    movieOptions: {
                        ...state.movieOptions,
                        musicians: [...state.movieOptions.musicians, action.payload]
                    }
                };
            }
            return state;

        case 'ADD_UNIQUE_FILM':
            if (!state.movieOptions.films.find(film => film.id === action.payload.id)) {
                return {
                    ...state,
                    movieOptions: {
                        ...state.movieOptions,
                        films: [...state.movieOptions.films, action.payload]
                    }
                };
            }
            return state;
        

        

        case 'DELETE_UNIQUE_GENRE': {
            const { movies, genre } = action.payload;
        
            const genreUsageCount = movies.reduce((count, movie) => {
                return count + (movie.genres.some(g => g.id === genre.id) ? 1 : 0);
            }, 0);
        
        
            if (genreUsageCount <= 1) {
                return {
                    ...state,
                    movieOptions: {
                        ...state.movieOptions,
                        genres: state.movieOptions.genres.filter(g => g.id !== genre.id),
                    }
                };
            }
        
            return state;
        }
        

        case 'DELETE_UNIQUE_DIRECTOR': {
            const { movies, director } = action.payload;
            const directorUsageCount = movies.reduce((count, movie) => {
                return count + (movie.directors.some(d => d.id === director.id) ? 1 : 0);
            }, 0);
        
            if (directorUsageCount <= 1) {
                return {
                    ...state,
                    movieOptions: {
                        ...state.movieOptions,
                        directors: state.movieOptions.directors.filter(d => d.id !== director.id),
                    }
                };
            }
            return state;
        }
        
        case 'DELETE_UNIQUE_ACTOR': {
            const { movies, actor } = action.payload;
            const actorUsageCount = movies.reduce((count, movie) => {
                return count + (movie.actors.some(a => a.id === actor.id) ? 1 : 0);
            }, 0);
        
            if (actorUsageCount <= 1) {
                return {
                    ...state,
                    movieOptions: {
                        ...state.movieOptions,
                        actors: state.movieOptions.actors.filter(a => a.id !== actor.id),
                    }
                };
            }
            return state;
        }
        
        case 'DELETE_UNIQUE_SCREENWRITER': {
            const { movies, screenwriter } = action.payload;
            const screenwriterUsageCount = movies.reduce((count, movie) => {
                return count + (movie.screenWriters.some(s => s.id === screenwriter.id) ? 1 : 0);
            }, 0);
        
            if (screenwriterUsageCount <= 1) {
                return {
                    ...state,
                    movieOptions: {
                        ...state.movieOptions,
                        screenWriters: state.movieOptions.screenWriters.filter(s => s.id !== screenwriter.id),
                    }
                };
            }
            return state;
        }
        
        case 'DELETE_UNIQUE_OPERATOR': {
            const { movies, operator } = action.payload;
            const operatorUsageCount = movies.reduce((count, movie) => {
                return count + (movie.operators.some(o => o.id === operator.id) ? 1 : 0);
            }, 0);
        
            if (operatorUsageCount <= 1) {
                return {
                    ...state,
                    movieOptions: {
                        ...state.movieOptions,
                        operators: state.movieOptions.operators.filter(o => o.id !== operator.id),
                    }
                };
            }
            return state;
        }
        
        case 'DELETE_UNIQUE_MUSICIAN': {
            const { movies, musician } = action.payload;
            const musicianUsageCount = movies.reduce((count, movie) => {
                return count + (movie.musicians.some(m => m.id === musician.id) ? 1 : 0);
            }, 0);
        
            if (musicianUsageCount <= 1) {
                return {
                    ...state,
                    movieOptions: {
                        ...state.movieOptions,
                        musicians: state.movieOptions.musicians.filter(m => m.id !== musician.id),
                    }
                };
            }
            return state;
        }
        
        case 'DELETE_UNIQUE_PRODUCER': {
            const { movies, producer } = action.payload;
            const producerUsageCount = movies.reduce((count, movie) => {
                return count + (movie.producers.some(p => p.id === producer.id) ? 1 : 0);
            }, 0);
        
            if (producerUsageCount <= 1) {
                return {
                    ...state,
                    movieOptions: {
                        ...state.movieOptions,
                        producers: state.movieOptions.producers.filter(p => p.id !== producer.id),
                    }
                };
            }
            return state;
        }        

        default:
            return state;
    }
};


export default movieOptionsReducer;