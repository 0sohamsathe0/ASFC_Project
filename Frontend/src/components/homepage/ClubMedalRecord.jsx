import { useEffect, useId, useState } from "react";
import { ArrowLeft, ChevronDown, MapPin, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import {
  PublicPageIntro,
  PublicButton,
  PublicDataState,
} from "../public/PublicUI";

const LEVEL_ORDER = ["International", "National", "State", "District"];

const MEDAL_CONFIG = {
  First: {
    label: "Gold",
    tone: "gold",
  },
  Second: {
    label: "Silver",
    tone: "silver",
  },
  Third: {
    label: "Bronze",
    tone: "bronze",
  },
};

const getLevelSlug = (level = "") =>
  level.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatCategory = (category) => {
  if (!category) return "";

  return category
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function ClubMedalRecord() {
  const [groups, setGroups] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    const fetchResults = async () => {
      try {
        const response = await api.get("/result/club");
        if (!response.data?.success)
          throw new Error("Failed to load club results");
        if (active) {
          setGroups(response.data.data || []);
          setAnalytics(response.data.analytics || null);
        }
      } catch (error) {
        if (active)
          setError(
            error.response?.data?.message ||
              "Unable to load the club medal record.",
          );
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchResults();
    return () => {
      active = false;
    };
  }, [attempt]);
  const retry = () => {
    setLoading(true);
    setError("");
    setAttempt((value) => value + 1);
  };
  const orderedGroups = LEVEL_ORDER.map((level) =>
    groups.find((group) => group.level === level),
  ).filter(Boolean);

  // =========================================================
  // CALCULATE OVERALL MEDAL TALLY
  // =========================================================

  const medalTotals = orderedGroups.reduce(
    (totals, group) => {
      group.tournaments?.forEach((tournament) => {
        totals.gold += tournament.medalTally?.gold || 0;
        totals.silver += tournament.medalTally?.silver || 0;
        totals.bronze += tournament.medalTally?.bronze || 0;
      });

      return totals;
    },
    {
      gold: 0,
      silver: 0,
      bronze: 0,
    },
  );

  const totalMedals =
    medalTotals.gold + medalTotals.silver + medalTotals.bronze;

  return (
    <main id="public-content" className="public-site club-medal-page">
      <div className="results-home-bar public-dark">
        <div className="public-container">
          <Link className="results-home-link" to="/">
            <ArrowLeft size={17} aria-hidden="true" />
            Home
          </Link>
        </div>
      </div>
      <PublicPageIntro
        label="Club medal record"
        title={
          <>
            Earned on the piste.
            <br />
            Remembered here.
          </>
        }
      >
        <p>
          The competitive record of All Star Fencing Club. Explore medals,
          tournaments and the athletes representing Solapur.
        </p>
      </PublicPageIntro>
      <section className="public-section public-light results-summary">
        <div className="public-container">
          {loading || error ? (
            <PublicDataState
              kind={loading ? "loading" : "error"}
              title={loading ? "Loading club results…" : "Results unavailable"}
              onRetry={loading ? undefined : retry}
            >
              {loading ? "Getting the latest medal record." : error}
            </PublicDataState>
          ) : (
            <>
              <p className="public-eyebrow">The club record</p>
              <h2 className="public-heading">Every medal tells a story.</h2>
              <div className="public-stat-row">
                {[
                  ["Gold", medalTotals.gold],
                  ["Silver", medalTotals.silver],
                  ["Bronze", medalTotals.bronze],
                  ["Total medals", analytics?.totalMedals ?? totalMedals],
                ].map(([label, value]) => {
                  const tone = label.toLowerCase().split(" ")[0];
                  return (
                  <div className={`public-stat public-stat--${tone}`} key={label}>
                    <span className="results-medal-marker" aria-hidden="true" />
                    <span className="public-small">{label}</span>
                    <strong>{value}</strong>
                  </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
      {!loading && !error && (
        <section className="public-section public-white results-archive">
          <div className="public-container public-results-list">
            {orderedGroups.length === 0 ? (
              <PublicDataState title="No medal records yet.">
                Club results will appear here as tournament results are
                recorded.
              </PublicDataState>
            ) : (
              orderedGroups.map((group) => {
                const levelSlug = getLevelSlug(group.level);
                return (
                <section
                  className={`results-level results-level--${levelSlug}`}
                  key={group.level}
                >
                  <div className="results-level-heading">
                    <p className="results-level-label">{group.level} level</p>
                    <h2>{group.level}</h2>
                    <p>{group.level}-level competition archive</p>
                  </div>
                  <div className="results-tournament-list">
                    {group.tournaments?.map((tournament) => (
                      <TournamentRecord
                        key={tournament._id}
                        tournament={tournament}
                      />
                    ))}
                  </div>
                </section>
                );
              })
            )}
          </div>
        </section>
      )}
    </main>
  );
}

function TournamentRecord({ tournament }) {
  const [expanded, setExpanded] = useState(false);
  const detailsId = useId();
  const individual = tournament.achievements?.individual || [];
  const team = tournament.achievements?.team || [];
  const achievementCount = individual.length + team.length;
  return (
    <article className="public-result-tournament">
      <div className="results-tournament-header">
        <div className="results-tournament-info">
          <h3 className="public-h3">{tournament.title}</h3>
          <div className="public-small results-tournament-meta">
            {(tournament.locationCity || tournament.locationState) && (
              <span>
                <MapPin size={15} aria-hidden="true" />
                {[tournament.locationCity, tournament.locationState]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            )}
            {tournament.startingDate && (
              <span>
                <CalendarDays size={15} aria-hidden="true" />
                <span>
                  {formatDate(tournament.startingDate)}
                  {tournament.endDate &&
                    new Date(tournament.endDate).getTime() !==
                      new Date(tournament.startingDate).getTime() && (
                      <> – {formatDate(tournament.endDate)}</>
                    )}
                </span>
              </span>
            )}
          </div>
        </div>
        <div className="results-medal-summary" aria-label="Tournament medal totals">
          {[
            ["Gold", tournament.medalTally?.gold || 0],
            ["Silver", tournament.medalTally?.silver || 0],
            ["Bronze", tournament.medalTally?.bronze || 0],
            ["Total", tournament.totalMedals || 0],
          ].map(([label, value]) => {
            const tone = label.toLowerCase();
            return (
            <div className={`public-medal-box public-medal-box--${tone}`} key={label}>
              <strong>{value}</strong>
              <span className="public-small">{label}</span>
            </div>
            );
          })}
        </div>
      </div>
      {achievementCount > 0 && (
        <PublicButton
          variant="text"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          aria-controls={detailsId}
          className="results-toggle"
        >
          {expanded ? "Hide results" : "View results"} ({achievementCount})
          <ChevronDown
            size={16}
            className={`results-toggle-chevron${expanded ? " is-expanded" : ""}`}
            aria-hidden="true"
          />
        </PublicButton>
      )}
      <div id={detailsId} hidden={!expanded}>
        {expanded && (
          <div
            className={`public-result-details results-expanded results-groups${
              individual.length > 0 && team.length > 0
                ? " results-groups--split"
                : ""
            }`}
          >
            {individual.length > 0 && (
              <div className="results-group">
                <h4>Individual results</h4>
                {individual.map((result, index) => (
                  <ResultRow
                    key={index}
                    medal={result.medal}
                    name={result.name}
                    category={result.category}
                  />
                ))}
              </div>
            )}
            {team.length > 0 && (
              <div className="results-group">
                <h4>Team results</h4>
                {team.map((result, index) => (
                  <ResultRow
                    key={index}
                    medal={result.medal}
                    name={result.players?.join(", ")}
                    category={result.category}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function ResultRow({ medal, name, category }) {
  const config = MEDAL_CONFIG[medal];
  const tone = config?.tone || "result";
  return (
    <div className="public-result-row">
      <span className={`public-small results-result-medal results-result-medal--${tone}`}>
        {config?.label || medal || "Result"}
      </span>
      <div className="min-w-0">
        <p className="font-medium">{name}</p>
        {category && <p className="public-small">{formatCategory(category)}</p>}
      </div>
    </div>
  );
}
