import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
const Topbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear the admin token cookie
    document.cookie =
      "adminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    alert("Admin logged out successfully");
    navigate("/admin/login");
  };
  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>

      <button
        className="bg-red-500 text-white px-4 py-2 rounded"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default Topbar;
