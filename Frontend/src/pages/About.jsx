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
    <section className="relative overflow-hidden bg-[#020617] pt-20 pb-28">

      {/* Background */}

      <div className="absolute inset-0">

        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950" />

        <div className="absolute -top-40 -left-40 w-[450px] h-[450px] rounded-full bg-blue-600 blur-[170px] opacity-20" />

        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-cyan-500 blur-[170px] opacity-20" />

      </div>

      <div className="relative max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* IMAGE */}

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: .8 }}
            className="flex justify-center"
          >

            <div className="relative">

              <img
                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900"
                alt=""
                className="w-full max-w-md lg:max-w-xl rounded-[35px] object-cover shadow-2xl"
              />

              <div className="absolute -bottom-8 left-8 bg-blue-600 px-8 py-6 rounded-3xl shadow-xl">

                <h2 className="text-5xl font-black text-white">

                  8+

                </h2>

                <p className="text-white/80">

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
            transition={{ duration: .8 }}
          >

            <span className="uppercase tracking-[8px] text-blue-400 font-semibold">

              About ASFC

            </span>

            <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight mt-6">

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

            <p className="mt-8 text-slate-400 text-lg leading-9">

              All Star Fencing Club is dedicated to nurturing talented
              athletes through professional coaching, structured
              training, competitive tournaments and athlete-focused
              development. We strive to create disciplined fencers who
              excel at district, state, national and international
              competitions.

            </p>

            <div className="grid sm:grid-cols-2 gap-5 mt-10">

              <div className="flex items-center gap-3">

                <CheckCircle2 className="text-blue-400" />

                <span className="text-white">

                  Professional Coaching

                </span>

              </div>

              <div className="flex items-center gap-3">

                <CheckCircle2 className="text-blue-400" />

                <span className="text-white">

                  Athlete Development

                </span>

              </div>

              <div className="flex items-center gap-3">

                <CheckCircle2 className="text-blue-400" />

                <span className="text-white">

                  National Exposure

                </span>

              </div>

              <div className="flex items-center gap-3">

                <CheckCircle2 className="text-blue-400" />

                <span className="text-white">

                  Digital Management

                </span>

              </div>

            </div>

            <button className="mt-12 bg-blue-600 hover:bg-blue-700 duration-300 px-8 py-4 rounded-full flex items-center gap-3 text-white font-semibold">

              Learn More

              <ArrowRight size={20} />

            </button>

          </motion.div>

        </div>

        {/* ACHIEVEMENT CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-28">

          {achievements.map((item, index) => {

            const Icon = item.icon;

            return (

              <motion.div
                key={index}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
              >

                <div className="w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center">

                  <Icon
                    size={30}
                    className="text-blue-400"
                  />

                </div>

                <h3 className="text-white text-xl font-bold mt-6">

                  {item.title}

                </h3>

                <p className="text-slate-400 mt-4 leading-7">

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