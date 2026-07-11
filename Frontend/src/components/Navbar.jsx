import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

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

  const navLinkClass = ({ isActive }) =>
    `relative text-[17px] font-medium transition-all duration-300
    ${isActive
      ? "text-blue-500 after:w-full"
      : "text-white hover:text-blue-400"
    }
    after:absolute after:left-0 after:-bottom-2
    after:h-[2px]
    after:w-0
    after:bg-blue-500
    after:transition-all
    after:duration-300
    hover:after:w-full`;

  return (
    <>
      <nav className="sticky top-0 z-[100] w-full bg-[#111827]/95 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto flex h-20 items-center justify-between px-4 md:px-6">

          {/* Logo */}
          <NavLink
            to="/"
            onClick={closeMenu}
            className="select-none"
          >
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
              <span className="text-white">ALL STAR </span>
              <span className="text-white">FENCING </span>
              <span className="text-blue-500">CLUB</span>
            </h1>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-14">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>

            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </div>

          {/* Desktop Right Buttons */}
          <div className="hidden md:flex items-center gap-4">

            {!user && (
              <>
                <NavLink
                  to="/player/login"
                  className="border border-white/15 rounded-full px-6 py-2.5 text-white hover:border-blue-500 hover:text-blue-400 transition"
                >
                  Login
                </NavLink>

                <NavLink
                  to="/player/register"
                  className="rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-7 py-2.5 text-white font-semibold hover:scale-105 transition"
                >
                  Register
                </NavLink>
              </>
            )}

            {user?.role === "player" && (
              <>
                <NavLink
                  to="/player/profile"
                  className="rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-2.5 text-white font-semibold"
                >
                  My Profile
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="rounded-full bg-red-500 px-6 py-2.5 text-white font-semibold hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            )}

            {user?.role === "admin" && (
              <>
                <NavLink
                  to="/admin/dashboard"
                  className="rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-2.5 text-white font-semibold"
                >
                  Dashboard
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="rounded-full bg-red-500 px-6 py-2.5 text-white font-semibold hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            )}

          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
          >
            <div className="relative h-8 w-8">
              <Menu
                size={30}
                className={`absolute transition-all duration-300 ${isMenuOpen
                    ? "opacity-0 rotate-90"
                    : "opacity-100 rotate-0"
                  }`}
              />

              <X
                size={30}
                className={`absolute transition-all duration-300 ${isMenuOpen
                    ? "opacity-100 rotate-0"
                    : "opacity-0 -rotate-90"
                  }`}
              />
            </div>
          </button>

        </div>
      </nav>
      {/* Backdrop */}
      <div
        onClick={closeMenu}
        className={`fixed inset-0 z-[101] bg-black/40 backdrop-blur-sm transition-all duration-300 md:hidden ${isMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
          }`}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed top-20 left-0 right-0 z-[102] bg-[#111827] border-t border-white/10 shadow-2xl transform transition-all duration-300 ease-in-out md:hidden ${isMenuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-6 opacity-0 pointer-events-none"
          }`}
      >
        <div className="flex flex-col gap-6 px-6 py-7">

          {/* Navigation */}
          <NavLink
            to="/"
            onClick={closeMenu}
            className={({ isActive }) =>
              `block text-lg font-medium transition-colors ${isActive
                ? "text-blue-500"
                : "text-white hover:text-blue-400"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            onClick={closeMenu}
            className={({ isActive }) =>
              `block text-lg font-medium transition-colors ${isActive
                ? "text-blue-500"
                : "text-white hover:text-blue-400"
              }`
            }
          >
            About
          </NavLink>

          <NavLink
            to="/contact"
            onClick={closeMenu}
            className={({ isActive }) =>
              `block text-lg font-medium transition-colors ${isActive
                ? "text-blue-500"
                : "text-white hover:text-blue-400"
              }`
            }
          >
            Contact
          </NavLink>

          <div className="border-t border-white/10 pt-5" />

          {/* Guest */}
          {!user && (
            <>
              <NavLink
                to="/player/login"
                onClick={closeMenu}
                className="rounded-full border border-white/20 py-3 text-center text-white transition hover:border-blue-500 hover:text-blue-400"
              >
                Login
              </NavLink>

              <NavLink
                to="/player/register"
                onClick={closeMenu}
                className="rounded-full bg-gradient-to-r from-blue-600 to-blue-500 py-3 text-center text-white font-semibold transition hover:scale-[1.02]"
              >
                Register
              </NavLink>
            </>
          )}

          {/* Player */}
          {user?.role === "player" && (
            <>
              <NavLink
                to="/player/profile"
                onClick={closeMenu}
                className="rounded-full bg-gradient-to-r from-blue-600 to-blue-500 py-3 text-center text-white font-semibold transition hover:scale-[1.02]"
              >
                My Profile
              </NavLink>

              <button
                onClick={handleLogout}
                className="rounded-full bg-red-500 py-3 text-white font-semibold transition hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}

          {/* Admin */}
          {user?.role === "admin" && (
            <>
              <NavLink
                to="/admin/dashboard"
                onClick={closeMenu}
                className="rounded-full bg-gradient-to-r from-blue-600 to-blue-500 py-3 text-center text-white font-semibold transition hover:scale-[1.02]"
              >
                Dashboard
              </NavLink>

              <button
                onClick={handleLogout}
                className="rounded-full bg-red-500 py-3 text-white font-semibold transition hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}

        </div>
      </div>
    </>
  );
};

export default Navbar;