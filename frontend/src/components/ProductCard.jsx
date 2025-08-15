import React from "react";
import { useState } from "react";

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to add to cart");
      } else {
        alert("Product added to cart");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("Something went wrong");
    }
  };
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition duration-200 flex flex-col items-center">
      <img
        src={product.image_url}
        alt={product.name}
        className="w-full h-40 object-cover rounded"
      />
      <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
      <p className="text-gray-600 text-sm text-center mt-1">
        {product.description}
      </p>
      <strong className="mt-2 text-blue-600">${product.price}</strong>
      <button
        onClick={handleAddToCart}
        className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
