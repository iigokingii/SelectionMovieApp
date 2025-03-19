export const setMovies = (movies) => ({
    type: "SET_MOVIES",
    payload: movies,
});

export const deleteMovie = (movieId) => ({
    type: "DELETE_MOVIE",
    payload: movieId,
});

export const addMovie = (movie) => ({
    type: "ADD_MOVIE",
    payload: movie,
});

export const changeGokinRating = (movieId, gokinRating) => ({
    type: 'CHANGE_GOKIN_RATING',
    payload: { movieId, gokinRating },
})

export const updateMovie = (movie) => ({
    type: "UPDATE_MOVIE",
    payload: movie,
});

export const addComment = (movieId, comment) => ({
    type: "ADD_COMMENT",
    payload: { movieId, comment },
})

export const deleteComment = (movieId, commentId) => ({
    type: "DELETE_COMMENT",
    payload: { movieId, commentId },
});

export const updateComment = (movieId, commentId, comment) => ({
    type: "UPDATE_COMMENT",
    payload: { movieId, commentId, comment },
});

export const deleteGenre = (movieId, itemId) => ({
    type: "DELETE_GENRE",
    payload: { movieId, itemId },
})

export const deleteDirector = (movieId, itemId) => ({
    type: "DELETE_DIRECTOR",
    payload: { movieId, itemId },
})

export const deleteActor = (movieId, itemId) => ({
    type: "DELETE_ACTOR",
    payload: { movieId, itemId },
})

export const deleteProducer = (movieId, itemId) => ({
    type: "DELETE_PRODUCER",
    payload: { movieId, itemId },
})

export const deleteScreenwriter = (movieId, itemId) => ({
    type: "DELETE_SCREENWRITER",
    payload: { movieId, itemId },
})

export const deleteOperator = (movieId, itemId) => ({
    type: "DELETE_OPERATOR",
    payload: { movieId, itemId },
})

export const deleteMusician = (movieId, itemId) => ({
    type: "DELETE_MUSICIAN",
    payload: { movieId, itemId },
})

export const addGenre = (movieId, item) => ({
    type: "ADD_GENRE",
    payload: { movieId, item },
})

export const addDirector = (movieId, item) => ({
    type: "ADD_DIRECTOR",
    payload: { movieId, item },
})

export const addActor = (movieId, item) => ({
    type: "ADD_ACTOR",
    payload: { movieId, item },
})

export const addProducer = (movieId, item) => ({
    type: "ADD_PRODUCER",
    payload: { movieId, item },
})

export const addScreenwriter = (movieId, item) => ({
    type: "ADD_SCREENWRITER",
    payload: { movieId, item },
})

export const addOperator = (movieId, item) => ({
    type: "ADD_OPERATOR",
    payload: { movieId, item },
})

export const addMusician = (movieId, item) => ({
    type: "ADD_MUSICIAN",
    payload: { movieId, item },
})
