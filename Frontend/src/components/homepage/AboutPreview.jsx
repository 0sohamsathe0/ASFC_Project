import { ArrowRight, ShieldCheck, Target, Award } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutPreview() {
  return (
    <section className="relative bg-[#020617] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Glass Container */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 p-6 sm:p-10 backdrop-blur-xl">

          {/* Subtle Ambient Light */}
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-blue-600/15 blur-[100px] pointer-events-none" />

          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">

            {/* Left Column: Core Message */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                <span>About All Star Fencing Club</span>
              </div>

              <h2 className="mt-4 text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Solapur’s Premier Destination for{" "}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Competitive Fencing
                </span>
              </h2>

              <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300">
                All Star Fencing Club is one of Solapur's leading fencing academies, dedicated to developing athletes through professional coaching, structured training, and competitive opportunities. From absolute beginners to national-level champions, we instill discipline, tactical focus, and confidence in every athlete.
              </p>

              <div className="mt-6">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition group"
                >
                  <span>Learn More About Our Academy</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>

            {/* Right Column: Key Trust Highlights for Parents */}
            <div className="lg:col-span-5 grid grid-cols-1 gap-3 sm:gap-4">
              <div className="flex items-start gap-3 rounded-2xl border border-white/5 bg-slate-950/50 p-4">
                <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-400 shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Certified Coaching</h3>
                  <p className="mt-0.5 text-xs text-slate-400">Safe, professional environment guided by experienced mentors.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/5 bg-slate-950/50 p-4">
                <div className="rounded-xl bg-cyan-500/10 p-2.5 text-cyan-400 shrink-0">
                  <Target size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Structured Pathways</h3>
                  <p className="mt-0.5 text-xs text-slate-400">Custom training tracks from grassroots to national tournaments.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/5 bg-slate-950/50 p-4">
                <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-400 shrink-0">
                  <Award size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Proven Results</h3>
                  <p className="mt-0.5 text-xs text-slate-400">Consistently producing state and national medalists.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}