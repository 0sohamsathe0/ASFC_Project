import { motion } from "framer-motion";
import { ArrowRight, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import fencing from "../../assets/fencing.avif";

export default function Hero() {

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] w-full flex-col justify-between overflow-hidden bg-[#020617] pt-15 pb-6 lg:justify-center lg:py-12">
      {/* Background Glow FX */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#08152e] to-[#020617]" />
        <div className="absolute top-0 right-0 h-[280px] w-[280px] sm:h-[450px] sm:w-[450px] rounded-full bg-blue-600/20 blur-[100px]" />
        <div className="absolute bottom-10 left-0 h-[220px] w-[220px] rounded-full bg-cyan-500/15 blur-[90px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid flex-1 w-full gap-4 sm:gap-6 items-center lg:grid-cols-2 lg:gap-12">

          {/* CONTENT SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start text-left"
          >
            {/* Top Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-[11px] font-bold tracking-wide uppercase text-blue-400 backdrop-blur-md">
              <Trophy size={13} className="text-blue-400" />
              <span>ALL STAR FENCING CLUB</span>
            </div>

            {/* Headline */}
            <h1 className="mt-3.5 text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
              Train, Compete,
              <pre className="lg:hidden"></pre>
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                Fence In Solpaur.
              </span>
            </h1>

            <p className="mt-3 text-xs sm:text-base text-slate-300 max-w-md leading-relaxed">
              All Star Fencing Club offers structured fencing training and coaching in
              Solapur, Maharashtra, helping players build their skills and prepare for
              competition.
            </p>

            {/* Polished Full-Width / Stacked Button Group */}
            <div className="mt-6 flex w-full flex-col gap-3 sm:max-w-md">
              <div className="flex flex-col sm:flex-row gap-2.5 w-full">
                <Link
                  to="/player/register"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-3.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition active:scale-[0.97]"
                >
                  Register Now
                </Link>

                <Link
                  to="/explore-tournament"
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.05] px-5 py-3.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-white/10 active:scale-[0.97]"
                >
                  Tournaments
                </Link>
              </div>

              {/* Login Subtext */}
              <p className="text-center sm:text-left text-xs text-slate-400 mt-1">
                Already registered?{" "}
                <Link
                  to="/player/login"
                  className="font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-2"
                >
                  Log In
                </Link>
              </p>
            </div>
          </motion.div>

          {/* VISUAL HERO CARD WITH INTEGRATED STATS */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative mt-1 lg:mt-0"
          >
            {/* Main Action Image Box */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 shadow-2xl">
              <img
                src={fencing}
                alt="Fencing Action"
                fetchPriority="high"
                decoding="async"
                className="h-56 sm:h-80 lg:h-[440px] w-full object-cover object-top"
              />

              {/* Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />

              {/* Live Badge */}
              <div className="absolute top-3 right-3 rounded-lg border border-white/10 bg-black/50 px-2.5 py-1 text-[10px] font-medium text-slate-300 backdrop-blur-md">
                Fencing A Olympic Sport
              </div>

              {/* Integrated Bottom Stats Bar */}
              <div className="absolute bottom-0 inset-x-0 p-3.5 bg-slate-950/85 backdrop-blur-md border-t border-white/10">
                <div className="grid grid-cols-3 divide-x divide-white/10 text-center">
                  <div>
                    <div className="text-base sm:text-2xl font-black text-white">350+</div>
                    <div className="text-[9px] uppercase tracking-wider font-semibold text-slate-400">Players</div>
                  </div>
                  <div>
                    <div className="text-base sm:text-2xl font-black text-white">40+</div>
                    <div className="text-[9px] uppercase tracking-wider font-semibold text-slate-400">National Medals</div>
                  </div>
                  <div>
                    <div className="text-base sm:text-2xl font-black text-white">15+</div>
                    <div className="text-[9px] uppercase tracking-wider font-semibold text-slate-400">Events</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}