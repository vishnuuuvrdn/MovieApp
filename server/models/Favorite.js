const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  movieId: Number,
  title: String,
  poster: String,
});

module.exports = mongoose.model("Favorite", favoriteSchema);
