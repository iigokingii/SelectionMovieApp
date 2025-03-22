import React, { useState, useEffect } from 'react';
import { TextField, Box, Button, Pagination, Stack } from '@mui/material';
import { KinopoiskDev, MovieQueryBuilder } from '@openmoviedb/kinopoiskdev_client';
import MovieCardKP from './MovieCardKP';
import _ from 'lodash'

const MovieFetcher = () => {
    const kp = new KinopoiskDev('FRS0QBR-W624BQ5-H8FVGZD-6EW7ZHY');
    const [movieName, setMovieName] = useState("");
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [movies, setMovies] = useState([]);
    const [isMovieDataFound, setIsMovieDataFound] = useState(false);

    useEffect(() => {
        const parsedLimit = parseInt(limit, 10) || 1;
        setPages(Math.ceil(movies.length / parsedLimit));
        setPage(1);
    }, [limit, movies]);

    const renderPagesLinks = () => {
        return (
            <Stack spacing={2} direction="row" justifyContent="center">
                <Pagination
                    count={pages}
                    page={page}
                    onChange={(e, newPage) => {
                        setPage(newPage);
                    }}
                    color="primary"
                    shape="rounded"
                    siblingCount={2}
                    boundaryCount={1}
                />
            </Stack>
        );
    };

    const AddMovie = (movieIndx) => {
        // console.log(movieIndx);
        setMovies(movies.filter(movie => movie.id !== movieIndx));
    }

    const renderFilms = () => {
        console.log({ page, pages });
    
        if (!movies.length) return null;
    
        const parsedLimit = parseInt(limit, 10) || 1;
        const startIdx = (page - 1) * parsedLimit;
        const endIdx = Math.min(startIdx + parsedLimit, movies.length);
    
        return movies.slice(startIdx, endIdx).map((doc, indx) => (
            <MovieCardKP key={doc.id} movie={doc} idx={startIdx + indx} AddMovie={AddMovie}/>
        ));
    };
    
    const renderFoundFilms = () => {
        return <>
            {renderFilms()}
            {renderPagesLinks()}
        </>
    }

    const findMovies = async (e, movieName) => {
        e.preventDefault();
        e.stopPropagation();
        
        const queryBuilder = new MovieQueryBuilder();
        const query = queryBuilder
            .query(movieName)
            .paginate(1, 250)
            .build();
            
        const response = await kp.movie.getBySearchQuery(query);
        console.log(response);
        
        if (response.statusCode == 200) {
            setIsMovieDataFound(true);
            const filteredMovies = response.data.docs.filter(doc => doc.description && doc.poster);
            console.log(filteredMovies);
    
            const parsedLimit = parseInt(limit, 10) || 1;
            setMovies(filteredMovies);
            setPages(Math.ceil(filteredMovies.length / parsedLimit));
        }
    }

    return (
        <>
            <Box
                className="form-section"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '30vh',
                }}
            >
                <Box
                    sx={{
                        width: '600px',
                        backgroundColor: '#f9f9f9',
                        padding: 3,
                        borderRadius: 2,
                        boxShadow: 3,
                    }}
                >
                    <TextField
                        label="Название фильма"
                        variant="outlined"
                        fullWidth
                        name="title"
                        value={movieName}
                        onChange={(e) => setMovieName(e.target.value)}
                        placeholder="Введите название фильма"
                        required
                        sx={{ marginBottom: 2, backgroundColor: '#fff' }}
                    />
                    <TextField
                        label="Количество фильмов на странице"
                        variant="outlined"
                        fullWidth
                        name="limit"
                        type="number"
                        value={limit}
                        onChange={(e) => setLimit(e.target.value)}
                        placeholder="Введите количество фильмов"
                        required
                        sx={{ marginBottom: 2, backgroundColor: '#fff' }}
                    />
                    <Button
                        onClick={(e) => findMovies(e, movieName)}
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                    >
                        Найти
                    </Button>
                </Box>
            </Box>

            {isMovieDataFound ? (
                <Box
                    sx={{
                        margin: '0 10%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {renderFoundFilms()}
                </Box>
            ) : null}
        </>


    )
}

export default MovieFetcher;