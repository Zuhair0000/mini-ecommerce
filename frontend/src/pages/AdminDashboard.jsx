// src/pages/AdminProducts.jsx
import { useState } from "react";
import Navbar from "../components/Navbar";
import ProductsTab from "../components/ProductsTab";
import OrdersTab from "../components/OrdersTab";
import UsersTab from "../components/UsersTab";

export default function AdminProducts() {
  const [activeTab, setActiveTab] = useState("products");

  const renderTab = () => {
    switch (activeTab) {
      case "products":
        return <ProductsTab />;
      case "orders":
        return <OrdersTab />;
      case "users":
        return <UsersTab />;
    }
  };

  return (
    <>
      <Navbar />
      <div className=" mx-auto my-10 p-6 bg-[#f4f1eb] rounded-lg border border-gray-300 shadow-md font-sans">
        <h2 className="text-xl mb-6 text-center text-gray-800 font-semibold">
          Admin Dashboard
        </h2>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {[
            { key: "products", label: "All Products" },
            { key: "users", label: "All users" },
            { key: "orders", label: "All orders" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`bg-blue-500 text-white rounded hover:bg-blue-600 px-5 py-2 rounded-lg font-bold cursor-pointer transition-colors duration-300  ${
                activeTab === key ? "bg-blue-700" : ""
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="py-4">{renderTab()}</div>
      </div>
    </>
  );
}
