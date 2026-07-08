import React from "react";
import { useNavigate ,Outlet } from "react-router-dom";
import Sidebar from "../../components/Admin/Sidebar.jsx";
import Topbar from "../../components/Admin/Topbar.jsx";

const AdminDashboard = ({ children }) => {
  const navigate = useNavigate();
  React.useEffect(() => {
    verifyAdmin();
  }, []);

const verifyAdmin = async () => {
    try {
        await axios.get(
            "http://localhost:5050/admin/verify",
            {
                withCredentials: true,
            }
        );
      }
      catch(err){
         if (
            err.response?.status === 401 ||
            err.response?.status === 403
        ) {
            navigate("/admin/login");
        }
      }
    }
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
