import { configureStore } from '@reduxjs/toolkit';
import inputReducer from './Input/InputReducer';
import movieReducer from './Movies/MovieReducer';
import credentialReducer from './Auth/Reducer';
import movieOptionsReducer from './MovieOptions/Reducer';
import subscriptionReducer from './Subscription/reducer';

const store = configureStore({
    reducer: {
        movieReducer,
        movieOptionsReducer,
        inputReducer,
        credentialReducer,
        subscriptionReducer,
    },
});

export default store;
