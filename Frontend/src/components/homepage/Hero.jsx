import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import fencing from "../../assets/fencing.jpg";

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#020617]">

      {/* ================= Background ================= */}

      <div className="absolute inset-0">

        <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#07142E] to-[#0F2E63]" />

        {/* Grid */}

        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:70px_70px]" />

        {/* Glow */}

        <div className="absolute -left-40 top-20 h-[320px] w-[320px] sm:h-[420px] sm:w-[420px] lg:h-[450px] lg:w-[450px] rounded-full bg-blue-600 blur-[170px] opacity-20" />

        <div className="absolute right-0 bottom-0 h-[350px] w-[350px] sm:h-[450px] sm:w-[450px] lg:h-[550px] lg:w-[550px] rounded-full bg-cyan-500 blur-[170px] opacity-20" />

      </div>

      {/* Floating Shapes */}

      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
        className="hidden lg:block absolute left-20 top-56 h-28 w-28 rotate-45 border border-blue-500/30"
      />

      <motion.div
        animate={{ y: [0, 30, 0] }}
        transition={{
          duration: 7,
          repeat: Infinity,
        }}
        className="hidden lg:block absolute right-32 bottom-32 h-10 w-10 rounded-full bg-blue-500/30"
      />

      {/* ================= Hero ================= */}

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-center px-5 sm:px-6 lg:px-8 py-12">

        <div className="grid w-full items-center gap-14 lg:gap-20 lg:grid-cols-2">

          {/* LEFT */}

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >

            <span className="text-xs sm:text-sm font-semibold uppercase tracking-[4px] sm:tracking-[6px] lg:tracking-[10px] text-blue-400">

              ALL STAR FENCING CLUB

            </span>

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-black leading-tight text-white">

              Where

              <br />

              <span className="text-blue-500">

                Champions

              </span>

              <br />

              Are Forged

            </h1>

            <p className="mx-auto lg:mx-0 mt-8 max-w-xl text-base sm:text-lg lg:text-xl leading-8 text-slate-300">

              Train with professional coaches, compete in district,
              state and national tournaments, and become part of a
              modern fencing community built for champions.

            </p>

            {/* CTA Buttons */}

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">

              <button className="group flex w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700">

                Register Now

                <ArrowRight
                  size={20}
                  className="transition group-hover:translate-x-1"
                />

              </button>

              <button className="w-full sm:w-auto rounded-full border border-white/20 px-8 py-4 text-white transition hover:bg-white/10">

                Explore Tournaments

              </button>

            </div>

            {/* Statistics */}

            <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center lg:text-left">

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
            className="relative mt-10 lg:mt-0 flex items-center justify-center"
          >

            {/* Background Glow */}

            <div className="absolute w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] lg:w-[650px] lg:h-[650px] rounded-full bg-blue-600/20 blur-[180px]" />

            {/* Decorative Ring */}

            <div className="absolute w-[260px] h-[260px] sm:w-[400px] sm:h-[400px] lg:w-[520px] lg:h-[520px] rounded-full border border-blue-500/10" />

            {/* Main Image */}

            <div className="relative z-10 overflow-hidden rounded-[24px] lg:rounded-[32px]">

              <img
                src={fencing}
                alt="All Star Fencing Club"
                className="w-full max-w-sm sm:max-w-lg lg:max-w-2xl object-cover rounded-[24px] lg:rounded-[32px] shadow-[0_35px_80px_rgba(0,0,0,.45)]"
              />

              {/* Dark Overlay */}

              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

            </div>

            {/* Decorative Elements */}

            <div className="hidden lg:block absolute -top-6 -right-6 w-28 h-28 rounded-full border border-blue-500/20" />

            <div className="hidden lg:block absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-blue-500/20 blur-md" />

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
        className="hidden lg:flex absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex-col items-center"
      >

        <span className="mb-4 text-xs uppercase tracking-[6px] text-slate-400">

          Scroll

        </span>

        <div className="flex h-14 w-8 justify-center rounded-full border-2 border-white/30">

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

      <div className="absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-[#020617] to-transparent" />

    </section>
  );
}