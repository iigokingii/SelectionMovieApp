import { configureStore } from '@reduxjs/toolkit';
import inputReducer from './Input/InputReducer';
import movieReducer from './Movies/MovieReducer';
import credentialReducer from './Auth/Reducer';

const store = configureStore({
    reducer: {
        inputReducer,
        movieReducer,
        credentialReducer,
    },
});

export default store;
