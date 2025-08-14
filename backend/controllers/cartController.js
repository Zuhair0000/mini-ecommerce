const db = require("../db");

exports.addToCart = async (req, res) => {
  const id = req.user.id;
  const { product_id, quantity } = req.body;

  if (!product_id || !quantity || quantity < 1) {
    return res.status(400).json({ message: "Invalid product or quantity" });
  }

  try {
    const [products] = await db.query("SELECT * FROM products WHERE id = ?", [
      product_id,
    ]);

    if (products.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const [existInCart] = await db.query(
      "SELECT * FROM cart WHERE product_id = ? AND user_id = ?",
      [product_id, id]
    );

    if (existInCart.length > 1) {
      await db.query(
        "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?",
        [quantity, id, product_id]
      );
    } else {
      await db.query(
        "INSERT INTO cart(user_id, product_id, quantity) VALUES (?, ?, ?)",
        [id, product_id, quantity]
      );
    }

    res.json({ message: "Product added to the cart" });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCart = async (req, res) => {
  const id = req.user.id;

  try {
    const [cartItems] = await db.query(
      `
    SELECT c.id, p.name, c.quantity, p.price 
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?`,
      [id]
    );

    res.json(cartItems);
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.removeFromCart = async (req, res) => {
  const id = req.user.id;
  const { product_id } = req.body;

  try {
    await db.query("DELETE FROM cart WHERE product_id = ? AND user_id = ?", [
      product_id,
      id,
    ]);

    res.json({ message: "Product removed successfully" });
  } catch (err) {
    console.error("Remove cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
