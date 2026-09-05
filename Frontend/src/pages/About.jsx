import { ArrowRight } from "lucide-react";
import {
  PublicPageIntro,
  PublicImage,
  PublicButton,
  PublicJoin,
} from "../components/public/PublicUI";
import training from "../assets/fencing.avif";
import competition from "../assets/Navy-Open-2025.avif";

export default function About() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": "https://all-star-fencing-club.vercel.app/about#about",
    url: "https://all-star-fencing-club.vercel.app/about",
    name: "About All Star Fencing Club",
    description:
      "Learn about All Star Fencing Club, a fencing club in Solapur, Maharashtra, providing structured fencing training for athletes from U10 through Open and supporting competitive development from district to international levels.",

    mainEntity: {
      "@type": "SportsClub",
      "@id": "https://all-star-fencing-club.vercel.app/#organization",
      name: "All Star Fencing Club",
      url: "https://all-star-fencing-club.vercel.app/",
      sport: "Fencing",

      description:
        "All Star Fencing Club is a fencing club based in Solapur, Maharashtra, focused on developing athletes through fencing, building physical fitness, strengthening character, and instilling discipline.",

      address: {
        "@type": "PostalAddress",
        addressLocality: "Solapur",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },

      areaServed: {
        "@type": "City",
        name: "Solapur",
      },
    },
  };
  return (
    <main id="public-content" className="public-site">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PublicPageIntro
        label="Our club"
        title={
          <>
            A sporting ambition.
            <br />A sense of belonging.
          </>
        }
      >
        <p>
          Rooted in Solapur. Built around the belief that what we learn through
          sport stays with us beyond it.
        </p>
      </PublicPageIntro>
      <section className="public-section public-light">
        <div className="public-container public-split">
          <div>
            <p className="public-eyebrow">The All Star story</p>
            <h2 className="public-heading">
              A place to find
              <br />
              your potential.
            </h2>
            <p className="public-copy mt-6">
              All Star Fencing Club brings together athletes at different stages
              of their journey, from those discovering fencing to those
              preparing for competition.
            </p>
            <p className="public-copy mt-5">
              Our purpose is simple: build physical fitness, strengthen
              character and develop disciplined athletes through structured
              practice. Here in Solapur, each session is another opportunity to
              improve.
            </p>
          </div>
          <PublicImage
            src={training}
            alt="Two fencers practising on a piste"
            label="Movement. Focus. Technique."
            className="public-image--portrait"
          />
        </div>
      </section>
      <section className="public-section public-white">
        <div className="public-container public-split">
          <div>
            <p className="public-eyebrow">Our training philosophy</p>
            <h2 className="public-heading">
              Good habits.
              <br />
              Strong foundations.
            </h2>
            <p className="public-copy mt-6">
              Progress comes from purposeful practice. We connect technical
              learning with the focus and fitness an athlete needs on the piste.
            </p>
          </div>
          <div>
            {[
              [
                "Technique",
                "Footwork, stance and blade control form the foundation. Repetition helps athletes bring those skills into a bout.",
              ],
              [
                "Understanding",
                "Fencing asks athletes to observe, make decisions and adapt. Training develops the thinking behind each movement.",
              ],
              [
                "Preparation",
                "From physical conditioning to competition practice, athletes learn to approach their next challenge with purpose.",
              ],
            ].map(([title, copy], i) => (
              <article className="public-benefit" key={title}>
                <span>0{i + 1}</span>
                <div>
                  <h3 className="public-h3">{title}</h3>
                  <p className="public-copy">{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="public-section public-dark">
        <div className="public-container public-split">
          <PublicImage
            src={competition}
            alt="ASFC athletes taking part in competition"
            label="Practice becomes experience"
          />
          <div>
            <p className="public-eyebrow">Athlete development</p>
            <h2 className="public-heading">
              The next challenge
              <br />
              is part of the journey.
            </h2>
            <p className="public-copy mt-6">
              The club supports athletes across age categories, from U10 through
              Open. Development starts with fundamentals and grows through
              technical practice and competitive exposure.
            </p>
            <p className="public-copy mt-5">
              District and state events provide experience on the way toward
              national and higher-level opportunities. Every bout offers
              something to learn.
            </p>
            <PublicButton
              to="/explore-tournament"
              variant="text"
              className="mt-5"
            >
              Explore competitions <ArrowRight size={17} />
            </PublicButton>
          </div>
        </div>
      </section>
      <section className="public-section public-white">
        <div className="public-container public-split">
          <div>
            <p className="public-eyebrow">What stays with you</p>
            <h2 className="public-heading">
              Character is built
              <br />
              in the everyday.
            </h2>
          </div>
          <div className="public-values">
            {[
              ["Discipline", "Consistent effort, even on the difficult days."],
              ["Respect", "For the sport and everyone who shares it."],
              ["Focus", "Full attention to the moment in front of you."],
              ["Resilience", "The willingness to learn and try again."],
            ].map(([title, copy]) => (
              <div key={title}>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <PublicJoin title="Find your place on the piste." />
    </main>
  );
}
