import api from "./api";

export const getMovies = () => api.get("/api/movies");
export const searchMovies = (q) => api.get(`/api/movies/search?q=${q}`);
export const getMovieById = (id) => api.get(`/api/movies/${id}`);
export const getSimilarMovies = (id) => api.get(`/api/movies/${id}/similar`);
