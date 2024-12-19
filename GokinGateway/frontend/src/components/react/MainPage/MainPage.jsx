import React, { useState } from 'react';
import '../../../static/MainPage/MainPage.css';
import LeftFilters from './leftFilters/LeftFilters';
import MainPageContent from './MainPageContent/MainPageContent';
// import Header from '   ../../components/react/Header/Header';
import Header from '../Header/Header';

const MainPage = () => {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [duration, setDuration] = useState([0, 300]);
  const [rating, setRating] = useState([0, 10]);

  return (
    <React.Fragment>
      <div className='movie-content-wrapper'>
        <div className="main-page-wrapper">
          <LeftFilters
            search={search}
            setSearch={setSearch}
            genre={genre}
            setGenre={setGenre}
            duration={duration}
            setDuration={setDuration}
            rating={rating}
            setRating={setRating}
          />
          <MainPageContent
            search={search}
            genre={genre}
            duration={duration}
            rating={rating}
          />
        </div>
      </div>
    </React.Fragment>

  );
};

export default MainPage;
