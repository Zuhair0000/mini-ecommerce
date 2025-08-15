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

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { newStatus } = req.body;

  try {
    const [existOrder] = await db.query("SELECT * FROM orders WHERE id = ?", [
      id,
    ]);

    if (existOrder.length === 0) {
      res.status(400).json({ message: "OrderDoes not exist" });
      return;
    }

    await db.query("UPDATE orders SET status = ? WHERE id = ?", [
      newStatus,
      id,
    ]);

    res.json({ message: "Status updated successfully" });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
      o.id AS order_id, 
      u.name AS customer_name, 
      o.total_price , 
      o.status, 
      o.created_at, 
      oi.product_id, 
      p.name AS product_name, 
      oi.quantity, 
      oi.price
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      ORDER BY o.created_at DESC
      `);

    if (rows.length === 0) {
      res.status(400).json({ message: "No orders found" });
    }

    const orders = rows.reduce((acc, row) => {
      let existingOrder = acc.find((order) => order.order_id === row.order_id);
      if (!existingOrder) {
        existingOrder = {
          order_id: row.order_id,
          customer_name: row.customer_name,
          total_price: row.total_price,
          status: row.status,
          created_at: row.created_at,
          items: [],
        };
        acc.push(existingOrder);
      }
      existingOrder.items.push({
        product_id: row.product_id,
        product_name: row.product_name,
        quantity: row.quantity,
        price: row.price,
      });
      return acc;
    }, []);

    res.json(orders);
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ message: "Server error" });
  }
};
