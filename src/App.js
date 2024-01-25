import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MovieList from './components/movieList/MovieList';
import MovieDetail from './components/MovieDetail/MovieDetail';
const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
        </Routes>
      </Router>
  );
};

export default App;
