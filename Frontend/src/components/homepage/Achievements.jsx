import { ArrowRight } from "lucide-react";
import { PublicButton } from "../public/PublicUI";
import KIYG from "../../assets/KIYG-Gold.avif";
import National from "../../assets/School-Nation.avif";

export default function Achievements() {
  return (
    <section className="public-section public-dark home-results" aria-labelledby="results-title">
      <div className="public-container">
        <div className="home-results-heading">
          <div>
            <p className="public-eyebrow">03 / Achievements</p>
            <h2 id="results-title" className="public-heading">
              From Solapur<br />To The National Stage.
            </h2>
          </div>
          <PublicButton className="home-results-cta--desktop" to="/club-medal-record" variant="text">
            Explore All Results <ArrowRight size={17} />
          </PublicButton>
        </div>
        <div className="home-results-gallery">
          <article className="home-result home-result-main">
            <figure className="public-image home-result-photo">
              <img
                src={KIYG}
                alt="ASFC gold medalists displaying their medals at the Khelo India Youth Games"
                width="1150"
                height="960"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <div className="home-result-caption">
              <span>Khelo India Youth Games</span>
              <strong>ASFC players have achieved gold medals.</strong>
            </div>
          </article>
          <article className="home-result home-result-support">
            <figure className="public-image home-result-photo">
              <img
                src={National}
                alt="ASFC school national medalists with their medals and certificates"
                width="500"
                height="400"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <div className="home-result-caption">
              <span>National level</span>
              <strong>Our athletes have earned medals at national-level fencing competitions.</strong>
            </div>
          </article>
        </div>
        <PublicButton className="home-results-cta--mobile" to="/club-medal-record" variant="text">
          Explore All Results <ArrowRight size={17} />
        </PublicButton>
      </div>
    </section>
  );
}
