import React from "react";
import { useNavigate ,Outlet } from "react-router-dom";
import Sidebar from "../../components/Admin/Sidebar.jsx";
import Topbar from "../../components/Admin/Topbar.jsx";
import getAdminToken from "../../utils/getAdminToken.js";

const AdminDashboard = ({ children }) => {
  const navigate = useNavigate();
  const checkAdminAuth = () => {
    const isAdmin = getAdminToken() 
    if (!isAdmin) {
      alert("Please login as admin to access the dashboard");
      navigate("/admin/login");
      return null;
    }
  };
  React.useEffect(() => {
    checkAdminAuth();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Right Section */}
      <div className="flex flex-col flex-1">
        {/* Topbar */}
        <Topbar />

        {/* Main Content */}
        <div className="p-6 overflow-y-auto"><Outlet /></div>
      </div>
    </div>
  );
};

export default AdminDashboard;
