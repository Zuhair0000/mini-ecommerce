const db = require("../db");

exports.getProducts = async (req, res) => {
  try {
    const [products] = await db.query("SELECT * FROM products");
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const [product] = await db.query("SELECT * FROM products WHERE id = ?", [
      id,
    ]);
    res.json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.createProduct = async (req, res) => {
  const { name, description, price, image_url } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: "Name and price are required" });
  }

  try {
    const result = await db.query(
      "INSERT INTO products(name, description, price, image_url) VALUES (?, ?, ?, ?)",
      [name, description, price, image_url]
    );

    res
      .status(201)
      .json({ message: "Product created", productId: result.insertId });
  } catch (err) {
    console.error("Error creating product:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image_url } = req.body;
  const role = req.user.role;

  try {
    const [result] = await db.query("SELECT * FROM products WHERE id = ?", [
      id,
    ]);
    if (result.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    await db.query(
      "UPDATE products SET name =?, description = ?, price = ?, image_url = ? WHERE id = ?",
      [name, description, price, image_url, id]
    );
    res.json({ message: "Product updated" });
  } catch (err) {
    console.error("Error updating product:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("SELECT * FROM products WHERE id = ?", [
      id,
    ]);
    if (result.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    await db.query("DELETE FROM products WHERE id = ?", [id]);
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("Error deleting product:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
