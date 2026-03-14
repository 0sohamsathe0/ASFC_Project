import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Admin/Sidebar.jsx";
import Topbar from "../../components/Admin/Topbar.jsx";

const AdminDashboard = ({ children }) => {
  const navigate = useNavigate();
  const checkAdminAuth = () => {
    const adminToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("adminToken="))
      ?.split("=")[1];
    console.log(adminToken);
    if (!adminToken) {
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
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
