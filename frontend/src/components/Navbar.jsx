import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <Link to="/" className="text-lg font-bold">
        Mini E-Commerce
      </Link>

      <div className="flex gap-4 items-center">
        {user.role === "customer" && (
          <Link to="/cart" className="hover:text-gray-300">
            Cart
          </Link>
        )}

        {/* {user && user.role === "admin" && (
          <Link to="/admin" className="hover:text-gray-300">
            Admin Dashboard
          </Link>
        )} */}

        {token ? (
          <>
            <span className="text-sm">Hello, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-gray-300">
              Login
            </Link>
            <Link to="/register" className="hover:text-gray-300">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
