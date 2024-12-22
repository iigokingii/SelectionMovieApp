export const setMovieOptions = (credentials) => ({
    type: 'SET_MOVIE_OPTIONS',
    payload: credentials,
});

export const addUniqueGenre = (genre) => ({
    type: 'ADD_UNIQUE_GENRE',
    payload: genre,
});

export const addUniqueFavorite = (favorite) => ({
    type: 'ADD_UNIQUE_FAVORITE',
    payload: favorite,
});

export const addUniqueDirector = (director) => ({
    type: 'ADD_UNIQUE_DIRECTOR',
    payload: director,
});

export const addUniqueActor = (actor) => ({
    type: 'ADD_UNIQUE_ACTOR',
    payload: actor,
});

export const addUniqueProducer = (producer) => ({
    type: 'ADD_UNIQUE_PRODUCER',
    payload: producer,
});

export const addUniqueScreenwriter = (screenwriter) => ({
    type: 'ADD_UNIQUE_SCREENWRITER',
    payload: screenwriter,
});

export const addUniqueOperator = (operator) => ({
    type: 'ADD_UNIQUE_OPERATOR',
    payload: operator,
});

export const addUniqueMusician = (musician) => ({
    type: 'ADD_UNIQUE_MUSICIAN',
    payload: musician,
});

export const addUniqueFilm = (film) => ({
    type: 'ADD_UNIQUE_FILM',
    payload: film,
});

export const deleteUniqueGenre = (movies, genre) => ({
    type: 'DELETE_UNIQUE_GENRE',
    payload: {movies, genre},
});

export const deleteUniqueFavorite = (favoriteId) => ({
    type: 'DELETE_UNIQUE_FAVORITE',
    payload: favoriteId,
});

export const deleteUniqueDirector = (movies, director) => ({
    type: 'DELETE_UNIQUE_DIRECTOR',
    payload: {movies, director,}
});

export const deleteUniqueActor = (movies, actor) => ({
    type: 'DELETE_UNIQUE_ACTOR',
    payload: {movies, actor,}
});

export const deleteUniqueScreenwriter = (movies, screenwriter) => ({
    type: 'DELETE_UNIQUE_SCREENWRITER',
    payload: {movies, screenwriter,}
});

export const deleteUniqueOperator = (movies, operator) => ({
    type: 'DELETE_UNIQUE_OPERATOR',
    payload: {movies, operator,}
});

export const deleteUniqueMusician = (movies, musician) => ({
    type: 'DELETE_UNIQUE_MUSICIAN',
    payload: {movies, musician,}
});

export const deleteUniqueProducer = (movies, producer) => ({
    type: 'DELETE_UNIQUE_PRODUCER',
    payload: {movies, producer,}
});
