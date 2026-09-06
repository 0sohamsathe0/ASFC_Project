import { useEffect, useRef } from "react";
import { ArrowRight, Footprints, Swords, Flag, Medal, Trophy, MoveUpRight } from "lucide-react";
import { PublicButton, PublicImage, PublicJoin } from "../public/PublicUI";
import fencing from "../../assets/home/fencing-action.webp";
import KIUG from "../../assets/KIUG.avif";
import StateChampions from "../../assets/State-Champions.avif";

// Independent photo slots allow later replacement with verified practice/coaching photos.
const values = [
  ["Focus", "Think before you act."],
  ["Discipline", "Show up. Practice. Improve."],
  ["Confidence", "Learn to perform under pressure."],
];
const pathway = [
  { title: "Beginner", copy: "No experience needed.", Icon: Footprints },
  { title: "Training", copy: "Learn the foundations.", Icon: Swords },
  { title: "District", copy: "Your first competitions.", Icon: Flag },
  { title: "State", copy: "Take the next step.", Icon: Medal },
  { title: "National", copy: "Aim for a bigger stage.", Icon: Trophy },
  { title: "Higher opportunities", copy: "Keep growing.", Icon: MoveUpRight },
];

export default function HomeStorySections({ achievements }) {
  const storyRef = useRef(null);
  useEffect(() => {
    const root = storyRef.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer;
    const setup = () => {
      observer?.disconnect();
      root.classList.remove("home-motion");
      root.querySelectorAll(".is-visible").forEach((node) => node.classList.remove("is-visible"));
      if (preference.matches || !("IntersectionObserver" in window)) return;
      root.classList.add("home-motion");
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      root.querySelectorAll(".public-image, .home-journey").forEach((node) => observer.observe(node));
    };
    setup();
    preference.addEventListener("change", setup);
    return () => { observer?.disconnect(); preference.removeEventListener("change", setup); };
  }, []);

  return (
    <div ref={storyRef}>
      <section id="inside-all-star" className="public-section public-light home-training" aria-labelledby="training-title">
        <div className="public-container">
          <div className="public-section-head">
            <div><p className="public-eyebrow">01 / Discover the sport</p><h2 id="training-title" className="public-heading">Small steps.<br />Something bigger.</h2></div>
            <p className="public-copy">Structured training. Real competition. Continuous growth.</p>
          </div>
          <div className="home-training-gallery">
            <PublicImage src={fencing} alt="Two masked fencers exchanging a point on the piste" label="Learn. Train." className="home-training-action" />
            <PublicImage src={KIUG} alt="ASFC athlete at the Khelo India University Games" label="Compete." className="home-training-compete" />
            <div className="home-training-finish"><span aria-hidden="true">↗</span><p>Start with the basics.<br />See how far you can go.</p></div>
          </div>
        </div>
      </section>
      <section id="why-fencing" className="public-section public-white home-values" aria-labelledby="values-title">
        <div className="public-container">
          <p className="public-eyebrow">02 / Beyond the piste</p>
          <h2 id="values-title" className="public-heading">What fencing builds.</h2>
          <div className="home-value-list">
            {values.map(([title, copy], i) => <article key={title}><span className={`home-value-symbol home-value-symbol--${i}`} aria-hidden="true"><i /><i /><i /></span><div><h3>{title}</h3><p>{copy}</p></div></article>)}
          </div>
        </div>
      </section>
      {achievements}
      <section id="pathway" className="public-section public-light" aria-labelledby="journey-title">
        <div className="public-container">
          <div className="public-section-head">
            <div><p className="public-eyebrow">04 / The athlete journey</p><h2 id="journey-title" className="public-heading">Begin here.<br />Grow at every step.</h2></div>
            <p className="public-copy">Children can start as complete beginners, then work towards competition as they develop.</p>
          </div>
          <ol className="home-journey" aria-label="Athlete development pathway">
            {pathway.map((step, i) => <li key={step.title} style={{ "--step": i }}><span className="home-step-number">0{i + 1}</span><step.Icon size={27} strokeWidth={1.4} aria-hidden="true" /><h3>{step.title}</h3><p>{step.copy}</p></li>)}
          </ol>
        </div>
      </section>
      {/* Coach preview omitted until names, photos and roles are verified. */}
      <section className="public-section public-dark home-community" aria-labelledby="community-title">
        <div className="public-container">
          <div className="public-section-head"><div><p className="public-eyebrow">05 / A place to belong</p><h2 id="community-title" className="public-heading">More Than Training.</h2></div><p className="public-copy">A place to train, compete, grow and belong.</p></div>
          <PublicImage src={StateChampions} alt="ASFC team gathered together at a state fencing championship" label="One club. Shared ambitions." />
          <PublicButton variant="text" to="/about">Get to know our club <ArrowRight size={17} /></PublicButton>
        </div>
      </section>
      <PublicJoin title={<>Every Athlete<br />Starts Somewhere.</>} />
    </div>
  );
}
