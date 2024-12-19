import React, { useEffect, useState } from 'react';
import * as Actions from '../../redux/Movies/action';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    CardMedia, IconButton, Tooltip, Box, Modal, TextField, Typography, Grid
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import _ from 'lodash';

const MovieList = () => {
    const dispatch = useDispatch();
    const movies = useSelector((state) => state.movieReducer.movies);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedDescription, setExpandedDescription] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [newItemData, setNewItemData] = useState({});
    const [currentField, setCurrentField] = useState('');
    const [currentMovieId, setCurrentMovieId] = useState(null);
    const navigate = useNavigate();

    const fetchMovies = async () => {
        try {
            const response = await fetch('http://localhost:8082/filmservice/api/films', {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch movies');
            }
            const data = await response.json();
            dispatch(Actions.setMovies(data));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        _.isEmpty(movies) ? fetchMovies() : setLoading(false);
    }, []);

    if (loading && _.isEmpty(movies)) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const handleDelete = async (id) => {
        const response = await fetch(`http://localhost:8082/filmservice/api/films/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (response.ok) {
            dispatch(Actions.deleteMovie(id));
        }
    };

    const handleEdit = (id) => {
        navigate(`/update-movie/${id}`);
    };

    const toggleDescription = (id) => {
        setExpandedDescription((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleAddItem = (fieldName, movieId) => {
        setCurrentField(fieldName);
        setCurrentMovieId(movieId);
        setOpenModal(true);
    };

    const handleRemoveItem = async (fieldName, movieId, itemId) => {
        console.log(`Remove ${itemId} from ${fieldName} for movie ID: ${movieId}`);
        const response = await fetch(`http://localhost:8082/filmservice/api/films/${movieId}/${fieldName}/${itemId}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (response.ok) {
            switch (fieldName) {
                case 'genres':
                    dispatch(Actions.deleteGenre(movieId, itemId));
                    break;
                case 'directors':
                    dispatch(Actions.deleteDirector(movieId, itemId));
                    break;
                case 'actors':
                    dispatch(Actions.deleteActor(movieId, itemId));
                    break;
                case 'screenwriters':
                    dispatch(Actions.deleteScreenwriter(movieId, itemId));
                    break;
                case 'operators':
                    dispatch(Actions.deleteOperator(movieId, itemId));
                    break;
                case 'musicians':
                    dispatch(Actions.deleteMusician(movieId, itemId));
                    break;

                default:
                    console.log(`Unknown field: ${fieldName}`);
            }
        }
    };

    const handleModalClose = () => {
        setOpenModal(false);
        setNewItemData({});
    };

    const handleModalSubmit = async () => {
        try {
            let response;
            const endpoint = `http://localhost:8082/filmservice/api/films/${currentMovieId}/${currentField}`;

            if (currentField === 'genres') {
                response = await fetch(endpoint, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newItemData),
                });
            } else {
                response = await fetch(endpoint, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        firstName: newItemData.firstName,
                        lastName: newItemData.lastName,
                        middleName: newItemData.middleName,
                        birthDate: newItemData.dateOfBirth,
                    }),
                });
            }

            if (response.ok) {
                const data = await response.json();
                switch (currentField) {
                    case 'genres':
                        dispatch(Actions.addGenre(currentMovieId, data));
                        break;

                    case 'directors':
                        dispatch(Actions.addDirector(currentMovieId, data));
                        break;

                    case 'actors':
                        dispatch(Actions.addActor(currentMovieId, data));
                        break;

                    case 'screenwriters':
                        dispatch(Actions.addScreenwriter(currentMovieId, data));
                        break;

                    case 'operators':
                        dispatch(Actions.addOperator(currentMovieId, data));
                        break;

                    case 'musicians':
                        dispatch(Actions.addMusician(currentMovieId, data));
                        break;

                    default:
                        console.error('Unknown field type:', currentField);
                        break;
                }

                handleModalClose();
                console.log('------------');
                console.log(data);
                console.log(currentField);
                console.log(newItemData);
                console.log('------------');
            }
        } catch (error) {
            console.error('Error adding new item:', error);
        }
    };

    return (
        <React.Fragment>
            <div style={{ display: 'flex', flexDirection: 'column', height: '90vh' }}>
                <TableContainer
                    component={Paper}
                    sx={{ flex: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 64px)' }}
                >
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Index</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Title</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Original Title</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Year</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Country</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Genres</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Directors</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actors</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Description</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Budget</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Screenwriters</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Operators</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Musicians</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Duration</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Rating</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Poster</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {movies.map((movie, idx) => (
                                <TableRow key={movie.id}>
                                    <TableCell align="center">{idx + 1}</TableCell>
                                    <TableCell align="center">{movie.title}</TableCell>
                                    <TableCell align="center">{movie.originalTitle}</TableCell>
                                    <TableCell align="center">{movie.yearOfPosting.split('T')[0]}</TableCell>
                                    <TableCell align="center">{movie.countryProduced}</TableCell>
                                    <TableCell align="center">
                                        {movie.genres.map((genre, index) => (
                                            <span key={index} style={{ display: 'inline-flex', alignItems: 'center', marginRight: 4 }}>
                                                {genre.name}
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleRemoveItem('genres', movie.id, genre.id)}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </span>
                                        ))}
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleAddItem('genres', movie.id)}
                                            startIcon={<AddCircleOutlineIcon />}
                                            sx={{ marginLeft: 1 }}
                                        >
                                            Add
                                        </Button>
                                    </TableCell>
                                    <TableCell align="center">
                                        {movie.directors.map((director, index) => (
                                            <span key={index} style={{ display: 'inline-flex', alignItems: 'center', marginRight: 4 }}>
                                                {director.name}
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleRemoveItem('directors', movie.id, director.id)}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </span>
                                        ))}
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleAddItem('directors', movie.id)}
                                            startIcon={<AddCircleOutlineIcon />}
                                            sx={{ marginLeft: 1 }}
                                        >
                                            Add
                                        </Button>
                                    </TableCell>
                                    <TableCell align="center">
                                        {movie.actors.map((actor, index) => (
                                            <span key={index} style={{ display: 'inline-flex', alignItems: 'center', marginRight: 4 }}>
                                                {actor.name}
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleRemoveItem('actors', movie.id, actor.id)}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </span>
                                        ))}
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleAddItem('actors', movie.id)}
                                            startIcon={<AddCircleOutlineIcon />}
                                            sx={{ marginLeft: 1 }}
                                        >
                                            Add
                                        </Button>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Box
                                            sx={{
                                                width: expandedDescription[movie.id] ? 250 : 'auto',
                                                transition: 'width 0.3s',
                                                whiteSpace: expandedDescription[movie.id] ? 'normal' : 'nowrap',
                                                overflow: 'hidden',
                                                wordWrap: 'break-word',
                                                maxWidth: '250px',
                                            }}
                                        >
                                            {expandedDescription[movie.id] ? movie.description : `${movie.description.substring(0, 10)}...`}
                                        </Box>
                                        <Button
                                            size="small"
                                            onClick={() => toggleDescription(movie.id)}
                                        >
                                            {expandedDescription[movie.id] ? 'Show Less' : 'Show More'}
                                        </Button>
                                    </TableCell>
                                    <TableCell align="center">${movie.totalBoxOffice.toLocaleString()}</TableCell>
                                    <TableCell align="center">
                                        {movie.screenWriters.map((writer) => (
                                            <span key={writer.name} style={{ display: 'inline-flex', alignItems: 'center', marginRight: 4 }}>
                                                {writer.name}
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleRemoveItem('screenwriters', movie.id, writer.id)}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </span>
                                        ))}
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleAddItem('screenwriters', movie.id)}
                                            startIcon={<AddCircleOutlineIcon />}
                                            sx={{ marginLeft: 1 }}
                                        >
                                            Add
                                        </Button>
                                    </TableCell>
                                    <TableCell align="center">
                                        {movie.operators.map((operator) => (
                                            <span key={operator.name} style={{ display: 'inline-flex', alignItems: 'center', marginRight: 4 }}>
                                                {operator.name}
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleRemoveItem('operators', movie.id, operator.id)}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </span>
                                        ))}
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleAddItem('operators', movie.id)}
                                            startIcon={<AddCircleOutlineIcon />}
                                            sx={{ marginLeft: 1 }}
                                        >
                                            Add
                                        </Button>
                                    </TableCell>
                                    <TableCell align="center">
                                        {movie.musicians.map((musician) => (
                                            <span key={musician.name} style={{ display: 'inline-flex', alignItems: 'center', marginRight: 4 }}>
                                                {musician.name}
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleRemoveItem('musicians', movie.id, musician.id)}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </span>
                                        ))}
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleAddItem('musicians', movie.id)}
                                            startIcon={<AddCircleOutlineIcon />}
                                            sx={{ marginLeft: 1 }}
                                        >
                                            Add
                                        </Button>
                                    </TableCell>
                                    <TableCell align="center">{movie.duration} min</TableCell>
                                    <TableCell align="center">{movie.kinopoiskRating}</TableCell>
                                    <TableCell align="center">
                                        <CardMedia
                                            component="img"
                                            sx={{
                                                width: 40,
                                                height: 60,
                                                objectFit: 'cover',
                                                borderRadius: 1
                                            }}
                                            image={movie.poster}
                                            alt={movie.title}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleDelete(movie.id)}
                                            sx={{ marginRight: 1 }}
                                            size="small"
                                        >
                                            Delete
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleEdit(movie.id)}
                                            size="small"
                                        >
                                            Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            {/* Modal for adding new item */}
            <Modal
                open={openModal}
                onClose={handleModalClose}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        width: 400,
                        padding: 3,
                        backgroundColor: 'white',
                        borderRadius: 1,
                        boxShadow: 24,
                    }}
                >
                    <Typography variant="h6" component="h2">
                        Add {currentField === 'genres' ? 'Genre' : currentField.charAt(0).toUpperCase() + currentField.slice(1)} to Movie
                    </Typography>
                    <Grid container spacing={2} sx={{ marginTop: 2 }}>
                        {currentField === 'genres' && (
                            <>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Genre Name"
                                        value={newItemData.name || ''}
                                        onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Genre Description"
                                        value={newItemData.description || ''}
                                        onChange={(e) => setNewItemData({ ...newItemData, description: e.target.value })}
                                    />
                                </Grid>
                            </>
                        )}
                        {(currentField === 'actors' ||
                            currentField === 'directors' ||
                            currentField === 'screenwriters' ||
                            currentField === 'operators' ||
                            currentField === 'musicians') && (
                                <>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="First Name"
                                            value={newItemData.firstName || ''}
                                            onChange={(e) => setNewItemData({ ...newItemData, firstName: e.target.value })}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Last Name"
                                            value={newItemData.lastName || ''}
                                            onChange={(e) => setNewItemData({ ...newItemData, lastName: e.target.value })}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Middle Name"
                                            value={newItemData.middleName || ''}
                                            onChange={(e) => setNewItemData({ ...newItemData, middleName: e.target.value })}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Date of Birth"
                                            value={newItemData.dateOfBirth || ''}
                                            onChange={(e) => setNewItemData({ ...newItemData, dateOfBirth: e.target.value })}
                                            type="date"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Grid>
                                </>
                            )}
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                        <Button variant="outlined" color="secondary" onClick={handleModalClose}>
                            Cancel
                        </Button>
                        <Button variant="outlined" color="primary" onClick={handleModalSubmit}>
                            Save
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </React.Fragment>
    );
};

export default MovieList;
