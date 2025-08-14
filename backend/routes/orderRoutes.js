const express = require("express");
const { placeOrder } = require("../controllers/OrderController");
const { verifyToken } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", verifyToken, placeOrder);

module.exports = router;
