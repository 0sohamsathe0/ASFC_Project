import { Navigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const AdminAttendanceRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user || user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminAttendanceRoute;
