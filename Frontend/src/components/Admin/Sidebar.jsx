import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col">

      <div className="p-6 text-xl font-bold border-b border-slate-700">
        Admin Panel
      </div>

      <nav className="flex flex-col p-4 space-y-2">

        <NavLink
          to="/admin/dashboard"
          className="hover:bg-slate-700 p-3 rounded"
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/requests"
          className="hover:bg-slate-700 p-3 rounded"
        >
          Player Requests
        </NavLink>

        <NavLink
          to="/admin/tournaments"
          className="hover:bg-slate-700 p-3 rounded"
        >
          Tournaments
        </NavLink>

        <NavLink
          to="/admin/entries"
          className="hover:bg-slate-700 p-3 rounded"
        >
          Tournament Entries
        </NavLink>

      </nav>

    </div>
  );
};

export default Sidebar;