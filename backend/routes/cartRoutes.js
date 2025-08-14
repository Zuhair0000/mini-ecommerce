const express = require("express");
const {
  addToCart,
  getCart,
  removeFromCart,
} = require("../controllers/cartController");
const { verifyToken } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", verifyToken, addToCart);
router.get("/", verifyToken, getCart);
router.delete("/:id", verifyToken, removeFromCart);

module.exports = router;
