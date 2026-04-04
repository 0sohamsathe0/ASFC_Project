import { NavLink } from "react-router-dom";
import { useState } from "react";

const Sidebar = () => {
  const [openPlayers, setOpenPlayers] = useState(false);
  const [openTournament, setOpenTournament] = useState(false);
  const [openResults, setOpenResults] = useState(false);
  const [openCertificates, setOpenCertificates] = useState(false);

  const linkStyle = ({ isActive }) =>
    `p-3 rounded block hover:bg-slate-700 ${
      isActive ? "bg-slate-700" : ""
    }`;

  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col ">
      
      {/* Title */}
      <div className="p-6 text-xl font-bold border-b border-slate-700">
        Admin Panel
      </div>

      <nav className="flex overflow-y-auto flex-col p-4 space-y-2 scrollbar-thin scrollbar-thumb-slate-700">

        {/* Dashboard */}
        <NavLink to="/admin/dashboard" className={linkStyle}>
          Dashboard
        </NavLink>

        {/* PLAYERS */}
        <button
          onClick={() => setOpenPlayers(!openPlayers)}
          className="p-3 rounded hover:bg-slate-700 flex justify-between items-center"
        >
          Players
          <span>{openPlayers ? "▲" : "▼"}</span>
        </button>

        {openPlayers && (
          <div className="flex flex-col ml-4 space-y-2 text-sm">
            <NavLink to="/admin/dashboard/players" className={linkStyle}>
              Player List
            </NavLink>

            <NavLink to="/admin/dashboard/requests" className={linkStyle}>
              Player Requests
            </NavLink>
          </div>
        )}

        {/* TOURNAMENTS */}
        <button
          onClick={() => setOpenTournament(!openTournament)}
          className="p-3 rounded hover:bg-slate-700 flex justify-between items-center"
        >
          Tournaments
          <span>{openTournament ? "▲" : "▼"}</span>
        </button>

        {openTournament && (
          <div className="flex flex-col ml-4 space-y-2 text-sm">
            <NavLink to="/admin/dashboard/tournaments" className={linkStyle}>
              All Tournaments
            </NavLink>

            <NavLink to="/admin/dashboard/add-tournament" className={linkStyle}>
              Add Tournament
            </NavLink>
          </div>
        )}

        {/* Tournament Entries */}
        <NavLink to="/admin/dashboard/entries" className={linkStyle}>
          Tournament Entries
        </NavLink>

        {/* RESULTS */}
        <button
          onClick={() => setOpenResults(!openResults)}
          className="p-3 rounded hover:bg-slate-700 flex justify-between items-center"
        >
          Results
          <span>{openResults ? "▲" : "▼"}</span>
        </button>

        {openResults && (
          <div className="flex flex-col ml-4 space-y-2 text-sm">
            <NavLink to="/admin/dashboard/individual-results" className={linkStyle}>
              Individual Results
            </NavLink>

            <NavLink to="/admin/dashboard/team-results" className={linkStyle}>
              Team Results
            </NavLink>
          </div>
        )}

        {/* CERTIFICATES */}
        <button
          onClick={() => setOpenCertificates(!openCertificates)}
          className="p-3 rounded hover:bg-slate-700 flex justify-between items-center"
        >
          Certificates
          <span>{openCertificates ? "▲" : "▼"}</span>
        </button>

        {openCertificates && (
          <div className="flex flex-col ml-4 space-y-2 text-sm">
            <NavLink to="/admin/dashboard/merit-certificates" className={linkStyle}>
              Merit Certificates
            </NavLink>

            <NavLink to="/admin/dashboard/participation-certificates" className={linkStyle}>
              Participation Certificates
            </NavLink>
          </div>
        )}

      </nav>
    </div>
  );
};

export default Sidebar;