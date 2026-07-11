import React from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Medal,
  Award,
  Target,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const achievements = [
  {
    icon: Trophy,
    title: "National Medalists",
    description:
      "Our athletes have proudly represented ASFC in national championships and secured podium finishes.",
  },
  {
    icon: Medal,
    title: "International Exposure",
    description:
      "Players have represented India in international fencing championships and invitational events.",
  },
  {
    icon: Award,
    title: "University Champions",
    description:
      "Multiple university athletes continue to bring medals and recognition to the club.",
  },
  {
    icon: Target,
    title: "Competitive Excellence",
    description:
      "Developing disciplined athletes capable of competing at every level.",
  },
];

export default function About() {
  return (
    <section className="relative overflow-hidden bg-[#020617] pt-16 md:pt-20 lg:pt-24 pb-20 md:pb-24 lg:pb-28">

      {/* Background */}

      <div className="absolute inset-0">

        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950" />

        <div className="absolute -top-40 -left-40 w-[450px] h-[450px] rounded-full bg-blue-600 blur-[170px] opacity-20" />

        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-cyan-500 blur-[170px] opacity-20" />

      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* IMAGE */}

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >

            <div className="relative">

              <img
                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900"
                alt=""
                className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl rounded-[28px] md:rounded-[35px] object-cover shadow-2xl"
              />

              <div className="absolute -bottom-5 left-5 sm:-bottom-7 sm:left-7 md:-bottom-8 md:left-8 bg-blue-600 px-5 py-4 sm:px-7 sm:py-5 md:px-8 md:py-6 rounded-2xl md:rounded-3xl shadow-xl">

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">

                  8+

                </h2>

                <p className="text-xs sm:text-sm md:text-base text-white/80">

                  Years of Excellence

                </p>

              </div>

            </div>

          </motion.div>

          {/* CONTENT */}

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >

            <span className="uppercase tracking-[4px] sm:tracking-[6px] lg:tracking-[8px] text-blue-400 font-semibold text-xs sm:text-sm">

              About ASFC

            </span>

            <h1 className="mt-5 sm:mt-6 text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">

              Building

              <br />

              Champions

              <span className="text-blue-500">

                {" "}Beyond

              </span>

              <br />

              <span className="text-blue-500">

                Competition

              </span>

            </h1>

            <p className="mt-6 sm:mt-8 text-base sm:text-lg text-slate-400 leading-8 sm:leading-9">

              All Star Fencing Club is dedicated to nurturing talented
              athletes through professional coaching, structured
              training, competitive tournaments and athlete-focused
              development. We strive to create disciplined fencers who
              excel at district, state, national and international
              competitions.

            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mt-8 sm:mt-10">

              <div className="flex items-center gap-3">

                <CheckCircle2
                  size={20}
                  className="text-blue-400 flex-shrink-0"
                />

                <span className="text-white">

                  Professional Coaching

                </span>

              </div>

              <div className="flex items-center gap-3">

                <CheckCircle2
                  size={20}
                  className="text-blue-400 flex-shrink-0"
                />

                <span className="text-white">

                  Athlete Development

                </span>

              </div>

              <div className="flex items-center gap-3">

                <CheckCircle2
                  size={20}
                  className="text-blue-400 flex-shrink-0"
                />

                <span className="text-white">

                  National Exposure

                </span>

              </div>

              <div className="flex items-center gap-3">

                <CheckCircle2
                  size={20}
                  className="text-blue-400 flex-shrink-0"
                />

                <span className="text-white">

                  Digital Management

                </span>

              </div>

            </div>

            <button className="mt-10 sm:mt-12 w-full sm:w-fit justify-center bg-blue-600 hover:bg-blue-700 duration-300 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full flex items-center gap-3 text-white font-semibold">

              Learn More

              <ArrowRight size={20} />

            </button>

          </motion.div>

        </div>
                {/* ACHIEVEMENT CARDS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-20 sm:mt-24 lg:mt-28">

          {achievements.map((item, index) => {

            const Icon = item.icon;

            return (

              <motion.div
                key={index}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8"
              >

                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center">

                  <Icon
                    size={26}
                    className="text-blue-400 sm:w-[30px] sm:h-[30px]"
                  />

                </div>

                <h3 className="mt-5 sm:mt-6 text-lg sm:text-xl font-bold text-white">

                  {item.title}

                </h3>

                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-400 leading-7">

                  {item.description}

                </p>

              </motion.div>

            );

          })}

        </div>

      </div>

    </section>
  );
}