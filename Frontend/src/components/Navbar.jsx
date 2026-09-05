import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { PublicButton } from "./public/PublicUI";
import logo from "../assets/ASFC_Logo.png";

const links = [
  ["Home", "/"],
  ["About", "/about"],
  ["Tournaments", "/explore-tournament"],
  ["Results", "/club-medal-record"],
  ["Contact", "/contact"],
];

export default function Navbar() {
  const [menuPath, setMenuPath] = useState(null);
  const { pathname } = useLocation();
  const isMenuOpen = menuPath === pathname;
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  const closeMenu = () => setMenuPath(null);

  useEffect(() => {
    if (!isMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const toggle = toggleRef.current;
    menuRef.current?.querySelector("a")?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") {
        setMenuPath(null);
        toggle?.focus();
      }
      if (event.key === "Tab") {
        const controls = [
          toggle,
          ...menuRef.current.querySelectorAll("a, button"),
        ].filter(Boolean);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 1200) setMenuPath(null);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    alert("logout Sucessfully");
    closeMenu();
    navigate("/");
  };
  const navigation = links.map(([label, to]) => (
    <NavLink
      key={to}
      to={to}
      end={to === "/"}
      className="public-nav-link"
      onClick={closeMenu}
    >
      {label}
    </NavLink>
  ));
  const actions = (
    <div className="public-nav-actions">
      {!user ? (
        <>
          <NavLink
            to="/player/login"
            className="public-nav-link"
            onClick={closeMenu}
          >
            Player Login
          </NavLink>
          <PublicButton to="/player/register" onClick={closeMenu}>
            Join ASFC <ArrowRight size={15} />
          </PublicButton>
        </>
      ) : (
        <>
          <PublicButton
            to={user.role === "admin" ? "/admin/dashboard" : "/player/profile"}
            onClick={closeMenu}
          >
            {user.role === "admin" ? "Dashboard" : "My Profile"}
          </PublicButton>
          <button className="public-nav-link" onClick={handleLogout}>
            Logout
          </button>
        </>
      )}
    </div>
  );

  return (
    <header className="public-nav">
      {!pathname.startsWith("/player") && (
        <a className="public-skip" href="#public-content">
          Skip to content
        </a>
      )}
      <div className="public-container public-nav-bar">
        <NavLink
          to="/"
          className="public-brand"
          onClick={closeMenu}
          aria-label="All Star Fencing Club home"
        >
          <img src={logo} alt="" width="38" height="42" />
          <span>
            ALL STAR<small>FENCING CLUB · SOLAPUR</small>
          </span>
        </NavLink>
        <nav className="public-nav-desktop" aria-label="Main navigation">
          {navigation}
        </nav>
        <div className="public-nav-desktop">{actions}</div>
        <button
          ref={toggleRef}
          className="public-menu-toggle"
          aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isMenuOpen}
          aria-controls="public-mobile-menu"
          onClick={() => setMenuPath(isMenuOpen ? null : pathname)}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {isMenuOpen && (
        <>
          <div
            className="public-menu-backdrop"
            aria-hidden="true"
            onClick={() => {
              closeMenu();
              toggleRef.current?.focus();
            }}
          />
          <div
            id="public-mobile-menu"
            className="public-mobile-menu"
            ref={menuRef}
          >
            <nav aria-label="Mobile navigation">{navigation}</nav>
            {actions}
          </div>
        </>
      )}
    </header>
  );
}
