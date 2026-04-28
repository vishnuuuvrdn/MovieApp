const express = require("express");
const cors = require("cors");
require("dotenv").config();
const movieRoutes = require("./routes/movieRoutes");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extendend : true }))

app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/api/movies", movieRoutes);
app.use("/api/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

<<<<<<< HEAD
app.listen(5000, () => console.log("Server running on port 5000"));
=======
app.listen(5000, () => console.log("Server running on port 5000") );
>>>>>>> 4a7581b (Migrate to Tailwind CSS, add reusable components and hooks, and restructure client architecture)
