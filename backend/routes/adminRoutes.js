const express = require("express");
const {
  getOrderDetails,
  updateOrderStatus,
} = require("../controllers/OrderController");
const router = express.Router();

router.get("/", getOrderDetails);
router.put("/:id/status", updateOrderStatus);

module.exports = router;
