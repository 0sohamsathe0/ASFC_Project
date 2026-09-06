import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import logo from "../assets/ASFC_Logo.png";

export default function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="public-container">
        <div className="public-footer-grid">
          <div>
            <Link className="public-brand" to="/">
              <img src={logo} alt="" width="38" height="42" />
              <span>
                ALL STAR<small>FENCING CLUB · SOLAPUR</small>
              </span>
            </Link>
            <p className="public-copy mt-6">
              Building discipline, confidence and competitive spirit through
              fencing. From your first session to your next challenge.
            </p>
            <div className="mt-6 flex gap-5">
              <a
                aria-label="ASFC on Instagram"
                href="https://www.instagram.com/all_star_fencing_club/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram size={20} />
              </a>
              <a
                aria-label="ASFC on Facebook"
                href="https://www.facebook.com/p/ALL-STAR-Fencing-CLUB-100064343851939/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF size={18} />
              </a>
            </div>
          </div>
          <nav aria-label="Explore">
            <h2>Explore</h2>
            <ul>
              {[
                ["Home", "/"],
                ["About", "/about"],
                ["Tournaments", "/explore-tournament"],
                ["Results", "/club-medal-record"],
                ["Contact", "/contact"],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to}>{label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Player services">
            <h2>Player</h2>
            <ul>
              <li>
                <Link to="/player/register">Register</Link>
              </li>
              <li>
                <Link to="/player/login">Player Login</Link>
              </li>
            </ul>
          </nav>
          <div>
            <h2>Visit the club</h2>
            <ul>
              <li>
                Chh. Shivaji Night College
                <br />
                Solapur, Maharashtra, India
              </li>
              <li>
                <a href="tel:+919637963777">+91 96379 63777</a>
              </li>
              <li>
                <a
                  className="break-words"
                  href="mailto:info@allstarfencingclub.com"
                >
                  info@allstarfencingclub.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="public-footer-bottom">
          <p>© {new Date().getFullYear()} All Star Fencing Club.</p>
          <p>Discipline. Development. Competition.</p>
        </div>
      </div>
    </footer>
  );
}
