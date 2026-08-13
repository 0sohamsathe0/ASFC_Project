import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Dumbbell,
    Medal,
    ShieldCheck,
    Users,
} from "lucide-react";

import KIYG from "../../assets/KIYG-Gold.avif";
import KIUG from "../../assets/KIUG.avif";
import NavyOpen from "../../assets/Navy-Open-2025.avif";
import SchoolNational from "../../assets/School-Nation.avif";
import StateChampions from "../../assets/State-Champions.avif";

const experiences = [
    {
        id: 1,
        category: "TRAINING",
        title: "Discipline Starts With Practice",
        description:
            "Every session helps young athletes develop technique, focus, fitness and the discipline to keep improving.",
        image: NavyOpen,
        icon: Dumbbell,
        value: "DISCIPLINE",
        valueText: "Consistent practice builds strong habits.",
    },
    {
        id: 2,
        category: "COMPETITION",
        title: "Confidence Beyond the Piste",
        description:
            "Competitions teach athletes how to handle pressure, make decisions and believe in their preparation.",
        image: StateChampions,
        icon: ShieldCheck,
        value: "CONFIDENCE",
        valueText: "Learn to perform when it matters.",
    },
    {
        id: 3,
        category: "TEAM",
        title: "Growing Together",
        description:
            "Fencing may be an individual sport, but progress happens in a team environment built on support and respect.",
        image: SchoolNational,
        icon: Users,
        value: "TEAMWORK",
        valueText: "Train together. Support each other.",
    },
    {
        id: 4,
        category: "ACHIEVEMENT",
        title: "Hard Work Becomes Achievement",
        description:
            "From state championships to national competitions, our athletes get opportunities to turn preparation into performance.",
        image: KIYG,
        icon: Medal,
        value: "ACHIEVEMENT",
        valueText: "Every milestone starts with the work.",
    },
    {
        id: 5,
        category: "JOURNEY",
        title: "Opportunities To Go Further",
        description:
            "The journey can lead from local competitions to state, national and university-level opportunities.",
        image: KIUG,
        icon: ArrowRight,
        value: "GROWTH",
        valueText: "Keep learning. Keep competing. Keep growing.",
    },
];

const AUTO_PLAY_TIME = 5500;

const ClubExperience = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const activeExperience = experiences[activeIndex];
    const ActiveIcon = activeExperience.icon;

    const nextSlide = () => {
        setActiveIndex((current) => (current + 1) % experiences.length);
    };

    const previousSlide = () => {
        setActiveIndex(
            (current) =>
                (current - 1 + experiences.length) % experiences.length
        );
    };

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % experiences.length);
        }, AUTO_PLAY_TIME);

        return () => clearInterval(interval);
    }, [isPaused]);

    return (
        <section className="relative overflow-hidden bg-[#020617] py-14 sm:py-20 lg:py-24">
            {/* Background atmosphere */}
            <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-600/10 blur-[110px]" />

            <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-cyan-500/5 blur-[100px]" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* =====================================================
                    HEADER
                ====================================================== */}

                <div className="mx-auto max-w-3xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1.5"
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />

                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-300 sm:text-xs">
                            The ASFC Experience
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, delay: 0.05 }}
                        className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl"
                    >
                        More Than{" "}
                        <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                            Fencing
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base"
                    >
                        Every practice, competition and challenge gives young
                        athletes another opportunity to become stronger,
                        more disciplined and more confident.
                    </motion.p>
                </div>

                {/* =====================================================
                    MAIN EXPERIENCE CARD
                ====================================================== */}

                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.65, delay: 0.1 }}
                    className="mx-auto mt-10 max-w-6xl"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 shadow-2xl shadow-black/20 backdrop-blur-xl">

                        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">

                            {/* =================================================
                                IMAGE
                            ================================================== */}

                            <div className="relative min-h-[300px] overflow-hidden sm:min-h-[380px] lg:min-h-[430px]">

                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={activeExperience.id}
                                        src={activeExperience.image}
                                        alt={activeExperience.title}
                                        initial={{
                                            opacity: 0,
                                            scale: 1.04,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                        }}
                                        exit={{
                                            opacity: 0,
                                        }}
                                        transition={{
                                            duration: 0.65,
                                            ease: "easeOut",
                                        }}
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                </AnimatePresence>

                                {/* Image overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#020617]" />

                                {/* Blue glow */}
                                <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-blue-600/20 blur-[80px]" />

                                {/* Category */}
                                <div className="absolute left-5 top-5 sm:left-7 sm:top-7">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeExperience.category}
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5 text-[10px] font-bold tracking-[0.16em] text-blue-300 backdrop-blur-xl"
                                        >
                                            {activeExperience.category}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                {/* Mobile arrows */}
                                <div className="absolute right-4 top-5 flex gap-2 lg:hidden">
                                    <button
                                        type="button"
                                        onClick={previousSlide}
                                        aria-label="Previous experience"
                                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-950/60 text-white backdrop-blur-xl transition hover:border-blue-500/30 hover:text-blue-400"
                                    >
                                        <ChevronLeft size={17} />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={nextSlide}
                                        aria-label="Next experience"
                                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-950/60 text-white backdrop-blur-xl transition hover:border-blue-500/30 hover:text-blue-400"
                                    >
                                        <ChevronRight size={17} />
                                    </button>
                                </div>

                                {/* Mobile image caption */}
                                <div className="absolute bottom-5 left-5 right-5 lg:hidden">
                                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-blue-300">
                                        {activeExperience.value}
                                    </p>
                                </div>
                            </div>

                            {/* =================================================
                                CONTENT
                            ================================================== */}

                            <div className="relative flex flex-col justify-center p-6 sm:p-8 lg:p-10">

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeExperience.id}
                                        initial={{
                                            opacity: 0,
                                            x: 15,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            x: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            x: -15,
                                        }}
                                        transition={{
                                            duration: 0.4,
                                        }}
                                    >
                                        {/* Icon */}
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                                            <ActiveIcon size={21} />
                                        </div>

                                        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">
                                            {activeExperience.category}
                                        </p>

                                        <h3 className="mt-2 text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl">
                                            {activeExperience.title}
                                        </h3>

                                        <p className="mt-4 text-sm leading-6 text-slate-400">
                                            {activeExperience.description}
                                        </p>

                                        {/* Parent value */}
                                        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                                                What your child develops
                                            </p>

                                            <div className="mt-2 flex items-center justify-between gap-4">
                                                <span className="text-sm font-bold text-white">
                                                    {activeExperience.value}
                                                </span>

                                                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-lg shadow-blue-500/50" />
                                            </div>

                                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                                {activeExperience.valueText}
                                            </p>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Desktop navigation */}
                                <div className="mt-7 hidden items-center justify-between lg:flex">
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={previousSlide}
                                            aria-label="Previous experience"
                                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400"
                                        >
                                            <ChevronLeft size={17} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={nextSlide}
                                            aria-label="Next experience"
                                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400"
                                        >
                                            <ChevronRight size={17} />
                                        </button>
                                    </div>

                                    <span className="text-xs font-medium text-slate-600">
                                        {String(activeIndex + 1).padStart(
                                            2,
                                            "0"
                                        )}{" "}
                                        /{" "}
                                        {String(experiences.length).padStart(
                                            2,
                                            "0"
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* =================================================
                            ACTIVITY SELECTOR
                        ================================================== */}

                        <div className="border-t border-white/10 bg-slate-950/50 p-2 sm:p-3">
                            <div className="grid grid-cols-5 gap-1 sm:gap-2">
                                {experiences.map((experience, index) => {
                                    const Icon = experience.icon;
                                    const isActive = index === activeIndex;

                                    return (
                                        <button
                                            key={experience.id}
                                            type="button"
                                            onClick={() =>
                                                setActiveIndex(index)
                                            }
                                            className={`group relative rounded-xl px-2 py-3 transition-all duration-300 sm:px-3 ${
                                                isActive
                                                    ? "bg-blue-500/10"
                                                    : "hover:bg-white/[0.03]"
                                            }`}
                                        >
                                            {/* Active indicator */}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeExperience"
                                                    className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-blue-500"
                                                />
                                            )}

                                            <Icon
                                                size={16}
                                                className={`mx-auto transition-colors ${
                                                    isActive
                                                        ? "text-blue-400"
                                                        : "text-slate-600 group-hover:text-slate-400"
                                                }`}
                                            />

                                            <span
                                                className={`mt-1.5 block truncate text-[8px] font-bold uppercase tracking-[0.08em] sm:text-[10px] ${
                                                    isActive
                                                        ? "text-blue-300"
                                                        : "text-slate-600 group-hover:text-slate-400"
                                                }`}
                                            >
                                                {experience.category}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* =====================================================
                    BOTTOM MESSAGE
                ====================================================== */}

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mx-auto mt-8 max-w-2xl text-center"
                >
                    <p className="text-sm font-semibold text-slate-300 sm:text-base">
                        Give your child an environment where{" "}
                        <span className="text-blue-400">
                            effort becomes confidence.
                        </span>
                    </p>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                        Train with purpose. Compete with confidence. Grow with
                        the team.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default ClubExperience;