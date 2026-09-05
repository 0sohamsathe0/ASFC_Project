import { CalendarRange, ClipboardCheck, ListChecks } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const AttendanceLayout = () => {
  const linkClass = ({ isActive }) =>
    `flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition sm:px-4 ${
      isActive
        ? "bg-red-600 text-white shadow-lg shadow-red-950/30"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <div className="min-w-0 bg-slate-950 text-white">
      <div className="border-b border-slate-800 bg-slate-950/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-x-auto overscroll-x-contain">
          <nav aria-label="Attendance sections" className="flex min-w-max items-center gap-1 sm:gap-2">
            <NavLink to="/admin/attendance/mark" className={linkClass}>
              <ClipboardCheck size={17} />
              <span>Mark</span>
            </NavLink>
            <NavLink to="/admin/attendance/records" className={linkClass}>
              <ListChecks size={17} />
              <span>Records</span>
            </NavLink>
            <NavLink to="/admin/attendance/monthly" className={linkClass}>
              <CalendarRange size={17} />
              <span>Monthly</span>
            </NavLink>
          </nav>
        </div>
      </div>
      <div className="min-w-0 overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default AttendanceLayout;
