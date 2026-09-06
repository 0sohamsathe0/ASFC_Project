import { ArrowDownRight, ArrowRight } from "lucide-react";
import { PublicButton } from "../public/PublicUI";
import NavyOpen from "../../assets/Navy-Open-2025.avif";

export default function Hero() {
  return (
    <section className="home-hero public-dark" aria-labelledby="home-hero-title">
      <div className="home-hero-image">
        <img src={NavyOpen} width="1091" height="932"
          alt="ASFC athletes beside the fencing pistes at the Navy Open"
          fetchPriority="high" loading="eager" decoding="async" />
        <span className="home-photo-note">ASFC / Navy Open 2025</span>
      </div>
      <div className="public-container home-hero-content">
        <p className="public-eyebrow">All Star Fencing Club · Solapur</p>
        <h1 id="home-hero-title">Where Discipline<br />Becomes <em>Confidence.</em></h1>
        <p className="public-copy">Professional fencing training for young athletes in Solapur.</p>
        <div className="public-actions">
          <PublicButton href="#inside-all-star">See How We Train <ArrowDownRight size={17} /></PublicButton>
          <PublicButton to="/club-medal-record" variant="secondary">See Our Results <ArrowRight size={17} /></PublicButton>
        </div>
      </div>
    </section>
  );
}
