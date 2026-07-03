import { NavLink,useNavigate } from "react-router-dom";
import logo from "../assets/ASFC_Logo.png";
import { useAuth } from "../context/AuthContext";
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <nav className="bg-slate-900 text-white shadow-md">

      <div className="w-full px-12 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="ASFC Logo"
            className="h-14 object-contain"
          />
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-10 text-xl font-medium">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `transition duration-300 hover:text-yellow-400 ${isActive ? "text-yellow-400 font-semibold" : ""
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `transition duration-300 hover:text-yellow-400 ${isActive ? "text-yellow-400 font-semibold" : ""
              }`
            }
          >
            About
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `transition duration-300 hover:text-yellow-400 ${isActive ? "text-yellow-400 font-semibold" : ""
              }`
            }
          >
            Contact
          </NavLink>

        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4">

          {!user && (
            <>
              <NavLink
                to="/player/login"
                className="bg-white text-black px-5 py-2 rounded-md font-medium hover:bg-gray-200 transition"
              >
                Login
              </NavLink>

              <NavLink
                to="/player/register"
                className="bg-yellow-400 text-black px-5 py-2 rounded-md font-semibold hover:bg-yellow-300 transition"
              >
                Register
              </NavLink>
            </>
          )}

          {user?.role === "player" && (
            <>
              <NavLink
                to="/player/profile"
                className="bg-white text-black px-5 py-2 rounded-md font-medium hover:bg-gray-200 transition"
              >
                My Profile
              </NavLink>

              <button
                onClick={handleLogout}
                className="bg-red-500 px-5 py-2 rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <NavLink
                to="/admin/dashboard"
                className="bg-white text-black px-5 py-2 rounded-md font-medium hover:bg-gray-200 transition"
              >
                Dashboard
              </NavLink>

              <button
                onClick={handleLogout}
                className="bg-red-500 px-5 py-2 rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}

        </div>

      </div>

    </nav>
  );
};

export default Navbar;