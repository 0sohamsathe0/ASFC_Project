import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import AdminMobileDrawer from "../../components/Admin/AdminMobileDrawer.jsx";
import Sidebar from "../../components/Admin/Sidebar.jsx";
import Topbar from "../../components/Admin/Topbar.jsx";
import { getAdminPageTitle } from "../../components/Admin/adminNavigationConfig.js";
import { useAuth } from "../../context/AuthContext.jsx";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = (event) => {
      if (event.matches) closeDrawer();
    };

    desktopQuery.addEventListener("change", closeOnDesktop);
    return () => desktopQuery.removeEventListener("change", closeOnDesktop);
  }, [closeDrawer]);

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);
      await logout();
      navigate("/admin/login", { replace: true });
    } catch (error) {
      console.error("Admin logout failed:", error);
      setLoggingOut(false);
    }
  };

  return (
    <div className="flex min-h-dvh w-full min-w-0 bg-gray-100">
      <Sidebar />
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        <Topbar
          pageTitle={getAdminPageTitle(pathname)}
          drawerOpen={drawerOpen}
          onMenuOpen={() => setDrawerOpen(true)}
          onLogout={handleLogout}
          loggingOut={loggingOut}
        />
        <main className="min-w-0 flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <AdminMobileDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        onLogout={handleLogout}
        loggingOut={loggingOut}
      />
    </div>
  );
};

export default AdminDashboard;
