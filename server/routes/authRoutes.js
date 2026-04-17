const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware")
const {
  register,
  login,
  updateProfile,
  deleteUser,
  getStats,
  getAllUsers,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.put("/profile", authMiddleware, updateProfile);
router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUser);
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.get("/stats", authMiddleware, adminMiddleware, getStats);


module.exports = router;
