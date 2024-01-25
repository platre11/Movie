// MovieList.js
import React, { useState, useEffect } from 'react';
import { getMovies } from '../../services/SwapiService';
import { Link } from 'react-router-dom';
import { ComposantMoveListe } from './StyledMovieList';
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [favorites, setFavorites] = useState(new Set(JSON.parse(localStorage.getItem('favorites')) || []));
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  const toggleFavorite = (movieId) => {
    setFavorites((prevFavorites) => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(movieId)) {
        newFavorites.delete(movieId);
      } else {
        newFavorites.add(movieId);
      }
      localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
      return newFavorites;
    });
  };

  useEffect(() => {
    const loadMovies = async () => {
      setIsLoading(true);

      // Charger d'abord les films depuis localStorage si disponibles
      let localMovies = localStorage.getItem('movies');
      const alreadyFetched = localStorage.getItem('hasFetched');

      if (localMovies && alreadyFetched) {
        localMovies = JSON.parse(localMovies);
        setMovies(localMovies);
        setFilteredMovies(localMovies);
        setIsLoading(false);
        return;
      }

      // Vérification en arrière-plan si une mise à jour est nécessaire
      try {
        const moviesData = await getMovies();
        setMovies(moviesData);
        setFilteredMovies(moviesData);
        localStorage.setItem('movies', JSON.stringify(moviesData));
        localStorage.setItem('hasFetched', 'true');
      } catch (error) {
        console.error("Could not fetch movies:", error);
      }

      setIsLoading(false);
    };

    if (!hasFetched) {
      loadMovies();
      setHasFetched(true);
    }
  }, [hasFetched]);

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    if (searchTerm) {
      const filtered = movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMovies(filtered);
    } else {
      setFilteredMovies(movies);
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <ComposantMoveListe>
      <input
        type="text"
        placeholder="Recherchez un film..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ width: '20vw', margin: '20px', padding: '5px' }}
      />
      {filteredMovies.map((movie) => (
        <div key={movie.episode_id} className="movie-item">
          <Link to={`/movies/${movie.episode_id}`} className="movie-link">{movie.title}</Link>
          <button onClick={() => toggleFavorite(movie.episode_id)} className="favorite-button">
            {favorites.has(movie.episode_id) ? <FaBookmark className="favorite-icon" /> : <FaRegBookmark className="favorite-icon" />}
          </button>
        </div>
      ))}
    </ComposantMoveListe>
  );
};

export default MovieList;
