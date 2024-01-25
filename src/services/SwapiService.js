const BASE_URL = 'https://swapi.dev/api';

export const getMovies = async () => {
  try {
    const response = await fetch(`${BASE_URL}/films/`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Could not fetch movies:", error);
    return [];
  }
};

export const getMovieById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/films/${id}/`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error(`Could not fetch movie with id ${id}:`, error);
    return null;
  }
};
