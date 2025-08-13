const express = require("express");
const dotenv = require("dotenv");
const db = require("./db");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("SERVER IS RUNNING");
});
