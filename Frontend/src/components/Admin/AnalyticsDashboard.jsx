import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../api";

import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);

  const [expandedTournament, setExpandedTournament] = useState(null);

  const [resultData, setResultData] = useState([]);
  const [players, setPlayers] = useState([]);
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [clubRes, playerRes, tournamentRes] = await Promise.all([
          api.get("/result/club"),
          api.get("/player/getAllPlayers?status=Accepted"),
          api.get("/tournament"),
        ]);

        setResultData(clubRes.data.data || []);
        setPlayers(playerRes.data.data || []);
        setTournaments(tournamentRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />
      </div>
    );
  }

  // ============================================================
  // Helpers
  // ============================================================

   const getPlayerCategory = (dob, seasonYear = 2026) => {
  const age = seasonYear - new Date(dob).getFullYear();

  if (age <= 10) return "U10";
  if (age <= 12) return "U12";
  if (age <= 14) return "U14";
  if (age <= 17) return "U17";
  if (age <= 20) return "U20";

  return "Senior";
};

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const medalStyles = {
    First: {
      emoji: "🥇",
      badge: "bg-amber-100 text-amber-700",
    },
    Second: {
      emoji: "🥈",
      badge: "bg-slate-100 text-slate-700",
    },
    Third: {
      emoji: "🥉",
      badge: "bg-orange-100 text-orange-700",
    },
  };

  // ============================================================
  // Player Analytics
  // ============================================================

  const totalPlayers = players.length;

  const playerCategories = players.reduce((acc, player) => {
  const category = getPlayerCategory(player.dob);

  acc[category] = (acc[category] || 0) + 1;

  return acc;
}, {});

  const categoryOrder = [
    "U10",
    "U12",
    "U14",
    "U17",
    "U20",
    "Senior",
  ];

  const sortedCategories = categoryOrder
    .filter((category) => playerCategories[category])
    .map((category) => ({
      category,
      count: playerCategories[category],
    }));

  // ============================================================
  // Tournament Analytics
  // ============================================================

  const totalTournaments = tournaments.length;

  const tournamentLevels = tournaments.reduce((acc, tournament) => {
    const level = tournament.level || "Other";

    acc[level] = (acc[level] || 0) + 1;

    return acc;
  }, {});

  const levelOrder = [
    "District",
    "State",
    "National",
    "International",
  ];

  const sortedTournamentLevels = levelOrder
    .filter((level) => tournamentLevels[level])
    .map((level) => ({
      level,
      count: tournamentLevels[level],
    }));

  // ============================================================
  // Medal Analytics
  // ============================================================

  const medalAnalytics = {
    total: 0,
    District: 0,
    State: 0,
    National: 0,
    International: 0,
  };

  resultData.forEach((section) => {
    const medalCount = section.tournaments.reduce(
      (sum, tournament) => sum + tournament.totalMedals,
      0
    );

    medalAnalytics.total += medalCount;

    if (medalAnalytics.hasOwnProperty(section.level)) {
      medalAnalytics[section.level] = medalCount;
    }
  });

 

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="min-h-screen bg-slate-50 p-6 lg:p-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-3">

          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200">
            <WorkspacePremiumRoundedIcon
              sx={{ fontSize: 20 }}
              className="text-amber-500"
            />

            <span className="text-sm font-medium text-slate-600">
              All Star Fencing Club
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Club Results
          </h1>

          <p className="max-w-2xl text-slate-500">
            A complete overview of medals and achievements earned by All Star
            Fencing Club athletes across District, State, National and
            International tournaments.
          </p>

        </div>

        {/* ================= DASHBOARD ================= */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-14"
        >
          <div className="grid gap-6 xl:grid-cols-12">

            {/* ================= HERO CARD ================= */}

            <motion.div
              whileHover={{ y: -4 }}
              className="xl:col-span-5 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-2xl"
            >
              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm uppercase tracking-[0.35em] text-slate-400">
                    CLUB PERFORMANCE
                  </p>

                  <h2 className="mt-5 text-7xl font-black leading-none">
                    {medalAnalytics.total}
                  </h2>

                  <p className="mt-3 text-xl font-semibold">
                    Total Medals Won
                  </p>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                    Combined achievements earned by All Star Fencing Club
                    athletes across every level of competition.
                  </p>

                </div>

                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 backdrop-blur">
                  <EmojiEventsRoundedIcon
                    sx={{ fontSize: 56 }}
                    className="text-yellow-400"
                  />
                </div>

              </div>

              <div className="mt-10 grid grid-cols-4 gap-4">

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    INT
                  </p>

                  <p className="mt-1 text-3xl font-bold">
                    {medalAnalytics.International}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    NAT
                  </p>

                  <p className="mt-1 text-3xl font-bold">
                    {medalAnalytics.National}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    STATE
                  </p>

                  <p className="mt-1 text-3xl font-bold">
                    {medalAnalytics.State}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    DIST
                  </p>

                  <p className="mt-1 text-3xl font-bold">
                    {medalAnalytics.District}
                  </p>
                </div>

              </div>

            </motion.div>

            {/* ================= REGISTERED PLAYERS ================= */}

            <motion.div
              whileHover={{ y: -4 }}
              className="xl:col-span-3 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    Registered Players
                  </p>

                  <h2 className="mt-2 text-5xl font-black text-slate-900">
                    {totalPlayers}
                  </h2>

                </div>

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100">
                  <PersonRoundedIcon
                    sx={{ fontSize: 34 }}
                    className="text-sky-600"
                  />
                </div>

              </div>

              <div className="mt-8 border-t border-slate-100 pt-6">

                <p className="mb-4 text-sm font-semibold text-slate-700">
                  Player Categories
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {sortedCategories.map(({ category, count }) => (
                    <motion.div
                      key={category}
                      whileHover={{ scale: 1.03 }}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {category}
                      </p>

                      <p className="mt-2 text-3xl font-black text-slate-900">
                        {count}
                      </p>
                    </motion.div>
                  ))}

                </div>

              </div>

            </motion.div>

            {/* ================= TOURNAMENT PARTICIPATION ================= */}

            <motion.div
              whileHover={{ y: -4 }}
              className="xl:col-span-4 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    Tournament Participation
                  </p>

                  <h2 className="mt-2 text-5xl font-black text-slate-900">
                    {totalTournaments}
                  </h2>

                </div>

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100">
                  <EmojiEventsRoundedIcon
                    sx={{ fontSize: 34 }}
                    className="text-violet-600"
                  />
                </div>

              </div>

              <div className="mt-8 border-t border-slate-100 pt-6">

                <p className="mb-4 text-sm font-semibold text-slate-700">
                  Tournament Levels
                </p>

                <div className="grid grid-cols-2 gap-3">

                  {Object.entries(tournamentLevels).map(([level, count]) => (
                    <motion.div
                      key={level}
                      whileHover={{ scale: 1.03 }}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {level}
                      </p>

                      <p className="mt-2 text-3xl font-black text-slate-900">
                        {count}
                      </p>
                    </motion.div>
                  ))}

                </div>

              </div>

            </motion.div>

          </div>

        </motion.div>

        {/* ================= TOURNAMENT LEVELS ================= */}

        <div className="space-y-12">

          {resultData.map((section, sectionIndex) => (

            <motion.div
              key={section.level}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: sectionIndex * 0.08,
              }}
            >

              {/* ================= LEVEL HEADER ================= */}

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">

                  {section.level.toLowerCase() === "international" ? (
                    <PublicRoundedIcon className="text-sky-600" />
                  ) : (
                    <FlagRoundedIcon className="text-slate-700" />
                  )}

                </div>

                <div>

                  <h2 className="text-2xl font-semibold text-slate-900">
                    {section.level}
                  </h2>

                  <p className="text-sm text-slate-500">
                    {section.tournaments.length} Tournament
                    {section.tournaments.length > 1 ? "s" : ""}
                  </p>

                </div>

              </div>

              {/* ================= TOURNAMENT LIST ================= */}

              <div className="space-y-5">

                <AnimatePresence initial={false}>

                  {section.tournaments.map((tournament, index) => (
                    <motion.div
                      key={tournament._id}
                      layout
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        delay: index * 0.05,
                      }}
                      className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >

                      {/* ================= TOURNAMENT HEADER ================= */}

                      <button
                        onClick={() =>
                          setExpandedTournament((prev) =>
                            prev === tournament._id ? null : tournament._id
                          )
                        }
                        className="w-full px-7 py-6 text-left"
                      >

                        <div className="flex items-start justify-between gap-6">

                          <div className="space-y-4">

                            <div>
                              <h3 className="text-2xl font-semibold text-slate-900">
                                {tournament.title}
                              </h3>
                            </div>

                            <div className="flex flex-wrap gap-5 text-sm text-slate-500">

                              <div className="flex items-center gap-2">
                                <LocationOnRoundedIcon sx={{ fontSize: 18 }} />
                                {tournament.locationCity},{" "}
                                {tournament.locationState}
                              </div>

                              <div className="flex items-center gap-2">
                                <CalendarMonthRoundedIcon sx={{ fontSize: 18 }} />

                                {formatDate(tournament.startingDate)} -{" "}
                                {formatDate(tournament.endDate)}
                              </div>

                              <div className="flex items-center gap-2">
                                <EmojiEventsRoundedIcon
                                  sx={{ fontSize: 18 }}
                                  className="text-amber-500"
                                />

                                {tournament.totalMedals} Club Medal
                                {tournament.totalMedals > 1 && "s"}
                              </div>

                            </div>

                          </div>

                          <motion.div
                            animate={{
                              rotate:
                                expandedTournament === tournament._id
                                  ? 180
                                  : 0,
                            }}
                            transition={{ duration: 0.25 }}
                            className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100"
                          >
                            <KeyboardArrowDownRoundedIcon />
                          </motion.div>

                        </div>

                      </button>

                      <AnimatePresence>

                        {expandedTournament === tournament._id && (

                          <motion.div
                            layout
                            initial={{
                              opacity: 0,
                              height: 0,
                            }}
                            animate={{
                              opacity: 1,
                              height: "auto",
                            }}
                            exit={{
                              opacity: 0,
                              height: 0,
                            }}
                            transition={{
                              duration: 0.35,
                            }}
                            className="overflow-hidden border-t border-slate-100"
                          >

                            <div className="space-y-10 px-7 py-7">

                              {/* ================= TOURNAMENT INFORMATION ================= */}

                              <div>

                                <h4 className="mb-5 text-lg font-semibold text-slate-900">
                                  Tournament Information
                                </h4>

                                <div className="grid gap-4 md:grid-cols-3">

                                  <div className="rounded-2xl bg-slate-50 p-5">

                                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
                                      <LocationOnRoundedIcon className="text-sky-600" />
                                    </div>

                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                      Location
                                    </p>

                                    <p className="mt-1 font-medium text-slate-800">
                                      {tournament.locationCity},{" "}
                                      {tournament.locationState}
                                    </p>

                                  </div>

                                  <div className="rounded-2xl bg-slate-50 p-5">

                                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
                                      <CalendarMonthRoundedIcon className="text-indigo-600" />
                                    </div>

                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                      Duration
                                    </p>

                                    <p className="mt-1 font-medium text-slate-800">
                                      {formatDate(tournament.startingDate)}
                                    </p>

                                    <p className="text-sm text-slate-500">
                                      to {formatDate(tournament.endDate)}
                                    </p>

                                  </div>

                                  <div className="rounded-2xl bg-slate-50 p-5">

                                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
                                      <EmojiEventsRoundedIcon className="text-amber-500" />
                                    </div>

                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                      Club Medals
                                    </p>

                                    <p className="mt-1 text-2xl font-bold text-slate-900">
                                      {tournament.totalMedals}
                                    </p>

                                  </div>

                                </div>

                              </div>

                              {/* ================= CLUB ACHIEVEMENTS ================= */}

                              <div>

                                <div className="mb-6 flex items-center gap-3">

                                  <WorkspacePremiumRoundedIcon className="text-amber-500" />

                                  <h4 className="text-xl font-semibold text-slate-900">
                                    Club Achievements
                                  </h4>

                                </div>
                                {/* ================= TEAM RESULTS ================= */}

                                {tournament.achievements.team.length > 0 && (
                                  <div className="mb-10">

                                    <div className="mb-5 flex items-center gap-2">

                                      <GroupsRoundedIcon className="text-slate-600" />

                                      <h5 className="text-lg font-semibold text-slate-900">
                                        Team Results
                                      </h5>

                                    </div>

                                    <motion.div
                                      initial="hidden"
                                      animate="show"
                                      variants={{
                                        hidden: {},
                                        show: {
                                          transition: {
                                            staggerChildren: 0.08,
                                          },
                                        },
                                      }}
                                      className="grid gap-5 lg:grid-cols-2"
                                    >

                                      {tournament.achievements.team.map(
                                        (team, idx) => (
                                          <motion.div
                                            key={idx}
                                            variants={{
                                              hidden: {
                                                opacity: 0,
                                                y: 20,
                                              },
                                              show: {
                                                opacity: 1,
                                                y: 0,
                                              },
                                            }}
                                            whileHover={{
                                              y: -5,
                                            }}
                                            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
                                          >

                                            <div className="mb-5 flex items-start justify-between">

                                              <div>

                                                <h6 className="text-lg font-semibold text-slate-900">
                                                  {team.category}
                                                </h6>

                                                <span
                                                  className={`mt-3 inline-flex rounded-full px-4 py-1 text-sm font-semibold ${medalStyles[team.medal].badge
                                                    }`}
                                                >
                                                  {medalStyles[team.medal].emoji}{" "}
                                                  {team.medal}
                                                </span>

                                              </div>

                                            </div>

                                            <div className="space-y-3">

                                              {team.players.map(
                                                (player, playerIndex) => (
                                                  <div
                                                    key={playerIndex}
                                                    className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3"
                                                  >

                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
                                                      <PersonRoundedIcon
                                                        sx={{ fontSize: 20 }}
                                                        className="text-slate-600"
                                                      />
                                                    </div>

                                                    <span className="font-medium text-slate-700">
                                                      {player}
                                                    </span>

                                                  </div>
                                                )
                                              )}

                                            </div>

                                          </motion.div>
                                        )
                                      )}

                                    </motion.div>

                                  </div>
                                )}

                                {/* ================= INDIVIDUAL RESULTS ================= */}

                                <div>

                                  <div className="mb-5 flex items-center gap-2">

                                    <PersonRoundedIcon className="text-slate-600" />

                                    <h5 className="text-lg font-semibold text-slate-900">
                                      Individual Results
                                    </h5>

                                  </div>

                                  <motion.div
                                    initial="hidden"
                                    animate="show"
                                    variants={{
                                      hidden: {},
                                      show: {
                                        transition: {
                                          staggerChildren: 0.06,
                                        },
                                      },
                                    }}
                                    className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
                                  >
                                    {tournament.achievements.individual.map(
                                      (result, idx) => (
                                        <motion.div
                                          key={idx}
                                          variants={{
                                            hidden: {
                                              opacity: 0,
                                              y: 20,
                                            },
                                            show: {
                                              opacity: 1,
                                              y: 0,
                                            },
                                          }}
                                          whileHover={{
                                            y: -5,
                                          }}
                                          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
                                        >

                                          <div className="mb-5 flex items-center justify-between">

                                            <span
                                              className={`inline-flex rounded-full px-4 py-1 text-sm font-semibold ${medalStyles[result.medal].badge
                                                }`}
                                            >
                                              {medalStyles[result.medal].emoji}{" "}
                                              {result.medal}
                                            </span>

                                            <EmojiEventsRoundedIcon className="text-amber-500" />

                                          </div>

                                          <div className="mb-4 flex items-center gap-3">

                                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                                              <PersonRoundedIcon className="text-slate-600" />
                                            </div>

                                            <div>

                                              <p className="text-lg font-semibold text-slate-900">
                                                {result.name}
                                              </p>

                                              <p className="text-sm text-slate-500">
                                                ASFC Athlete
                                              </p>

                                            </div>

                                          </div>

                                          <div className="rounded-2xl bg-slate-50 px-4 py-3">

                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                              Category
                                            </p>

                                            <p className="mt-1 font-medium text-slate-800">
                                              {result.category}
                                            </p>

                                          </div>

                                        </motion.div>
                                      )
                                    )}

                                  </motion.div>

                                </div>

                              </div>

                            </div>

                          </motion.div>
                        )}

                      </AnimatePresence>

                    </motion.div>
                  ))}

                </AnimatePresence>

              </div>

            </motion.div>
          ))}

        </div>

      </div>

    </motion.div>
  );
}