const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  movieId: Number,
  title: String,
  poster: String,
});

const Watchlist = mongoose.model("Watchlist", watchlistSchema);
module.exports = Watchlist;
