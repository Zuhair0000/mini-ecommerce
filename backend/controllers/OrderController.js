const db = require("../db");

exports.placeOrder = async (req, res) => {
  const id = req.user.id;
  try {
    const [cartItems] = await db.query(
      `
      SELECT c.product_id, c.quantity, p.price
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
      `,
      [id]
    );

    if (cartItems.length === 0) {
      res.status(400).json({ message: "Cart is empty" });
    }

    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.quantity * Number(item.price),
      0
    );

    const [orderResult] = await db.query(
      "INSERT INTO orders(user_id, total_price, status) VALUES (?, ?, ?)",
      [id, totalPrice, "pending"]
    );

    const orderId = orderResult.insertId;

    for (const item of cartItems) {
      await db.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    await db.query("DELETE FROM cart WHERE user_id = ? ", [id]);

    res.status(201).json({ message: "Order placed successfully", orderId });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ message: "Server error" });
  }
};
