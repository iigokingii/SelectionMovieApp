import React, { useState } from 'react';
import '../../../static/MainPage/MainPage.css';
import LeftFilters from './leftFilters/LeftFilters';
import MainPageContent from './MainPageContent/MainPageContent';

const MainPage = () => {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [duration, setDuration] = useState([0, 300]);
  const [rating, setRating] = useState([0, 10]);
  const [actors, setActors] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [musicians, setMusicians] = useState([]);
  const [producers, setProducers] = useState([]);
  const [screenwriters, setScreenwriters] = useState([]);
  const [countryProduced, setCountryProduced] = useState('');

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
            actors={actors}
            setActors={setActors}
            directors={directors}
            setDirectors={setDirectors}
            musicians={musicians}
            setMusicians={setMusicians}
            producers={producers}
            setProducers={setProducers}
            screenwriters={screenwriters}
            setScreenwriters={setScreenwriters}
            countryProduced={countryProduced}
            setCountryProduced={setCountryProduced}
          />
          <MainPageContent
            search={search}
            genre={genre}
            duration={duration}
            rating={rating}
            actors={actors}
            directors={directors}
            musicians={musicians}
            producers={producers}
            screenwriters={screenwriters}
            countryProduced={countryProduced}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default MainPage;
