import { NavLink } from "react-router-dom";
import logo from "../assets/ASFC_Logo.png";

const Navbar = () => {
  return (
    <nav className="bg-slate-900 text-white px-10 py-5 shadow-lg">

      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* Logo / Brand */}
        <h2 className="text-3xl font-bold tracking-wide" style={{ fontFamily: "Bebas Neue" }}>
          <img src={logo} alt="ASFC Logo" className="h-20 inline-block mr-2" />
        </h2>

        {/* Navigation */}
        <div className="flex items-center gap-10 text-2xl font-large">

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

          {/* Login Button */}
          <NavLink
            to="/login"
            className="bg-white text-black hover:bg-gray-200 px-5 py-2 rounded-lg font-semibold transition"
          >
            Login
          </NavLink>

          {/* Register Button */}
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