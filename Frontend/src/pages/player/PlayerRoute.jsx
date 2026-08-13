import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PlayerRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user || user.role !== "player") {
    return <Navigate to="/player/login" replace />;
  }

  return children;
};

export default PlayerRoute;