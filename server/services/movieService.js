const axios = require("axios");
require("dotenv").config();

const API_KEY = process.env.TMDB_API_KEY;

const getPopularMovies = async () => {
  try{
    const response = await axios.get(
    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
    );
    return response.data;
  } catch(error) {
    console.error("TMDB Error:", error.message);
    throw new Error(error.message);
  }
};

const searchMovies = async (query) => {
  const response = await axios.get(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`
  );
  return response.data;
};

const getMovieDetails = async (id) => {
  const response = await axios.get(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
  );
  return response.data;
};

const getSimilarMovies = async (id) => {
  const response = await axios.get(
    `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}`
  );
  return response.data;
};

module.exports = { getPopularMovies, searchMovies, getMovieDetails, getSimilarMovies };