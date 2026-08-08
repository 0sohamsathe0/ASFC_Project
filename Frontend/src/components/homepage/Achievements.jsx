import { motion } from "framer-motion";
import {
    Trophy,
    Medal,
    Globe2,
    Flag,
    ArrowUpRight,
} from "lucide-react";
import fencing from "../../assets/fencing.avif";

const achievements = [
    {
        id: 1,
        icon: Trophy,
        category: "Khelo India Youth Games",
        title: "3 Gold Medalists",
        description:
            "ASFC players have achieved gold medals at the Khelo India Youth Games.",
        image: fencing,
        size: "large",
    },
    {
        id: 2,
        icon: Medal,
        category: "Khelo India University Games",
        title: "2-Time Participation",
        description:
            "Our players have represented at the Khelo India University Games.",
        image: fencing,
        size: "normal",
    },
    {
        id: 3,
        icon: Globe2,
        category: "International",
        title: "International Participants",
        description:
            "ASFC players have represented the club at international competitions.",
        image: fencing,
        size: "normal",
    },
    {
        id: 4,
        icon: Medal,
        category: "National Level",
        title: "National Medalists",
        description:
            "Our athletes have earned medals at national-level fencing competitions.",
        image: fencing,
        size: "normal",
    },
    {
        id: 5,
        icon: Flag,
        category: "State Level",
        title: "State Champions",
        description:
            "ASFC players have achieved championship-level results at state competitions.",
        image: fencing,
        size: "normal",
    },
];

export default function Achievements() {
    return (
        <section className="relative overflow-hidden bg-[#020617] py-16 sm:py-20 lg:py-24">      {/* Ambient Background Glow */}
            <div className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />

            <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto max-w-3xl text-center"
                >
                    <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold text-blue-400">
                        <Trophy size={14} />
                        <span>Our Achievements</span>
                    </div>

                    <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                        Built Through{" "}
                        <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                            Dedication
                        </span>
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
                        From state championships to national and international
                        competitions, our players continue to represent All Star Fencing
                        Club with determination and excellence.
                    </p>
                </motion.div>

                {/* Achievement Grid */}
                <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">

                    {/* Featured Achievement */}
                    {achievements
                        .filter((achievement) => achievement.size === "large")
                        .map((achievement, index) => {
                            const Icon = achievement.icon;

                            return (
                                <motion.article
                                    key={achievement.id}
                                    initial={{ opacity: 0, y: 25 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.15 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: index * 0.08,
                                    }}
                                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 shadow-2xl shadow-black/30 sm:col-span-2 lg:row-span-2"
                                >
                                    <div className="relative min-h-[420px] h-full">

                                        <img
                                            src={achievement.image}
                                            alt={`${achievement.category} - ${achievement.title}`}
                                            loading="lazy"
                                            decoding="async"
                                            className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                                        />

                                        {/* Dark Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/65 to-[#020617]/10" />

                                        {/* Blue Ambient Glow */}
                                        <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-blue-600/20 blur-[80px]" />

                                        {/* Category */}
                                        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-xs font-semibold text-slate-200 backdrop-blur-xl">
                                            <Icon size={14} className="text-blue-400" />
                                            {achievement.category}
                                        </div>

                                        {/* Content */}
                                        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                                            <div className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                                                {achievement.title}
                                            </div>

                                            <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-300">
                                                {achievement.description}
                                            </p>

                                            <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400">
                                                <span>ASFC Achievement</span>
                                                <ArrowUpRight size={14} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.article>
                            );
                        })}

                    {/* Regular Achievements */}
                    {achievements
                        .filter((achievement) => achievement.size !== "large")
                        .map((achievement, index) => {
                            const Icon = achievement.icon;

                            return (
                                <motion.article
                                    key={achievement.id}
                                    initial={{ opacity: 0, y: 25 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.15 }}
                                    transition={{
                                        duration: 0.45,
                                        delay: index * 0.08,
                                    }}
                                    className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 shadow-xl shadow-black/20 transition hover:border-blue-500/20"
                                >
                                    {/* Image */}
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={achievement.image}
                                            alt={`${achievement.category} - ${achievement.title}`}
                                            loading="lazy"
                                            decoding="async"
                                            className="h-full w-full object-cover opacity-85 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                                        />

                                        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/30 to-transparent" />

                                        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-slate-200 backdrop-blur-xl">
                                            <Icon size={12} className="text-blue-400" />
                                            {achievement.category}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <h3 className="text-xl font-black tracking-tight text-white">
                                            {achievement.title}
                                        </h3>

                                        <p className="mt-2 text-xs leading-relaxed text-slate-400">
                                            {achievement.description}
                                        </p>
                                    </div>
                                </motion.article>
                            );
                        })}
                </div>
            </div>
        </section>
    );
}