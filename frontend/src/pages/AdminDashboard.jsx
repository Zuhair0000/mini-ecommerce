import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/admin/", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await fetch(`http://localhost:3001/api/admin/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newStatus }),
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.order_id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) {
    return <p className="text-center py-10">Loading orders...</p>;
  }

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">📦 All Orders</h1>

        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-5 py-3">Order ID</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <React.Fragment key={order.order_id}>
                    <tr className="hover:bg-gray-50 border-b border-gray-200">
                      <td className="px-5 py-3 font-medium text-gray-800">
                        #{order.order_id}
                      </td>
                      <td className="px-5 py-3">{order.customer_name}</td>
                      <td className="px-5 py-3">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3 font-semibold text-green-600">
                        ${order.total_price}
                      </td>
                      <td className="px-5 py-3">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.order_id, e.target.value)
                          }
                          className="border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                          <option value="pending">Pending</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <button
                          onClick={() =>
                            setExpandedOrderId(
                              expandedOrderId === order.order_id
                                ? null
                                : order.order_id
                            )
                          }
                          className="text-blue-500 hover:underline font-medium"
                        >
                          {expandedOrderId === order.order_id
                            ? "Hide"
                            : "View Items"}
                        </button>
                      </td>
                    </tr>

                    {expandedOrderId === order.order_id && order.items && (
                      <tr className="bg-gray-50">
                        <td colSpan="6" className="px-6 py-4">
                          <h3 className="font-semibold mb-2">🛒 Order Items</h3>
                          <div className="space-y-1">
                            {order.items.map((item, index) => (
                              <div
                                key={`${order.order_id}-${index}`}
                                className="flex justify-between text-sm border-b pb-1"
                              >
                                <span>{item.product_name}</span>
                                <span>
                                  {item.quantity} × ${item.price}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
