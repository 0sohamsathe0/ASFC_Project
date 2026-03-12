import { NavLink } from "react-router-dom";
import logo from "../assets/ASFC_Logo.png";

const Navbar = () => {
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
              `transition duration-300 hover:text-yellow-400 ${
                isActive ? "text-yellow-400 font-semibold" : ""
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `transition duration-300 hover:text-yellow-400 ${
                isActive ? "text-yellow-400 font-semibold" : ""
              }`
            }
          >
            About
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `transition duration-300 hover:text-yellow-400 ${
                isActive ? "text-yellow-400 font-semibold" : ""
              }`
            }
          >
            Contact
          </NavLink>

        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4">

          <NavLink
            to="/login"
            className="bg-white text-black px-5 py-2 rounded-md font-medium hover:bg-gray-200 transition"
          >
            Login
          </NavLink>

          <NavLink
            to="/register"
            className="bg-yellow-400 text-black px-5 py-2 rounded-md font-semibold hover:bg-yellow-300 transition"
          >
            Register
          </NavLink>

        </div>

      </div>

    </nav>
  );
};

export default Navbar;