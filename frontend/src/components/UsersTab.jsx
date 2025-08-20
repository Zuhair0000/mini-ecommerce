import React, { useEffect, useState } from "react";

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  const fetchAllUser = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/auth/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchAllUser();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Users Management</h1>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 bg-white shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{user.id}</td>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : user.role === "seller"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
