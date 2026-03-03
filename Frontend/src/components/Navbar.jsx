import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      
      {/* Logo */}
      <h2 className="text-2xl font-bold tracking-wide">
        MyApp
      </h2>

      {/* Links */}
      <div className="space-x-6">
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

        <NavLink
          to="/login"
          className={({ isActive }) =>
            `transition duration-300 hover:text-yellow-400 ${
              isActive ? "text-yellow-400 font-semibold" : ""
            }`
          }
        >
          Login
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;