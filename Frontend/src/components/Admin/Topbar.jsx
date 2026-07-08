import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
const Topbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
        await logout();
        alert("Admin logged out successfully");
        navigate("/admin/login");
    } catch (error) {
        alert("Logout failed");
        console.error(error);
    }

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
