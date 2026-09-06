import { useEffect, useMemo, useState } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { api } from "../api";
import {
  PublicPageIntro,
  PublicButton,
  PublicDataState,
} from "../public/PublicUI";
import { getTournamentStatus } from "../../utils/tournamentDisplay";

export default function ExploreTournament() {
  const [loading, setLoading] = useState(true);
  const [tournaments, setTournaments] = useState([]);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://all-star-fencing-club.vercel.app/explore-tournament#page",
    url: "https://all-star-fencing-club.vercel.app/explore-tournament",
    name: "Explore Fencing Tournaments | All Star Fencing Club",
    description:
      "Explore fencing tournaments in which All Star Fencing Club athletes participate, from district and state competitions to national and international events.",
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://all-star-fencing-club.vercel.app/#website",
      name: "All Star Fencing Club",
      url: "https://all-star-fencing-club.vercel.app/",
    },
    about: {
      "@type": "SportsClub",
      "@id": "https://all-star-fencing-club.vercel.app/#organization",
      name: "All Star Fencing Club",
      url: "https://all-star-fencing-club.vercel.app/",
      sport: "Fencing",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Solapur",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
    },
  };

  useEffect(() => {
    let active = true;
    api
      .get("/tournament/all")
      .then((response) => {
        if (active) setTournaments(response.data.data || []);
      })
      .catch(() => {
        if (active)
          setError(
            "We couldn't load the competition calendar. Please try again.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [attempt]);
  const retry = () => {
    setLoading(true);
    setError("");
    setAttempt((value) => value + 1);
  };
  const { upcoming, completed } = useMemo(() => {
    const upcoming = [];
    const completed = [];

    tournaments.forEach((tournament) => {
      if (getTournamentStatus(tournament) !== "completed") {
        upcoming.push(tournament);
      } else {
        completed.push(tournament);
      }
    });
    const levelOrder = {
      International: 0,
      National: 1,
      State: 2,
      District: 3,
    };

    upcoming.sort((a, b) => {
      const levelDiff = levelOrder[a.level] - levelOrder[b.level];

      if (levelDiff !== 0) return levelDiff;

      // Same level → earliest tournament first
      return new Date(a.startingDate) - new Date(b.startingDate);
    });

    completed.sort((a, b) => {
      const levelDiff = levelOrder[a.level] - levelOrder[b.level];

      if (levelDiff !== 0) return levelDiff;

      // Same level → latest tournament first
      return new Date(b.startingDate) - new Date(a.startingDate);
    });

    return { upcoming, completed };
  }, [tournaments]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const tournamentRow = (tournament) => (
    <article className="public-tournament-row" key={tournament._id}>
      <div className="public-date">
        <p>{formatDate(tournament.startingDate)}</p>
        <p className="public-small">to {formatDate(tournament.endDate)}</p>
      </div>
      <div>
        <span className="public-pill mb-3">{tournament.level}</span>
        <h3 className="public-h3">{tournament.title}</h3>
        <p className="public-small mt-3 flex items-start gap-2">
          <MapPin size={16} className="shrink-0 mt-0.5" />
          {[tournament.locationCity, tournament.locationState]
            .filter(Boolean)
            .join(", ")}
        </p>
      </div>
    </article>
  );
  return (
    <main id="public-content" className="public-site">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PublicPageIntro
        label="Competition calendar"
        title={
          <>
            The next stage.
            <br />
            The next challenge.
          </>
        }
      >
        <p>
          Explore fencing tournaments in which All Star Fencing Club athletes
          participate, from district and state competitions to national and
          international events.
        </p>
      </PublicPageIntro>
      {loading || error ? (
        <section className="public-section">
          <div className="public-container">
            <PublicDataState
              kind={loading ? "loading" : "error"}
              title={loading ? "Loading tournaments…" : "Calendar unavailable"}
              onRetry={loading ? undefined : retry}
            >
              {loading ? "Getting the latest competition information." : error}
            </PublicDataState>
          </div>
        </section>
      ) : (
        <>
          <section className="public-section public-light">
            <div className="public-container">
              <div className="public-archive-heading">
                <h2 className="public-heading">On the horizon.</h2>
                <span className="public-small">
                  Upcoming & current tournaments
                </span>
              </div>
              {upcoming.length ? (
                upcoming.map(tournamentRow)
              ) : (
                <PublicDataState title="The next challenge is on its way.">
                  No upcoming tournaments are listed yet. Check back for the
                  next competition.
                </PublicDataState>
              )}
            </div>
          </section>
          <section className="public-section public-white">
            <div className="public-container">
              <div className="public-archive-heading">
                <h2 className="public-heading">On the record.</h2>
                <span className="public-small">Completed tournaments</span>
              </div>
              {completed.length ? (
                completed.map(tournamentRow)
              ) : (
                <PublicDataState title="No completed tournaments yet.">
                  Past competitions will appear here as the season progresses.
                </PublicDataState>
              )}
            </div>
          </section>
        </>
      )}
      <section className="public-section public-dark">
        <div className="public-container public-split">
          <div>
            <p className="public-eyebrow">Beyond the final bout</p>
            <h2 className="public-heading">
              The effort.
              <br />
              The achievement.
            </h2>
          </div>
          <div>
            <p className="public-copy">
              Explore the club medal record and the athletes behind the results.
            </p>
            <PublicButton
              to="/club-medal-record"
              variant="secondary"
              className="mt-6"
            >
              See Our Results <ArrowRight size={17} />
            </PublicButton>
          </div>
        </div>
      </section>
    </main>
  );
}
