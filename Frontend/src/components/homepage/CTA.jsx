import { ArrowRight, MessageSquare, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="relative bg-[#020617] py-12 sm:py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main CTA Box */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-blue-950/40 via-slate-900/60 to-slate-950/80 px-6 py-10 sm:px-12 sm:py-16 text-center shadow-2xl backdrop-blur-xl">
          
          {/* Subtle Dynamic Grids & Lighting */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-64 w-80 rounded-full bg-blue-600/25 blur-[100px] pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-3xl">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-400">
              <Sparkles size={12} />
              <span>Join The Journey</span>
            </div>

            {/* Headline */}
            <h2 className="mt-4 text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Ready To Forge Your Path To{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                Excellence?
              </span>
            </h2>

            {/* Subtitle */}
            <p className="mx-auto mt-3.5 max-w-xl text-xs sm:text-base leading-relaxed text-slate-300">
              Begin your fencing journey with professional coaching, state-of-the-art training, and a community built around discipline and growth.
            </p>

            {/* Action Buttons */}
            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto sm:max-w-none">
              <button
                onClick={() => navigate("/player/register")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:from-blue-500 hover:to-blue-400 active:scale-[0.98]"
              >
                Register Now
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => navigate("/contact")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-6 py-3.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-white/10 active:scale-[0.98]"
              >
                <MessageSquare size={16} className="text-slate-400" />
                Contact Us
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}