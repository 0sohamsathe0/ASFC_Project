import { useEffect, useState } from "react";
import {
  Award,
  CalendarDays,
  ChevronDown,
  MapPin,
  Medal,
  Trophy,
  Users,
} from "lucide-react";

import { api } from "../api.js";

const LEVEL_ORDER = [
  "International",
  "National",
  "State",
  "District",
];

const MEDAL_CONFIG = {
  First: {
    label: "Gold",
    icon: "🥇",
  },
  Second: {
    label: "Silver",
    icon: "🥈",
  },
  Third: {
    label: "Bronze",
    icon: "🥉",
  },
};

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

  // =========================================================
  // FETCH CLUB RESULTS
  // =========================================================

  useEffect(() => {
    const fetchClubResults = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/result/club");

        if (!response.data?.success) {
          throw new Error("Failed to load club results");
        }

        setGroups(response.data.data || []);
        setAnalytics(response.data.analytics || null);
      } catch (err) {
        console.error("Club medal record error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load the club medal record."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClubResults();
  }, []);

  // =========================================================
  // ORDER LEVELS
  // =========================================================

  const orderedGroups = LEVEL_ORDER
    .map((level) =>
      groups.find((group) => group.level === level)
    )
    .filter(Boolean);

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
    }
  );

  const totalMedals =
    medalTotals.gold +
    medalTotals.silver +
    medalTotals.bronze;

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return <LoadingState />;
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return <ErrorState message={error} />;
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <main className="min-h-screen bg-[#020617] text-white">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden px-4 pb-12 pt-28 sm:px-6 lg:px-8">

        {/* Ambient Glow */}

        <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl">

          <div className="max-w-3xl">

            {/* Badge */}

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-400">
              <Trophy size={13} />
              All Star Fencing Club
            </div>

            {/* Heading */}

            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Club{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                Medal Record
              </span>
            </h1>

            {/* Description */}

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
              Explore the competitive medal record of All Star
              Fencing Club across district, state, national and
              international competitions.
            </p>

          </div>

          {/* =================================================
              OVERALL MEDAL STATS
          ================================================= */}

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">

            <MedalStat
              icon="🥇"
              label="Gold"
              value={medalTotals.gold}
            />

            <MedalStat
              icon="🥈"
              label="Silver"
              value={medalTotals.silver}
            />

            <MedalStat
              icon="🥉"
              label="Bronze"
              value={medalTotals.bronze}
            />

            <MedalStat
              icon="🏆"
              label="Total Medals"
              value={
                analytics?.totalMedals ?? totalMedals
              }
              highlighted
            />

          </div>

        </div>
      </section>

      {/* =====================================================
          MEDAL HISTORY
      ===================================================== */}

      <section className="px-4 pb-24 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-7xl">

          {orderedGroups.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-12">

              {orderedGroups.map((group) => (
                <LevelSection
                  key={group.level}
                  group={group}
                />
              ))}

            </div>
          )}

        </div>

      </section>

    </main>
  );
}


// =============================================================
// LEVEL SECTION
// =============================================================

function LevelSection({ group }) {
  return (
    <section>

      {/* Level Heading */}

      <div className="mb-5 flex items-center gap-3">

        <div className="h-px flex-1 bg-white/10" />

        <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5">

          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-300">
            {group.level}
          </span>

        </div>

        <div className="h-px flex-1 bg-white/10" />

      </div>

      {/* Tournament List */}

      <div className="space-y-4">

        {group.tournaments?.map((tournament) => (
          <TournamentCard
            key={tournament._id}
            tournament={tournament}
          />
        ))}

      </div>

    </section>
  );
}


// =============================================================
// TOURNAMENT CARD
// =============================================================

function TournamentCard({ tournament }) {
  const [expanded, setExpanded] = useState(false);

  const individual =
    tournament.achievements?.individual || [];

  const team =
    tournament.achievements?.team || [];

  const achievementCount =
    individual.length + team.length;

  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">

      {/* =====================================================
          TOURNAMENT HEADER
      ===================================================== */}

      <div className="p-5 sm:p-6">

        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

          {/* Tournament Information */}

          <div className="min-w-0">

            <h2 className="text-lg font-bold text-white sm:text-xl">
              {tournament.title}
            </h2>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">

              {/* Location */}

              {(tournament.locationCity ||
                tournament.locationState) && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={13} />

                  {[
                    tournament.locationCity,
                    tournament.locationState,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              )}

              {/* Date */}

              {tournament.startingDate && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={13} />

                  {formatDate(
                    tournament.startingDate
                  )}

                  {tournament.endDate &&
                    new Date(
                      tournament.endDate
                    ).getTime() !==
                      new Date(
                        tournament.startingDate
                      ).getTime() && (
                      <>
                        {" – "}
                        {formatDate(
                          tournament.endDate
                        )}
                      </>
                    )}
                </span>
              )}

            </div>

          </div>

          {/* =================================================
              MEDAL TALLY
          ================================================= */}

          <div className="grid grid-cols-4 gap-2 sm:flex">

            <MedalBox
              icon="🥇"
              label="Gold"
              value={
                tournament.medalTally?.gold || 0
              }
            />

            <MedalBox
              icon="🥈"
              label="Silver"
              value={
                tournament.medalTally?.silver || 0
              }
            />

            <MedalBox
              icon="🥉"
              label="Bronze"
              value={
                tournament.medalTally?.bronze || 0
              }
            />

            <MedalBox
              icon="🏆"
              label="Total"
              value={tournament.totalMedals || 0}
              highlighted
            />

          </div>

        </div>

        {/* =================================================
            VIEW RESULTS BUTTON
        ================================================= */}

        {achievementCount > 0 && (
          <button
            type="button"
            onClick={() =>
              setExpanded((prev) => !prev)
            }
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
          >

            <Award size={14} />

            {expanded
              ? "Hide Results"
              : "View Results"}

            <span className="text-slate-500">
              ({achievementCount})
            </span>

            <ChevronDown
              size={14}
              className={`transition-transform ${
                expanded
                  ? "rotate-180"
                  : ""
              }`}
            />

          </button>
        )}

      </div>

      {/* =====================================================
          RESULTS DETAILS
      ===================================================== */}

      {expanded && (
        <div className="border-t border-white/10 bg-black/10 p-5 sm:p-6">

          <div className="grid gap-8 lg:grid-cols-2">

            {/* =================================================
                INDIVIDUAL RESULTS
            ================================================= */}

            {individual.length > 0 && (
              <ResultGroup
                title="Individual Results"
                icon={<Award size={16} />}
              >

                {individual.map(
                  (result, index) => (
                    <ResultRow
                      key={`individual-${index}`}
                      medal={result.medal}
                      name={result.name}
                      category={result.category}
                    />
                  )
                )}

              </ResultGroup>
            )}

            {/* =================================================
                TEAM RESULTS
            ================================================= */}

            {team.length > 0 && (
              <ResultGroup
                title="Team Results"
                icon={<Users size={16} />}
              >

                {team.map(
                  (result, index) => (
                    <ResultRow
                      key={`team-${index}`}
                      medal={result.medal}
                      name={
                        result.players?.join(", ")
                      }
                      category={result.category}
                    />
                  )
                )}

              </ResultGroup>
            )}

          </div>

        </div>
      )}

    </article>
  );
}


// =============================================================
// MEDAL STAT
// =============================================================

function MedalStat({
  icon,
  label,
  value,
  highlighted = false,
}) {
  return (
    <div
      className={`rounded-2xl border p-4 backdrop-blur-xl ${
        highlighted
          ? "border-blue-500/20 bg-blue-500/[0.06]"
          : "border-white/10 bg-white/[0.035]"
      }`}
    >

      <div className="flex items-center gap-2">

        <span className="text-lg">
          {icon}
        </span>

        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </span>

      </div>

      <div
        className={`mt-3 text-3xl font-black ${
          highlighted
            ? "text-blue-400"
            : "text-white"
        }`}
      >
        {value}
      </div>

    </div>
  );
}


// =============================================================
// MEDAL BOX
// =============================================================

function MedalBox({
  icon,
  label,
  value,
  highlighted = false,
}) {
  return (
    <div
      className={`min-w-[68px] rounded-xl border px-3 py-2 text-center ${
        highlighted
          ? "border-blue-500/20 bg-blue-500/[0.06]"
          : "border-white/10 bg-white/[0.025]"
      }`}
    >

      <div className="text-sm">
        {icon}
      </div>

      <div
        className={`mt-0.5 text-sm font-black ${
          highlighted
            ? "text-blue-400"
            : "text-white"
        }`}
      >
        {value}
      </div>

      <div className="text-[8px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </div>

    </div>
  );
}


// =============================================================
// RESULT GROUP
// =============================================================

function ResultGroup({
  title,
  icon,
  children,
}) {
  return (
    <div>

      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white">

        <span className="text-blue-400">
          {icon}
        </span>

        {title}

      </div>

      <div className="space-y-2">
        {children}
      </div>

    </div>
  );
}


// =============================================================
// RESULT ROW
// =============================================================

function ResultRow({
  medal,
  name,
  category,
}) {
  const config = MEDAL_CONFIG[medal];

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-3">

      <div className="flex items-start gap-3">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-lg">
          {config?.icon || "🏅"}
        </div>

        <div className="min-w-0">

          <p className="text-sm font-semibold text-slate-200">
            {name}
          </p>

          {category && (
            <p className="mt-0.5 text-xs text-slate-500">
              {formatCategory(category)}
            </p>
          )}

        </div>

      </div>

    </div>
  );
}


// =============================================================
// LOADING STATE
// =============================================================

function LoadingState() {
  return (
    <main className="min-h-screen bg-[#020617] px-4 pb-24 pt-28 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        <div className="animate-pulse space-y-6">

          <div className="h-8 w-56 rounded-xl bg-white/10" />

          <div className="h-5 w-96 max-w-full rounded-lg bg-white/5" />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-28 rounded-2xl bg-white/5"
              />
            ))}

          </div>

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-52 rounded-3xl bg-white/5"
            />
          ))}

        </div>

      </div>

    </main>
  );
}


// =============================================================
// ERROR STATE
// =============================================================

function ErrorState({ message }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#020617] px-4 text-white">

      <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-red-500/[0.05] p-10 text-center">

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
          <Trophy size={28} />
        </div>

        <h1 className="mt-5 text-xl font-bold">
          Unable to load medal record
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          {message}
        </p>

      </div>

    </main>
  );
}


// =============================================================
// EMPTY STATE
// =============================================================

function EmptyState() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center">

      <Medal
        size={34}
        className="mx-auto text-slate-600"
      />

      <h2 className="mt-4 text-lg font-bold">
        No medal records yet
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        Club results will appear here as tournament
        results are recorded.
      </p>

    </div>
  );
}