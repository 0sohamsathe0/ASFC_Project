import { NavLink } from "react-router-dom";
import { useState } from "react";

const Sidebar = () => {

  const [openTournament, setOpenTournament] = useState(false);

  const linkStyle = ({ isActive }) =>
    `p-3 rounded block hover:bg-slate-700 ${
      isActive ? "bg-slate-700" : ""
    }`;

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col">

      {/* Title */}
      <div className="p-6 text-xl font-bold border-b border-slate-700">
        Admin Panel
      </div>

      <nav className="flex flex-col p-4 space-y-2">

        {/* Dashboard */}
        <NavLink to="/admin/dashboard" className={linkStyle}>
          Dashboard
        </NavLink>

        {/* Player Requests */}
        <NavLink to="/admin/dashboard/requests" className={linkStyle}>
          Player Requests
        </NavLink>

        {/* Tournaments Parent */}
        <button
          onClick={() => setOpenTournament(!openTournament)}
          className="p-3 rounded hover:bg-slate-700 flex justify-between items-center"
        >
          Tournaments
          <span>{openTournament ? "▲" : "▼"}</span>
        </button>

        {/* Tournament Submenu */}
        {openTournament && (
          <div className="flex flex-col ml-4 space-y-2 text-sm">

            <NavLink
              to="/admin/dashboard/tournaments"
              className={linkStyle}
            >
              All Tournaments
            </NavLink>

            <NavLink
              to="/admin/dashboard/add-tournament"
              className={linkStyle}
            >
              Add Tournament
            </NavLink>

          </div>
        )}

        {/* Tournament Entries */}
        <NavLink to="/admin/dashboard/entries" className={linkStyle}>
          Tournament Entries
        </NavLink>

      </nav>
    </div>
  );
};

export default Sidebar;