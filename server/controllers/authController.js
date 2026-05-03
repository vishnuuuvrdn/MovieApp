const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Favorite = require("../models/Favorite");
const Watched = require("../models/Watched");
const Watchlist = require("../models/Watchlist");
const validator = require("validator");

// Register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    if(!validator.isEmail(email)){
      return res.status(422).json({ message: "Email Format is Wrong!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Register failed" });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      "secretkey",
      { expiresIn: "7d" },
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Login failed" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name },
      { new: true },
    ).select("-password");

    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Update failed" });
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch(err) {
    console.log(err);
    res.status(500).json({ message: "Delete failed" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide password
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

const getStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const favorites = await Favorite.countDocuments();
    const watched = await Watched.countDocuments();
    const watchlist = await Watchlist.countDocuments();

    res.json({
      users,
      favorites,
      watched,
      watchlist
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Stats failed" });
  }
};

module.exports = {
  register,
  login,
  updateProfile,
  deleteUser,
  getStats,
  getAllUsers,
};
