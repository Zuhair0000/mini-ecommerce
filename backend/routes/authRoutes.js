const express = require("express");
const {
  register,
  login,
  getAllUsers,
} = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", verifyToken, getAllUsers);

module.exports = router;
