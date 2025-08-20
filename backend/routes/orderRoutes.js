const express = require("express");
const {
  placeOrder,
  getOrderDetails,
  updateOrderStatus,
} = require("../controllers/OrderController");
const { verifyToken } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", verifyToken, placeOrder);
router.get("/", verifyToken, getOrderDetails);
router.put("/:id", verifyToken, updateOrderStatus);

module.exports = router;
