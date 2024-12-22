import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setMovies } from './components/redux/Movies/action';
import { useNavigate } from 'react-router-dom';
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

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const movies = useSelector((state) => state.movieReducer.movies);
  const userCredentials = useSelector((state) => state.credentialReducer.credentials);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovies = async () => {
    console.log('asd');
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
    console.log('qwe');
    try {
      const optionsResponse = await fetch('http://localhost:8082/filmservice/api/films/options', {
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


  const checkAuthCredentials = async () => {
    console.log('zxc');
    //try {
      const response = await fetch('http://localhost:8082/authservice/api/auth/credentials', {
        method: 'GET',
        credentials: 'include',
      });
      console.log(response);
      // if (response.status === 403) {
      //   navigate('/sign-in');
      //   return;
      // }

      // if (response.ok) {
        const text = await response.text();
        console.log(text);
        if (!text) {
          return;
        }

        const credentials = JSON.parse(text);
        dispatch(setCredentials(credentials));
    //   } else {
    //     console.error(`Failed to fetch credentials: ${response.status} ${response.statusText}`);
    //   }
    // } catch (err) {
    //   console.error('Error during auth check:', err.message);
    //   navigate('/sign-in');
    // }
  };



  useEffect(() => {
    const initializeApp = async () => {
      fetch('http://localhost:8082/authservice/api/check-session', {
        method: 'GET',
        credentials: 'include',
      })
        .then(async response => {
          console.log(response);
          if (response.ok) {
            console.log('000000000000000000000000');
            await checkAuthCredentials();
            await fetchMovies();
            await fetchOptions();
          } else if (response.status === 401) {
            console.log('-------------------------');
            navigate('/sign-in');
          }
          setLoading(false);
        })
        .catch(error => console.error('Error:', error));
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
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="/" element={
          <ProtectedRoute roles={['admin', 'user']} element={<MainPage />} />
        } />
        <Route path="/main" element={
          <ProtectedRoute roles={['admin', 'user']} element={<MainPage />} />
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
        <Route path="/movie/:movieId" element={
          <ProtectedRoute roles={['admin', 'user']} element={<MovieView />} />
        } />
        <Route path="/update-movie/:movieId" element={
          <ProtectedRoute roles={['admin']} element={<MovieUpdate />} />
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
