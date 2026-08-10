import { NavLink } from "react-router-dom";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import logo from "../assets/ASFC_Logo.png";

const publicLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Tournaments", to: "/explore-tournament" },
  { label: "Contact", to: "/contact" },
];

const playerLinks = [
  { label: "Player Registration", to: "/player/register" },
  { label: "Player Login", to: "/player/login" },
];

const PublicFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t border-white/10 bg-[#020617] text-slate-300"
      aria-label="Site footer"
    >
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-12">

          {/* Brand */}
          <div>
            <NavLink
              to="/"
              className="inline-flex items-center gap-3"
              aria-label="All Star Fencing Club home"
            >
              <img
                src={logo}
                alt="All Star Fencing Club logo"
                className="h-11 w-auto object-contain"
              />

              <div>
                <div className="text-base font-black tracking-tight text-white sm:text-lg">
                  ALL STAR FENCING{" "}
                  <span className="text-blue-500">CLUB</span>
                </div>

                <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Solapur, Maharashtra
                </div>
              </div>
            </NavLink>

            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
              All Star Fencing Club is a fencing club based in Solapur,
              Maharashtra, India. Explore the club, tournaments, and player
              services through the public website.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.facebook.com/p/ALL-STAR-Fencing-CLUB-100064343851939/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="All Star Fencing Club on Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <FaFacebookF size={16} />
              </a>

              <a
                href="https://www.instagram.com/all_star_fencing_club/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="All Star Fencing Club on Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <FaInstagram size={17} />
              </a>
            </div>
          </div>

          {/* Explore */}
          <nav aria-label="Explore">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white">
              Explore
            </h2>

            <ul className="mt-5 space-y-3">
              {publicLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className="text-sm text-slate-400 transition hover:text-white focus:outline-none focus-visible:text-white"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Player */}
          <nav aria-label="Player services">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white">
              Player
            </h2>

            <ul className="mt-5 space-y-3">
              {playerLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className="text-sm text-slate-400 transition hover:text-white focus:outline-none focus-visible:text-white"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white">
              Contact
            </h2>

            <div className="mt-5 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin
                  size={17}
                  className="mt-0.5 shrink-0 text-blue-400"
                  aria-hidden="true"
                />

                <p className="leading-5 text-slate-400">
                  Chh. Shivaji Night College
                  <br />
                  Solapur, Maharashtra, India
                </p>
              </div>

              <a
                href="tel:+919637963777"
                className="flex items-center gap-3 text-slate-400 transition hover:text-white focus:outline-none focus-visible:text-white"
              >
                <Phone
                  size={17}
                  className="shrink-0 text-blue-400"
                  aria-hidden="true"
                />
                <span>+91 96379 63777</span>
              </a>

              <a
                href="mailto:info@allstarfencingclub.com"
                className="flex items-center gap-3 break-all text-slate-400 transition hover:text-white focus:outline-none focus-visible:text-white"
              >
                <Mail
                  size={17}
                  className="shrink-0 text-blue-400"
                  aria-hidden="true"
                />
                <span>info@allstarfencingclub.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {currentYear} All Star Fencing Club. All rights reserved.
            </p>

            <p>Fencing Club · Solapur, Maharashtra</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;