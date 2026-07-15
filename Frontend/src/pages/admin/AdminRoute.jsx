import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminDesktopOnly from "../../components/common/AdminDesktopOnly";
import useIsDesktop from "../../hooks/useIsDesktop";

const AdminRoute = ({ children }) => {
const { user, loading } = useAuth();
const isDesktop = useIsDesktop();

if (loading) {
return null;
}

if (!user || user.role !== "admin") {
return <Navigate to="/admin/login" replace />;
}

if (!isDesktop) {
return <AdminDesktopOnly />;
}

return children;
};

export default AdminRoute;
