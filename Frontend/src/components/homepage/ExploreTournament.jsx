import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import UpcomingRoundedIcon from "@mui/icons-material/UpcomingRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import { CircularProgress } from "@mui/material";
import { api } from "../api";

const ExploreTournament = () => {
    const [loading, setLoading] = useState(true);
    const [tournaments, setTournaments] = useState([]);

    useEffect(() => {
        fetchTournaments();
    }, []);

    const fetchTournaments = async () => {
        try {
            const res = await api.get("/tournament/all");
            setTournaments(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const { upcoming, completed } = useMemo(() => {
        const now = new Date();

        const upcoming = [];
        const completed = [];

        tournaments.forEach((tournament) => {
            if (new Date(tournament.endDate) >= now) {
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

    const TournamentCard = ({ tournament }) => (
        <motion.div
            whileHover={{ y: -4 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-all"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{tournament.title}</h3>

                <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-300">
                    {tournament.level}
                </span>
            </div>

            <div className="mt-6 space-y-3 text-slate-300">
                <div className="flex items-center gap-2">
                    <LocationOnRoundedIcon fontSize="small" />
                    <span>
                        {tournament.locationCity}, {tournament.locationState}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <CalendarMonthRoundedIcon fontSize="small" />
                    <span>
                        {formatDate(tournament.startingDate)} -{" "}
                        {formatDate(tournament.endDate)}
                    </span>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-[#07152E] text-white">
            {/* Hero */}
            <section className="relative overflow-hidden border-b border-white/10">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:80px_80px]" />

                <div className="relative mx-auto max-w-7xl px-6 py-24">
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <p className="mb-4 text-sm uppercase tracking-[6px] text-blue-400">
                            All Star Fencing Club
                        </p>

                        <h1 className="text-5xl font-black md:text-7xl">
                            Explore
                            <br />
                            <span className="text-blue-500">Tournaments</span>
                        </h1>

                        <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300">
                            Stay updated with upcoming tournaments and revisit competitions
                            our club has proudly participated in.
                        </p>
                    </motion.div>
                </div>
            </section>

            {loading ? (
                <div className="flex h-[60vh] items-center justify-center">
                    <CircularProgress color="inherit" />
                </div>
            ) : (
                <>
                    {/* Upcoming */}
                    <section className="mx-auto max-w-7xl px-6 py-16">
                        <div className="mb-10 flex items-center gap-3">
                            <UpcomingRoundedIcon className="text-blue-400" />
                            <h2 className="text-3xl font-bold">
                                Upcoming Tournaments
                            </h2>
                        </div>

                        {upcoming.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center text-slate-400">
                                No Upcoming Tournaments
                            </div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {upcoming.map((tournament) => (
                                    <TournamentCard
                                        key={tournament._id}
                                        tournament={tournament}
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Completed */}
                    <section className="mx-auto max-w-7xl px-6 pb-24">
                        <div className="mb-10 flex items-center gap-3">
                            <HistoryRoundedIcon className="text-blue-400" />
                            <h2 className="text-3xl font-bold">
                                Completed Tournaments
                            </h2>
                        </div>

                        {completed.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center text-slate-400">
                                No Completed Tournaments
                            </div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {completed.map((tournament) => (
                                    <TournamentCard
                                        key={tournament._id}
                                        tournament={tournament}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                </>
            )}
        </div>
    );
};

export default ExploreTournament;