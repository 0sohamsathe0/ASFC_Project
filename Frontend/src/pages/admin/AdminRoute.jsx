import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {

    const isAdmin = document.cookie.split(";").some(cookie => cookie.trim().startsWith("adminToken="));
    if(!isAdmin) {
        return <Navigate to="/admin/login" replace />;
    }
    return children;
};

export default AdminRoute;