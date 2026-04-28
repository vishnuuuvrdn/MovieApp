const { 
  getPopularMovies, 
  searchMovies, 
  getMovieDetails, 
  getSimilarMovies } = require("../services/movieService");
const Favorite = require("../models/Favorite");
const Watchlist = require("../models/Watchlist");
const Watched = require("../models/Watched");


const fetchMovies = async (req, res) => {
  try {
    const data = await getPopularMovies();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
};

const searchMovie = async (req, res) => {
  try {
    const query = req.query.q;
    const data = await searchMovies(query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
};

const fetchMovieDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await getMovieDetails(id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movie details" });
  }
};

const addFavorite = async (req, res) => {
  try {
    const { movieId, title, poster } = req.body;

    const exists = await Favorite.findOne({ movieId, userId : req.user.id });

    if (exists) {
      return res.status(409).json({ message: "Already in favorites" });
    }

    const fav = new Favorite({ userId : req.user.id, movieId, title, poster });
    await fav.save();
    console.log(`${title} added to favorites`);
    res.json({ message: "Added to favorites" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to add favorite" });
  }
};

const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const favs = await Favorite.find({ userId });

    if (!favs || favs.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(favs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Favorite.findOne({ userId : req.user.id, movieId: id });

    await Favorite.findOneAndDelete(movie);
    console.log(`${movie.title} Removed from Favorites`);

    res.json({ message: "Removed from favorites" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to remove favorite" });
  }
};

const similarMovies = async(req, res) => {
  try{
    const id = req.params.id;
    const data = await getSimilarMovies(id);
    res.json(data);
  }catch(err){
    console.log(err);
    res.status(500).json({error: err.message})
  }
};

const addToWatchlist = async (req, res) => {
  try{
    const { movieId, title, poster } = req.body;

    const exists = await Watchlist.findOne({ userId : req.user.id, movieId });

    if(exists){
      return res.json({ message : "Already in Watchlist" });
    }

    const item = new Watchlist({ userId: req.user.id, movieId, title, poster });
    await item.save();
    console.log(`${title} added to WatchList`)
    
    res.json({ message : "Added to Watchlist" });
  }catch(error){
    console.log(error);
    res.status(500).json({ error : "Failed to add Watchlist" });
  }
};

const getWatchlist = async (req, res) => {
  try{
    const watchlist = await Watchlist.find({ userId: req.user.id });
    res.json(watchlist);
  } catch(error) {
    console.log(error);
    res.status(500).json({ error : "Failed fetch Watchlist" });
  }
};

const removeWatchlist = async (req, res) => {
  try{
    const { id } = req.params;

    const movie = await Watchlist.findOne({ userId: req.user.id, movieId: id });

    await Watchlist.findOneAndDelete(movie);
    console.log(`${movie.title} removed from WatchList`);

    res.json({ message : "Removed from Watchlist" });
  } catch(error) {
    console.log(error);
    res.status(500).json({ message : "Failed to remove from Watchlist" });
  }
};

const markAsWatched = async (req, res) => {
  try {
    const { id } = req.params;

    const alreadyWatched = await Watched.findOne({
      userId: req.user.id,
      movieId: id,
    });

    if (alreadyWatched) {
      return res.json({ message: "Already marked as watched" });
    }

    const item = await Watchlist.findOne({ userId: req.user.id, movieId: id });

    let movieData;

    if (item) {
      await Watchlist.findOneAndDelete({ userId: req.user.id, movieId: id });

      movieData = {
        userId: req.user.id,
        movieId: item.movieId,
        title: item.title,
        poster: item.poster,
      };
    } else {
      const { title, poster } = req.body;

      movieData = {
        userId: req.user.id,
        movieId: id,
        title,
        poster,
      };
    }

    const watchedMovie = new Watched(movieData);
    await watchedMovie.save();
    console.log(`${movieData.title} Watched`);

    res.json({ message: "Added to Watched" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update watched" });
  }
};

const checkAlreadyWatched = async (req, res) => {
  try {
    const { id } = req.params;

    const watchedEntry = await Watched.findOne({
      userId: req.user.id,
      movieId: id,
    });

    if (watchedEntry) {
      return res
        .status(200)
        .json({ watched: true, message: "Already Watched" });
    }

    return res.status(200).json({ watched: false, message: "Not Watched Yet" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch watched status" });
  }
};

module.exports = {
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
};
