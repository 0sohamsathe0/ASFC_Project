import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    `relative text-[17px] font-medium transition-all duration-300
     ${isActive
      ? "text-blue-500 after:w-full"
      : "text-white hover:text-blue-400"
    }
     after:absolute after:left-0 after:-bottom-2 after:h-[2px]
     after:w-0 after:bg-blue-500 after:transition-all after:duration-300
     hover:after:w-full`;

  return (
    <nav className="w-screen mx-auto px-6 h-[82px] bg-[#111827]/95 backdrop-blur-xl border border-white/10">

  <div className="flex h-full items-center justify-between">

    {/* Logo */}
    <NavLink to="/" className="select-none">
      <h1 className="text-3xl font-extrabold tracking-tight">
        <span className="text-white">ALL STAR </span>
        <span className="text-white">FENCING </span>
        <span className="text-blue-500">CLUB</span>
      </h1>
    </NavLink>

    {/* Navigation */}
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

    {/* Right Buttons */}
    <div className="flex items-center gap-4">

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

  </div>

</nav>
  );
};

export default Navbar;