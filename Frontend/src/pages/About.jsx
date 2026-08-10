import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function About() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": "https://all-star-fencing-club.vercel.app/about#about",
    url: "https://all-star-fencing-club.vercel.app/about",
    name: "About All Star Fencing Club",
    description:
      "Learn about All Star Fencing Club, a fencing club in Solapur, Maharashtra, providing structured fencing training for athletes from U10 through Open and supporting competitive development from district to international levels.",

    mainEntity: {
      "@type": "SportsClub",
      "@id": "https://all-star-fencing-club.vercel.app/#organization",
      name: "All Star Fencing Club",
      url: "https://all-star-fencing-club.vercel.app/",
      sport: "Fencing",

      description:
        "All Star Fencing Club is a fencing club based in Solapur, Maharashtra, focused on developing athletes through fencing, building physical fitness, strengthening character, and instilling discipline.",

      address: {
        "@type": "PostalAddress",
        addressLocality: "Solapur",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },

      areaServed: {
        "@type": "City",
        name: "Solapur",
      },

      memberOf: {
        "@type": "SportsOrganization",
        name: "[FENCING ASSOCIATION NAME]",
      },
    },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950" />

          <div className="absolute -top-40 -left-40 w-[450px] h-[450px] rounded-full bg-blue-600 blur-[170px] opacity-20" />

          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-cyan-500 blur-[170px] opacity-20" />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-12">
          <div className="max-w-4xl">
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

              <h1 className="mt-5 sm:mt-6 text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                Building
                <br />
                Champions
                <span className="text-blue-500"> Beyond</span>
                <br />
                <span className="text-blue-500">Competition</span>
              </h1>

              <p className="mt-5 sm:mt-7 text-sm sm:text-base lg:text-lg leading-7 text-slate-400">
                All Star Fencing Club is a fencing club based in{" "}
                <span className="text-white font-medium">
                  Solapur, Maharashtra
                </span>
                , focused on helping athletes develop their fencing skills
                through structured training, disciplined practice, and
                competitive opportunities.
              </p>

              <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg leading-7 text-slate-400">
                Founded in{" "}
                <span className="text-white font-medium">2019</span>
                ,
                <br />
                ASFC was
                established with the aim of{" "}
                <span className="text-white font-medium">
                  developing
                  athletes through fencing, building physical fitness, strengthening
                  character, and instilling discipline — creating individuals prepared
                  for both competition and life.
                </span>
              </p>

              <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg leading-7 text-slate-400">
                The club provides fencing training across all age categories, from {" "}
                <span className="text-white font-medium">
                  U10 through Open
                </span>, supporting athletes at different stages of their development
                — from building strong fundamentals to preparing for competitive fencing.
              </p>

              {/* Key points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mt-8 sm:mt-10">

                <div className="flex items-center gap-3">
                  <CheckCircle2
                    size={20}
                    className="text-blue-400 shrink-0"
                  />

                  <span className="text-white">
                    Structured Training
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2
                    size={20}
                    className="text-blue-400 shrink-0"
                  />

                  <span className="text-white">
                    Technical Development
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2
                    size={20}
                    className="text-blue-400 shrink-0"
                  />

                  <span className="text-white">
                    Competition Preparation
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2
                    size={20}
                    className="text-blue-400 shrink-0"
                  />

                  <span className="text-white">
                    Athlete Development
                  </span>
                </div>

              </div>
            </motion.div>
          </div>
          <div className="flex items-center gap-4 my-14 sm:my-16 lg:my-20">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />

            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]" />

            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
          </div>

          {/* OUR APPROACH */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-14 sm:mt-16 lg:mt-20"
          >
            {/* Section Heading */}
            <div className="max-w-3xl">
              <span className="uppercase tracking-[4px] sm:tracking-[6px] text-blue-400 font-semibold text-xs sm:text-sm">
                Our Approach
              </span>

              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                More Than
                <span className="text-blue-500"> Fencing</span>
              </h2>

              <p className="mt-5 text-sm sm:text-base lg:text-lg leading-7 text-slate-400">
                At All Star Fencing Club, we believe that fencing development goes
                beyond learning techniques. Regular practice, discipline, physical
                preparation, tactical understanding, and experience in competition
                all contribute to an athlete&apos;s development.
              </p>
            </div>

            {/* Approach Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mt-10 sm:mt-12">

              {/* Structured Training */}
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.2 }}
                className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-7"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center">
                  <span className="text-blue-400 font-bold text-lg">01</span>
                </div>

                <h3 className="mt-5 text-lg sm:text-xl font-bold text-white">
                  Structured Training
                </h3>

                <p className="mt-3 text-sm sm:text-base text-slate-400 leading-7">
                  Regular fencing practice designed around the player&apos;s level,
                  needs, and development.
                </p>
              </motion.div>

              {/* Technical Development */}
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.2 }}
                className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-7"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center">
                  <span className="text-blue-400 font-bold text-lg">02</span>
                </div>

                <h3 className="mt-5 text-lg sm:text-xl font-bold text-white">
                  Technical Development
                </h3>

                <p className="mt-3 text-sm sm:text-base text-slate-400 leading-7">
                  Building strong fencing fundamentals, movement, technique, and
                  tactical awareness.
                </p>
              </motion.div>

              {/* Competition Preparation */}
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.2 }}
                className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-7"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center">
                  <span className="text-blue-400 font-bold text-lg">03</span>
                </div>

                <h3 className="mt-5 text-lg sm:text-xl font-bold text-white">
                  Competition Preparation
                </h3>

                <p className="mt-3 text-sm sm:text-base text-slate-400 leading-7">
                  Preparing players for competitive fencing through focused practice
                  and match experience.
                </p>
              </motion.div>

              {/* Athlete Development */}
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.2 }}
                className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-7"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center">
                  <span className="text-blue-400 font-bold text-lg">04</span>
                </div>

                <h3 className="mt-5 text-lg sm:text-xl font-bold text-white">
                  Athlete Development
                </h3>

                <p className="mt-3 text-sm sm:text-base text-slate-400 leading-7">
                  Encouraging discipline, consistency, confidence, and continuous
                  improvement both on and off the piste.
                </p>
              </motion.div>

            </div>
          </motion.div>
          <div className="flex items-center gap-4 my-14 sm:my-16 lg:my-20">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />

            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]" />

            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
          </div>
          {/* COMPETITIVE JOURNEY */}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-14 sm:mt-16 lg:mt-20"
          >
            <div className="max-w-4xl">
              <span className="uppercase tracking-[4px] sm:tracking-[6px] text-blue-400 font-semibold text-xs sm:text-sm">
                Competitive Journey
              </span>

              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                From
                <span className="text-blue-500"> Training </span>
                to
                <span className="text-blue-500"> Competition</span>
              </h2>

              <p className="mt-5 text-sm sm:text-base lg:text-lg leading-7 text-slate-400">
                Competition is an important part of an athlete&apos;s development.
                ASFC players participate in fencing tournaments to gain valuable
                experience, test their skills, and continue improving through
                competitive match play.
              </p>

              <p className="mt-4 text-sm sm:text-base lg:text-lg leading-7 text-slate-400">
                The club&apos;s competitive journey includes participation in fencing
                competitions ranging from{" "}
                <span className="text-white font-medium">
                  district to international levels
                </span>
                , giving athletes opportunities to gain experience and continue
                developing through competitive match play.
              </p>

              {/* COMPETITIVE DEVELOPMENT */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5 mt-8">
                <div className="flex items-start gap-3">
                  <div className="mt-2 w-2 h-2 rounded-full bg-blue-400 shrink-0" />

                  <p className="text-slate-300 text-sm sm:text-base leading-7">
                    Match experience and competitive exposure
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-2 w-2 h-2 rounded-full bg-blue-400 shrink-0" />

                  <p className="text-slate-300 text-sm sm:text-base leading-7">
                    Tactical and decision-making development
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-2 w-2 h-2 rounded-full bg-blue-400 shrink-0" />

                  <p className="text-slate-300 text-sm sm:text-base leading-7">
                    Experience handling competitive pressure
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-2 w-2 h-2 rounded-full bg-blue-400 shrink-0" />

                  <p className="text-slate-300 text-sm sm:text-base leading-7">
                    Continuous learning through competition
                  </p>
                </div>
              </div>

              {/* TOURNAMENT LINK */}

              <div className="mt-8">
                <a
                  href="/explore-tournament"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold transition hover:bg-blue-500"
                >
                  Explore Tournaments
                </a>
              </div>
            </div>
          </motion.div>
          <div className="flex items-center gap-4 my-14 sm:my-16 lg:my-20">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />

            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]" />

            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
          </div>
          {/* FINAL CTA */}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-16 sm:mt-20 lg:mt-24"
          >
            <div className="relative overflow-hidden rounded-[28px] sm:rounded-[35px] border border-white/10 bg-slate-900/70 backdrop-blur-xl px-6 py-12 sm:px-10 sm:py-14 lg:px-16 lg:py-16 text-center">

              {/* Background Glow */}
              <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-blue-600/20 blur-[120px]" />

              <div className="relative">
                <span className="uppercase tracking-[4px] sm:tracking-[6px] text-blue-400 font-semibold text-xs sm:text-sm">
                  Start Your Journey
                </span>

                <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                  Ready to Begin Your
                  <span className="text-blue-500"> Fencing Journey?</span>
                </h2>

                <p className="max-w-2xl mx-auto mt-5 text-sm sm:text-base lg:text-lg text-slate-400 leading-7">
                  Interested in learning fencing or joining All Star Fencing Club?
                  Get in touch with us to learn more about training and registration.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">

                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold transition hover:bg-blue-500"
                  >
                    Contact the Club
                  </a>

                  <a
                    href="/register"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-white font-semibold transition hover:bg-white/[0.08]"
                  >
                    Register as a Player
                  </a>

                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex items-center gap-4 my-14 sm:my-16 lg:my-20">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />

            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]" />

            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
          </div>
        </div>
      </section>
    </>

  );
}