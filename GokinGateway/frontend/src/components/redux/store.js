import { configureStore } from '@reduxjs/toolkit';
import inputReducer from './Input/InputReducer';
import movieReducer from './Movies/MovieReducer';
import credentialReducer from './Auth/Reducer';
import movieOptionsReducer from './MovieOptions/Reducer';

const store = configureStore({
    reducer: {
        movieReducer,
        movieOptionsReducer,
        inputReducer,
        credentialReducer,
    },
});

export default store;
