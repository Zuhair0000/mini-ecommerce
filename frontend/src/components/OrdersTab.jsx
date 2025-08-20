import React, { useEffect, useState } from "react";

export default function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/order", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (e, order_id) => {
    const newStatus = e.target.value;

    const res = await fetch(`http://localhost:3001/api/order/${order_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newStatus }),
    });

    if (res.ok) {
      const updated = await fetch(`http://localhost:3001/api/order`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await updated.json();
      setOrders(data);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Orders Management</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 bg-white shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Order ID</th>
              <th className="px-4 py-2 border">Product Name</th>
              <th className="px-4 py-2 border">Customer</th>
              <th className="px-4 py-2 border">Total price</th>
              <th className="px-4 py-2 border">Quantity</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{order.order_id}</td>
                <td className="border px-4 py-2">{order.product_name}</td>
                <td className="border px-4 py-2">{order.customer_name}</td>
                <td className="border px-4 py-2">${order.total_price}</td>
                <td className="border px-4 py-2">{order.quantity}</td>
                <td className="border px-4 py-2">{order.status}</td>
                <td className="border px-4 py-2">
                  {new Date(order.created_at).toLocaleString()}
                </td>
                <td className="border px-4 py-2">
                  <select
                    className="border rounded px-2 py-1"
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(e, order.order_id)}
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
