import api from "./api";

export const getFavorites = () => api.get("/api/movies/favorites");
export const addFavorite = (movieId) =>
  api.post("/api/movies/favorite", { movieId });
export const removeFavorite = (movieId) =>
  api.delete(`/api/movies/favorite/${movieId}`);

export const getWatchlist = () => api.get("/api/movies/watchlist");
export const addToWatchlist = (movieId) =>
  api.post("/api/movies/watchlist", { movieId });
export const removeFromWatchlist = (movieId) =>
  api.delete(`/api/movies/watchlist/${movieId}`);

export const getProfile = () => api.get("/api/auth/profile");
export const updateProfile = (data) => api.put("/api/auth/profile", data);
