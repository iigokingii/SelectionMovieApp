import React, { useEffect, useState } from 'react';
import * as Actions from '../../redux/Movies/action';
import * as MovieOptionsActions from '../../redux/MovieOptions/Action';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    CardMedia, IconButton, Box, Modal, TextField, Typography, Grid, Radio, RadioGroup, FormControlLabel,
    FormControl, Select, MenuItem
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import _ from 'lodash';

const MovieList = () => {
    const dispatch = useDispatch();
    const movies = useSelector((state) => state.movieReducer.movies);
    const options = useSelector((state) => state.movieOptionsReducer.movieOptions);
    const [manualInput, setManualInput] = useState(true);
    const [expandedDescription, setExpandedDescription] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [newItemData, setNewItemData] = useState({});
    const [currentField, setCurrentField] = useState('');
    const [currentMovieId, setCurrentMovieId] = useState(null);
    const navigate = useNavigate();

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
        console.log('handleAddItem')
        console.log({fieldName, movieId});
        console.log('/handleAddItem')
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
            const text = await response.text();
            console.log('pppppppppppppppppp');
            console.log(text);
            console.log('pppppppppppppppppp');
            if (!_.isEmpty(text)) {
                const data = JSON.parse(text);
                console.log('fieldName: ',fieldName)
                switch (fieldName) {
                    case 'genres':
                        dispatch(Actions.deleteGenre(movieId, data.id));
                        dispatch(MovieOptionsActions.deleteUniqueGenre(movies, data));
                        break;
                    case 'directors':
                        dispatch(Actions.deleteDirector(movieId, data.id));
                        dispatch(MovieOptionsActions.deleteUniqueDirector(movies, data));
                        break;
                    case 'actors':
                        dispatch(Actions.deleteActor(movieId, data.id));
                        dispatch(MovieOptionsActions.deleteUniqueActor(movies, data));
                        break;
                    case 'producers':
                        dispatch(Actions.deleteProducer(movieId, data.id));
                        dispatch(MovieOptionsActions.deleteUniqueProducer(movies, data));
                        break;
                    case 'screenwriters':
                        dispatch(Actions.deleteScreenwriter(movieId, data.id));
                        dispatch(MovieOptionsActions.deleteUniqueScreenwriter(movies, data));
                        break;
                    case 'operators':
                        dispatch(Actions.deleteOperator(movieId, data.id));
                        dispatch(MovieOptionsActions.deleteUniqueOperator(movies, data));
                        break;
                    case 'musicians':
                        dispatch(Actions.deleteMusician(movieId, data.id));
                        dispatch(MovieOptionsActions.deleteUniqueMusician(movies, data));
                        break;

                    default:
                        console.log(`Unknown field: ${fieldName}`);
                }
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
            console.log(newItemData);
            if (currentField === 'genres') {
                response = await fetch(endpoint, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newItemData.genre
                        ? newItemData.genre
                        : newItemData),
                });
            } else {
                const person = newItemData.person
                    ? newItemData.person
                    : newItemData
                console.log(person);
                response = await fetch(endpoint, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        firstName: person.name ? person.name: person.firstName,
                        lastName: person.surname ? person.surname: person.lastName,
                        middleName: person.middleName ? person.middleName: person.middleName,
                        birthDate: person.birthday ? person.birthday: person.dateOfBirth,
                    }),
                });
            }

            if (response.ok) {
                const text = await response.text();
                console.log(text);
                if (!_.isEmpty(text)) {
                    const data = JSON.parse(text);
                    switch (currentField) {
                        case 'genres':
                            dispatch(MovieOptionsActions.addUniqueGenre(data));
                            dispatch(Actions.addGenre(currentMovieId, data));
                            break;

                        case 'directors':
                            dispatch(MovieOptionsActions.addUniqueDirector(data));
                            dispatch(Actions.addDirector(currentMovieId, data));
                            break;

                        case 'actors':
                            dispatch(MovieOptionsActions.addUniqueActor(data));
                            dispatch(Actions.addActor(currentMovieId, data));
                            break;

                        case 'producers':
                            dispatch(MovieOptionsActions.addUniqueProducer(data));
                            dispatch(Actions.addProducer(currentMovieId, data));
                            break;

                        case 'screenwriters':
                            dispatch(MovieOptionsActions.addUniqueScreenwriter(data));
                            dispatch(Actions.addScreenwriter(currentMovieId, data));
                            break;

                        case 'operators':
                            dispatch(MovieOptionsActions.addUniqueOperator(data));
                            dispatch(Actions.addOperator(currentMovieId, data));
                            break;

                        case 'musicians':
                            dispatch(MovieOptionsActions.addUniqueMusician(data));
                            dispatch(Actions.addMusician(currentMovieId, data));
                            break;

                        default:
                            console.error('Unknown field type:', currentField);
                            break;
                    }

                }
                handleModalClose();
            }
        } catch (error) {
            console.error('Error adding new item:', error);
        }
    };

    const handleRadioChange = (event) => {
        setManualInput(event.target.value === 'manual');
    };

    const handleSelectChange = (event) => {
        const selectedItem = event.target.value;
        if (currentField === 'genres') {
            setNewItemData({ ...newItemData, genre: selectedItem });
        } else {
            setNewItemData({ ...newItemData, person: selectedItem });
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
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Producers</TableCell>
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
                                        {movie.producers.map((producer,index) => (
                                            <span key={index} style={{ display: 'inline-flex', alignItems: 'center', marginRight: 4 }}>
                                                {producer.name}
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleRemoveItem('producers', movie.id, producer.id)}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </span>
                                        ))}
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleAddItem('producers', movie.id)}
                                            startIcon={<AddCircleOutlineIcon />}
                                            sx={{ marginLeft: 1 }}
                                        >
                                            Add
                                        </Button>
                                    </TableCell>
                                    <TableCell align="center">
                                        {movie.screenWriters.map((writer, index) => (
                                            <span key={index} style={{ display: 'inline-flex', alignItems: 'center', marginRight: 4 }}>
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
                                        {movie.operators.map((operator, index) => (
                                            <span key={index} style={{ display: 'inline-flex', alignItems: 'center', marginRight: 4 }}>
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
                                        {movie.musicians.map((musician, index) => (
                                            <span key={index} style={{ display: 'inline-flex', alignItems: 'center', marginRight: 4 }}>
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
                        <Grid item xs={12}>
                            <FormControl component="fieldset">
                                <RadioGroup row value={manualInput ? 'manual' : 'select'} onChange={handleRadioChange}>
                                    <FormControlLabel value="manual" control={<Radio />} label="Add Manually" />
                                    <FormControlLabel value="select" control={<Radio />} label="Select from Options" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                        {manualInput ? (
                            currentField === 'genres' ? (
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
                            ) : (
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
                            )
                        ) : (
                            currentField === 'genres' ? (
                                <Grid item xs={12}>
                                    <Select
                                        fullWidth
                                        value={newItemData.genre || ''}
                                        onChange={handleSelectChange}
                                        displayEmpty
                                        inputProps={{ 'aria-label': 'Genre' }}
                                    >
                                        {options.genres.map((genre) => (
                                            <MenuItem key={genre.id} value={genre}>
                                                {genre.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                            ) : (
                                <Grid item xs={12}>
                                    <Select
                                        fullWidth
                                        value={newItemData.person || ''}
                                        onChange={handleSelectChange}
                                        displayEmpty
                                        inputProps={{ 'aria-label': 'Person' }}
                                    >
                                        {currentField === 'actors' && options.actors.map((actor) => (
                                            <MenuItem key={actor.id} value={actor}>
                                                {actor.name} {actor.surname} {actor.middleName}
                                            </MenuItem>
                                        ))}
                                        {currentField === 'directors' && options.directors.map((director) => (
                                            <MenuItem key={director.id} value={director}>
                                                {director.name} {director.surname} {director.middleName}
                                            </MenuItem>
                                        ))}
                                        {currentField === 'producers' && !_.isUndefined(options.producers) && options.producers.map((producer) => (
                                            <MenuItem key={producer.id} value={producer}>
                                                {producer.name} {producer.surname} {producer.middleName}
                                            </MenuItem>
                                        ))}
                                        {currentField === 'screenwriters' && options.screenwriters.map((screenwriter) => (
                                            <MenuItem key={screenwriter.id} value={screenwriter}>
                                                {screenwriter.name} {screenwriter.surname} {screenwriter.middleName}
                                            </MenuItem>
                                        ))}
                                        {currentField === 'operators' && options.operators.map((operator) => (
                                            <MenuItem key={operator.id} value={operator}>
                                                {operator.name} {operator.surname} {operator.middleName}
                                            </MenuItem>
                                        ))}
                                        {currentField === 'musicians' && options.musicians.map((musician) => (
                                            <MenuItem key={musician.id} value={musician}>
                                                {musician.name} {musician.surname} {musician.middleName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                            )
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
