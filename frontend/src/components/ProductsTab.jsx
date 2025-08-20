import React, { useEffect, useState } from "react";

export default function ProductsTab() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const token = localStorage.getItem("token");

  const initialForm = { name: "", description: "", price: "", image_url: "" };
  const [formData, setFormData] = useState(initialForm);

  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setProducts([...products, data]);
        handleCloseModal();
      } else {
        alert(data.message || "Failed to add product");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditProduct = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setProducts(
          products.map((p) => (p.id === id ? { ...p, ...formData } : p))
        );
        handleCloseModal();
      } else {
        alert(data.message || "Failed to update product");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert(data.message || "Failed to delete product");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenModal = (edit = false, product = null) => {
    setIsEditMode(edit);
    setIsModalOpen(true);

    if (edit && product) {
      setCurrentProductId(product.id);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        image_url: product.image_url || "",
      });
    } else {
      setCurrentProductId(null);
      setFormData(initialForm);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setFormData(initialForm);
  };
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Products Management</h1>

      <button
        onClick={() => handleOpenModal(false)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        + Add Product
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 bg-white shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{product.id}</td>
                <td className="border px-4 py-2">{product.name}</td>
                <td className="border px-4 py-2">${product.price}</td>
                <td className="border px-4 py-2">{product.description}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleOpenModal(true, product)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">
              {isEditMode ? "Edit Product" : "Add Product"}
            </h2>
            <form className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                className="w-full border rounded px-3 py-2"
                value={formData.name}
                onChange={handleChange}
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                className="w-full border rounded px-3 py-2"
                value={formData.price}
                onChange={handleChange}
              />

              <textarea
                name="description"
                placeholder="Description"
                className="w-full border rounded px-3 py-2"
                value={formData.description}
                onChange={handleChange}
              ></textarea>

              <input
                type="text"
                name="image_url"
                placeholder="Image URL"
                className="w-full border rounded px-3 py-2"
                value={formData.image_url}
                onChange={handleChange}
              />

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() =>
                    isEditMode
                      ? handleEditProduct(currentProductId)
                      : handleAddProduct()
                  }
                >
                  {isEditMode ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
