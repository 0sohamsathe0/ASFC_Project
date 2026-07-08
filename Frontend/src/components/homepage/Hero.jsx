import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  ChevronRight,
  Medal,
  Trophy,
  Users,
} from "lucide-react";

import fencing from '../../assets/fencing.jpg'

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#020617]">

      {/* ================= Background ================= */}

      <div className="absolute inset-0">

        <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#07142E] to-[#0F2E63]" />

        {/* Grid */}

        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:70px_70px]" />

        {/* Glow */}

        <div className="absolute -left-52 top-20 h-[450px] w-[450px] rounded-full bg-blue-600 blur-[170px] opacity-20" />

        <div className="absolute right-0 bottom-0 h-[550px] w-[550px] rounded-full bg-cyan-500 blur-[170px] opacity-20" />

      </div>

      {/* Floating Shapes */}

      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
        className="absolute left-20 top-56 h-28 w-28 rotate-45 border border-blue-500/30"
      />

      <motion.div
        animate={{ y: [0, 30, 0] }}
        transition={{
          duration: 7,
          repeat: Infinity,
        }}
        className="absolute right-32 bottom-32 h-10 w-10 rounded-full bg-blue-500/30"
      />

      {/* ================= Hero ================= */}

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6">

        <div className="grid w-full items-center gap-20 lg:grid-cols-2">

          {/* LEFT */}

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: .8 }}
          >

            <span className="tracking-[10px] uppercase text-blue-400 font-semibold">

              ALL STAR FENCING CLUB

            </span>

            <h1 className="mt-8 text-6xl font-black leading-none text-white lg:text-8xl">

              Where

              <br />

              <span className="text-blue-500">

                Champions

              </span>

              <br />

              Are Forged

            </h1>

            <p className="mt-10 max-w-xl text-xl leading-9 text-slate-300">

              Train with professional coaches, compete in district,
              state and national tournaments, and become part of a
              modern fencing community built for champions.

            </p>

            <div className="mt-12 flex flex-wrap gap-5">

              <button className="group flex items-center gap-3 rounded-full bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700">

                Register Now

                <ArrowRight
                  size={20}
                  className="transition group-hover:translate-x-1"
                />

              </button>

              <button className="rounded-full border border-white/20 px-8 py-4 text-white transition hover:bg-white/10">

                Explore Tournaments

              </button>

            </div>

            {/* Mini Stats */}

            <div className="mt-16 grid grid-cols-3 gap-8">

              <div>

                <h2 className="text-4xl font-black text-white">

                  500+

                </h2>

                <p className="mt-2 text-slate-400">

                  Registered Players

                </p>

              </div>

              <div>

                <h2 className="text-4xl font-black text-white">

                  40+

                </h2>

                <p className="mt-2 text-slate-400">

                  Medals

                </p>

              </div>

              <div>

                <h2 className="text-4xl font-black text-white">

                  20+

                </h2>

                <p className="mt-2 text-slate-400">

                  Events

                </p>

              </div>

            </div>

          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative flex items-center justify-center"
          >

            {/* Background Glow */}

            <div className="absolute w-[650px] h-[650px] rounded-full bg-blue-600/20 blur-[180px]" />

            {/* Decorative Ring */}

            <div className="absolute w-[520px] h-[520px] rounded-full border border-blue-500/10" />

            {/* Main Image */}

            <div className="relative z-10 overflow-hidden rounded-[32px]">

              <img
                src={fencing}
                alt="All Star Fencing Club"
                className="w-[700px] lg:w-[760px] object-cover rounded-[32px] shadow-[0_35px_80px_rgba(0,0,0,.45)]"
              />

              {/* Dark Overlay */}

              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

            </div>

            {/* Decorative Dot */}

            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full border border-blue-500/20" />

            <div className="absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-blue-500/20 blur-md" />

          </motion.div>
        </div>

      </div>

      {/* ================= Scroll Indicator ================= */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          y: [0, 12, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
      >

        <span className="text-xs uppercase tracking-[6px] text-slate-400 mb-4">

          Scroll

        </span>

        <div className="h-14 w-8 rounded-full border-2 border-white/30 flex justify-center">

          <motion.div
            animate={{
              y: [6, 24, 6],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.8,
            }}
            className="mt-2 h-3 w-3 rounded-full bg-blue-500"
          />

        </div>

      </motion.div>

      {/* ================= Bottom Fade ================= */}

      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#020617] to-transparent" />

    </section>
  );
}