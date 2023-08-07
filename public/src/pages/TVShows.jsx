import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { firebaseAuth } from '../utils/firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import styled from 'styled-components';

import { getGenres, fetchMovies } from '../store';
import Navbar from '../components/Navbar';
import Slider from '../components/Slider';
import NotAvailable from '../components/NotAvailable';
import SelectGenre from '../components/SelectGenre';

export default function TVShows() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isScroll, setIsScroll] = useState(false);
  const movies = useSelector((state) => state.netflix.movies);
  const genres = useSelector((state) => state.netflix.genres);
  const genresLoaded = useSelector((state) => state.netflix.genresLoaded);

  useEffect(() => {
    dispatch(getGenres());
  });

  useEffect(() => {
    if (genresLoaded) {
      dispatch(fetchMovies({ type: 'tv' }));
    }
  }, [genresLoaded, dispatch]);

  window.onscroll = () => {
    setIsScroll(window.pageYOffset === 0 ? false : true);
    return () => (window.onscroll = null);
  };

  onAuthStateChanged(firebaseAuth, (currUser) => {
    if (currUser) {
      // navigate('/tv');
    }
  });
  return (
    <Container>
      <div className="navbar">
        <Navbar isScroll={isScroll} />
      </div>
      <SelectGenre
        genres={genres}
        type="tv"
        title="TV Shows"
        isScroll={isScroll}
      />
      <div className="data">
        {movies.length ? <Slider movies={movies} /> : <NotAvailable />}
      </div>
    </Container>
  );
}

const Container = styled.div`
  .data {
    margin-top: 10rem;
    .not-available {
      text-align: center;
      color: #fff;
      margin-top: 4rem;
    }
  }
`;
