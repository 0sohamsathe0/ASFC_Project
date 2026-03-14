import { Navigate } from "react-router-dom";

const AdminRoute = () => {

    const isAdmin = document.cookie.split(" ")
    
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;