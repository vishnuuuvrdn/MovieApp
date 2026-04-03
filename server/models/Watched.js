const mongoose = require("mongoose");

const watchedSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  movieId: Number,
  title: String,
  poster: String,
  watchedAt: {
    type: Date,
    default: Date.now,
  },
});

const Watched = mongoose.model("Watched", watchedSchema);
module.exports = Watched
