import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, User, Shield, LogOut, ArrowRight, ChevronRight, Trophy } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/ASFC_Logo.png"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `relative text-sm font-semibold transition-all duration-300 ${isActive ? "text-blue-400 after:w-full" : "text-slate-300 hover:text-white"
    } after:absolute after:left-0 after:-bottom-1.5 after:h-[2px] after:w-0 after:bg-blue-400 after:transition-all after:duration-300 hover:after:w-full`;

  return (
    <>
      <nav className="sticky top-0 z-[100] w-full bg-[#020617]/90 backdrop-blur-xl border-b border-white/10 transition-all">
        <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-8">

          {/* Logo */}
          <NavLink
            to="/"
            onClick={closeMenu}
            className="select-none flex items-center gap-2.5 z-50 shrink-0"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl">
              <img
                src={logo}
                alt="All Star Fencing Club Logo"
                className="h-9 w-auto object-contain"
              />
            </div>
            <h1 className="text-base sm:text-lg lg:text-xl font-black tracking-tight">
              <span className="text-white">ALL STAR </span>
              <span className="text-white">FENCING </span>
              <span className="text-blue-500">CLUB</span>
            </h1>
          </NavLink>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>

            <NavLink to="/explore-tournament" className={navLinkClass}>
              Tournaments
            </NavLink>

            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </div>

          {/* Desktop Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {!user && (
              <>
                <NavLink
                  to="/player/login"
                  className="rounded-xl border border-white/15 bg-white/[0.03] px-5 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition"
                >
                  Login
                </NavLink>

                <NavLink
                  to="/player/register"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/30 hover:from-blue-500 hover:to-blue-400 transition"
                >
                  <span>Register</span>
                  <ArrowRight size={14} />
                </NavLink>
              </>
            )}

            {user?.role === "player" && (
              <>
                <NavLink
                  to="/player/profile"
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/20"
                >
                  My Profile
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500 hover:text-white transition"
                >
                  Logout
                </button>
              </>
            )}

            {user?.role === "admin" && (
              <>
                <NavLink
                  to="/admin/dashboard"
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/20"
                >
                  Dashboard
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500 hover:text-white transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Navigation"
            className="relative z-[105] flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-slate-200 backdrop-blur-md transition active:scale-95 md:hidden"
          >
            <Menu
              size={20}
              className={`absolute transition-all duration-300 ${isMenuOpen ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
                }`}
            />
            <X
              size={20}
              className={`absolute transition-all duration-300 ${isMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
                }`}
            />
          </button>

        </div>
      </nav>

      {/* Mobile Backdrop */}
      <div
        onClick={closeMenu}
        className={`fixed inset-0 z-[101] bg-black/60 backdrop-blur-md transition-opacity duration-300 md:hidden ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      />

      {/* Mobile Glassmorphic Drawer */}
      <div
        className={`fixed top-16 left-0 right-0 z-[102] max-h-[calc(100vh-4rem)] overflow-y-auto bg-[#020617]/95 border-b border-white/10 shadow-2xl backdrop-blur-2xl transition-all duration-300 ease-out md:hidden ${isMenuOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-4 opacity-0 pointer-events-none"
          }`}
      >
        <div className="flex flex-col p-5 gap-5">

          {/* Logged In User Info Badge Header */}
          {user && (
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-3.5 backdrop-blur-md">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {user.role === "admin" ? <Shield size={20} /> : <User size={20} />}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Logged in as
                </span>
                <span className="text-sm font-bold text-white truncate capitalize">
                  {user.name || user.role}
                </span>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="flex flex-col gap-1.5">
            <span className="px-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Menu
            </span>

            <NavLink
              to="/"
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive
                  ? "bg-blue-600/15 border border-blue-500/30 text-blue-400"
                  : "text-slate-200 hover:bg-white/[0.04]"
                }`
              }
            >
              <span>Home</span>
              <ChevronRight size={16} className="text-slate-600" />
            </NavLink>

            <NavLink
              to="/about"
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive
                  ? "bg-blue-600/15 border border-blue-500/30 text-blue-400"
                  : "text-slate-200 hover:bg-white/[0.04]"
                }`
              }
            >
              <span>About</span>
              <ChevronRight size={16} className="text-slate-600" />
            </NavLink>

            <NavLink
              to="/explore-tournament"
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive
                  ? "bg-blue-600/15 border border-blue-500/30 text-blue-400"
                  : "text-slate-200 hover:bg-white/[0.04]"
                }`
              }
            >
              <div className="flex items-center gap-2">
                <span>Tournaments</span>
              </div>
              <ChevronRight size={16} className="text-slate-600" />
            </NavLink>

            <NavLink
              to="/contact"
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive
                  ? "bg-blue-600/15 border border-blue-500/30 text-blue-400"
                  : "text-slate-200 hover:bg-white/[0.04]"
                }`
              }
            >
              <span>Contact</span>
              <ChevronRight size={16} className="text-slate-600" />
            </NavLink>
          </div>

          <div className="border-t border-white/10" />

          {/* Guest Action Buttons */}
          {!user && (
            <div className="flex flex-col gap-2.5 pb-2">
              <NavLink
                to="/player/register"
                onClick={closeMenu}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 active:scale-[0.98] transition"
              >
                <span>Register as Player</span>
                <ArrowRight size={16} />
              </NavLink>

              <NavLink
                to="/player/login"
                onClick={closeMenu}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] py-3 text-sm font-semibold text-slate-200 active:scale-[0.98] transition"
              >
                <span>Login to Portal</span>
              </NavLink>
            </div>
          )}

          {/* Player Actions */}
          {user?.role === "player" && (
            <div className="flex flex-col gap-2.5 pb-2">
              <NavLink
                to="/player/profile"
                onClick={closeMenu}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 active:scale-[0.98]"
              >
                <User size={16} />
                <span>My Profile</span>
              </NavLink>

              <button
                onClick={handleLogout}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 py-3 text-sm font-semibold text-red-400 active:scale-[0.98]"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}

          {/* Admin Actions */}
          {user?.role === "admin" && (
            <div className="flex flex-col gap-2.5 pb-2">
              <NavLink
                to="/admin/dashboard"
                onClick={closeMenu}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 active:scale-[0.98]"
              >
                <Shield size={16} />
                <span>Admin Dashboard</span>
              </NavLink>

              <button
                onClick={handleLogout}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 py-3 text-sm font-semibold text-red-400 active:scale-[0.98]"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Navbar;