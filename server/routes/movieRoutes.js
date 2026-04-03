const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  fetchMovies,
  searchMovie,
  fetchMovieDetails,
  addFavorite,
  getFavorites,
  removeFavorite,
  similarMovies,
  addToWatchlist,
  getWatchlist,
  removeWatchlist,
  markAsWatched,
  checkAlreadyWatched,
} = require("../controllers/movieController");


router.get("/", fetchMovies);
router.get("/search", searchMovie);

router.post("/favorite", authMiddleware, addFavorite);
router.get("/favorites", authMiddleware, getFavorites);
router.delete("/favorite/:id", authMiddleware, removeFavorite);
router.get("/:id/similar", similarMovies);

router.post("/watchlist", authMiddleware, addToWatchlist);
router.get("/watchlist", authMiddleware, getWatchlist);
router.delete("/watchlist/:id", authMiddleware, removeWatchlist);

router.post("/watched/:id", authMiddleware, markAsWatched);
router.get("/watched/:id", authMiddleware, checkAlreadyWatched);

router.get("/:id", fetchMovieDetails);

module.exports = router;