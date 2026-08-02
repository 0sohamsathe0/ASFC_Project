import { useEffect, useState } from "react";
import { api } from "../api";
import { motion, AnimatePresence } from "framer-motion";

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
  const [expandedTournament, setExpandedTournament] = useState(null);
  const [resultData, setResultData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [analytics, setAnalytics] = useState({
    registeredPlayers: 0,
    totalMedals: 0,
    internationalMedals: 0,
    nationalMedals: 0,
    stateMedals: 0,
    districtMedals: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [clubRes, playerRes, tournamentRes] = await Promise.all([
          api.get("/result/club"),
          api.get("/player/getAllPlayers?status=Accepted"),
          api.get("/tournament"),
        ]);

        setResultData(clubRes.data.data || []);
        setPlayers(playerRes.data.data.Accepted || []);
        setTournaments(tournamentRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />
      </div>
    );
  }

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
  const totalPlayers = players.length;

  const playerCategories = players.reduce((acc, player) => {
    const category = player.category || "Unknown";

    acc[category] = (acc[category] || 0) + 1;

    return acc;
  }, {});
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="min-h-screen bg-slate-50 p-6 lg:p-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* ================= HEADER ================= */}

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

        {/* ================= HERO ANALYTICS ================= */}

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

                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                    Club Performance
                  </p>

                  <h2 className="mt-5 text-7xl font-black leading-none">
                    {analytics.totalMedals}
                  </h2>

                  <p className="mt-3 text-xl font-semibold">
                    Total Medals Won
                  </p>

                  <p className="mt-2 max-w-sm text-sm text-slate-400">
                    Combined achievements earned by All Star Fencing Club athletes
                    across every tournament.
                  </p>

                </div>

                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 backdrop-blur">
                  <EmojiEventsRoundedIcon sx={{ fontSize: 54 }} className="text-yellow-400" />
                </div>

              </div>

              <div className="mt-10 grid grid-cols-3 gap-4">

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    National
                  </p>

                  <p className="mt-1 text-3xl font-bold">
                    {analytics.nationalMedals}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    State
                  </p>

                  <p className="mt-1 text-3xl font-bold">
                    {analytics.stateMedals}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    District
                  </p>

                  <p className="mt-1 text-3xl font-bold">
                    {analytics.districtMedals}
                  </p>
                </div>

              </div>
            </motion.div>

            {/* ================= RIGHT SIDE ================= */}

            <div className="xl:col-span-7 grid gap-5 sm:grid-cols-2">

              {/* Registered */}

              <motion.div
                whileHover={{ y: -4 }}
                className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
              >
                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-slate-500">
                      Registered Players
                    </p>

                    <h2 className="mt-4 text-5xl font-bold text-slate-900">
                      {analytics.registeredPlayers}
                    </h2>

                  </div>

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100">
                    <PersonRoundedIcon className="text-sky-600" />
                  </div>

                </div>
              </motion.div>

              {/* International */}

              <motion.div
                whileHover={{ y: -4 }}
                className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
              >
                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-slate-500">
                      International Medals
                    </p>

                    <h2 className="mt-4 text-5xl font-bold text-slate-900">
                      {analytics.internationalMedals}
                    </h2>

                  </div>

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100">
                    <PublicRoundedIcon className="text-indigo-600" />
                  </div>

                </div>
              </motion.div>

              {/* National */}

              <motion.div
                whileHover={{ y: -4 }}
                className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
              >
                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-slate-500">
                      National Medals
                    </p>

                    <h2 className="mt-4 text-5xl font-bold text-slate-900">
                      {analytics.nationalMedals}
                    </h2>

                  </div>

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
                    <WorkspacePremiumRoundedIcon className="text-emerald-600" />
                  </div>

                </div>
              </motion.div>

              {/* State */}

              <motion.div
                whileHover={{ y: -4 }}
                className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
              >
                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-slate-500">
                      State Medals
                    </p>

                    <h2 className="mt-4 text-5xl font-bold text-slate-900">
                      {analytics.stateMedals}
                    </h2>

                  </div>

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100">
                    <FlagRoundedIcon className="text-violet-600" />
                  </div>

                </div>
              </motion.div>

              {/* District */}

              <motion.div
                whileHover={{ y: -4 }}
                className="sm:col-span-2 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
              >
                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-slate-500">
                      District Medals
                    </p>

                    <h2 className="mt-4 text-5xl font-bold text-slate-900">
                      {analytics.districtMedals}
                    </h2>

                  </div>

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100">
                    <LocationOnRoundedIcon className="text-orange-600" />
                  </div>

                </div>
              </motion.div>

            </div>

          </div>
        </motion.div>

        {/* ================= LEVELS ================= */}

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
              {/* Section Header */}

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

              {/* Tournament Cards */}

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
                                <LocationOnRoundedIcon
                                  sx={{ fontSize: 18 }}
                                />

                                {tournament.locationCity}, {tournament.locationState}
                              </div>

                              <div className="flex items-center gap-2">
                                <CalendarMonthRoundedIcon
                                  sx={{ fontSize: 18 }}
                                />

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
                            transition={{
                              duration: 0.25,
                            }}
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
                                      {tournament.locationCity}, {tournament.locationState}
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
                                        (team, idx) => {
                                          console.log(team.medal);
                                          return (
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
                                            </motion.div>)
                                        }
                                      )}
                                    </motion.div>
                                  </div>
                                )}

                                {/* ================= INDIVIDUAL RESULTS ================= */}
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
                                          whileHover={{ y: -5 }}
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
