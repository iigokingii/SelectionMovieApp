import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setMovies } from './components/redux/Movies/action';
import { useLocation, useNavigate } from 'react-router-dom';
import _ from 'lodash';
import Header from './components/react/Header/Header';
import NewFilm from './components/react/NewFilm/NewFilm';
import SignIn from './components/react/Authorization/SignIn';
import SignUp from './components/react/Authorization/SignUp';
import MainPage from './components/react/MainPage/MainPage';
import AiChat from './components/react/Ai/AiChat';
import MovieView from './components/react/Movie/MovieView';
import MovieList from './components/react/MoviesList/MovieList';
import MovieUpdate from './components/react/MovieUpdate/MovieUpdate';
import ProtectedRoute from './components/react/Authorization/ProtectedRoute/ProtectedRoute';
import { setCredentials } from './components/redux/Auth/Action';
import Forbidden from './components/react/Forbidden/Forbidden';
import Logout from './components/react/Logout/Logout';
import { setMovieOptions } from './components/redux/MovieOptions/Action';
import Unauthorized from './components/react/Unauthorized/Unauthorized';
import UserDetails from './components/react/UserDetails/UserDetails';
import Chat from './components/react/Chat/Chat';

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const movies = useSelector((state) => state.movieReducer.movies);
  const userCredentials = useSelector((state) => state.credentialReducer.credentials);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      dispatch(setMovies(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      const optionsResponse = await fetch(`http://localhost:8082/filmservice/api/films/options/${credentials.id}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!optionsResponse.ok) {
        throw new Error('Failed to fetch movies');
      }
      const options = await optionsResponse.json();
      dispatch(setMovieOptions(options));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  var credentials;

  const checkAuthCredentials = async () => {
      const response = await fetch('http://localhost:8082/authservice/api/auth/credentials', {
        method: 'GET',
        credentials: 'include',
      });
        const text = await response.text();
        if (!text) {
          return;
        }

        credentials = JSON.parse(text);
        dispatch(setCredentials(credentials));
  };



  useEffect(() => {
    const initializeApp = async () => {
      fetch('http://localhost:8082/authservice/api/auth/check-session', {
        method: 'GET',
        credentials: 'include',
      })
        .then(async response => {
          if (response.ok) {
            await checkAuthCredentials();
            await fetchMovies();
            await fetchOptions();
          } else if (response.status === 401 && location.pathname === '/') {
            navigate('/sign-up');
          } else if (response.status === 401 && location.pathname !== '/sign-in' && location.pathname !== '/sign-up') {
            navigate('/unauthorized');
          } 
          setLoading(false);
        })
        .catch(error => console.error('Error:', error.json()));
    };

    initializeApp();
  },[]);

  if (loading) {
    return <div>Loading application...</div>;
  }

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="/unauthorized" element={<Unauthorized/>} />
        <Route path="/main" element={
          <ProtectedRoute roles={['admin', 'user']} element={<MainPage />} />
        } />
        <Route path="/liked" element={
          <ProtectedRoute roles={['user']} element={<MainPage />} />
        } />
        <Route path="/movie-list" element={
          <ProtectedRoute roles={['admin']} element={<MovieList />} />
        } />
        <Route path="/add-movie" element={
          <ProtectedRoute roles={['admin']} element={<NewFilm />} />
        } />
        <Route path="/ai-chat" element={
          <ProtectedRoute roles={['admin', 'user']} element={<AiChat />} />
        } />
        <Route path="/chat" element={
          <ProtectedRoute roles={['admin', 'user']} element={<Chat/>} />
        } />
        <Route path="/movie/:movieId" element={
          <ProtectedRoute roles={['admin', 'user']} element={<MovieView />} />
        } />
        <Route path="/update-movie/:movieId" element={
          <ProtectedRoute roles={['admin']} element={<MovieUpdate />} />
        } />
        <Route path="/settings" element={
          <ProtectedRoute roles={['admin', 'user']} element={<UserDetails />} />
        } />
        <Route path="/logout" element={
          <ProtectedRoute roles={['admin', 'user']} element={<Logout />} />
        } />
        <Route path="*" element={<Forbidden />} />
      </Routes>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
