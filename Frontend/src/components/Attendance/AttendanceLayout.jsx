import { ClipboardCheck, LayoutDashboard, ListChecks, LogOut } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const AttendanceLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const linkClass = ({ isActive }) =>
    `flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition sm:px-4 ${
      isActive
        ? "bg-red-600 text-white shadow-lg shadow-red-950/30"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin/login", { replace: true });
    } catch (error) {
      console.error("Admin logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white">
              <ClipboardCheck size={21} />
            </div>
            <div className="hidden min-w-0 sm:block">
              <p className="truncate font-bold text-white">ASFC Attendance</p>
              <p className="text-xs text-slate-400">Admin workspace</p>
            </div>
          </div>

          <nav className="flex flex-1 items-center justify-center gap-1 sm:gap-2">
            <NavLink to="/admin/attendance/mark" className={linkClass}>
              <ClipboardCheck size={17} />
              <span>Mark</span>
            </NavLink>
            <NavLink to="/admin/attendance/records" className={linkClass}>
              <ListChecks size={17} />
              <span>Records</span>
            </NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              title="Admin dashboard"
              className="hidden rounded-xl p-2.5 text-slate-300 transition hover:bg-slate-800 hover:text-white md:block"
            >
              <LayoutDashboard size={19} />
            </button>
            <button
              type="button"
              onClick={handleLogout}
              title="Log out"
              className="rounded-xl p-2.5 text-slate-300 transition hover:bg-slate-800 hover:text-red-400"
            >
              <LogOut size={19} />
            </button>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AttendanceLayout;
