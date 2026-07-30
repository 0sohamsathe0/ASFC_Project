import {
  GraduationCap,
  Swords,
  Trophy,
  ShieldCheck,
  ArrowRight,
  Users,
} from "lucide-react";

const features = [
  {
    icon: GraduationCap,
    title: "Professional Coaching",
    description:
      "Learn from experienced coaches with structured training programs designed for every skill level.",
  },
  {
    icon: Swords,
    title: "Modern Training",
    description:
      "Practice Foil, Epee and Sabre with professional equipment and competition-based sessions.",
  },
  {
    icon: Trophy,
    title: "Tournament Exposure",
    description:
      "Participate in district, state, national and international fencing competitions.",
  },
  {
    icon: Users,
    title: "Athlete Community",
    description:
      "Train alongside dedicated athletes in a motivating and supportive environment.",
  },
  {
    icon: ShieldCheck,
    title: "Player Management",
    description:
      "Digital registration, tournament entries, certificates and performance tracking in one place.",
  },
  {
    icon: ArrowRight,
    title: "Career Development",
    description:
      "Build confidence, discipline and competitive excellence through continuous athlete development.",
  },
];

export default function Features() {
  return (
    <section className="bg-[#020617] py-16 sm:py-20 lg:py-24">

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* Heading */}

        <div className="mx-auto max-w-3xl text-center">

          <p className="text-xs sm:text-sm uppercase tracking-[4px] sm:tracking-[6px] font-semibold text-blue-400">

            Why Choose ASFC

          </p>

          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight text-white">

            Everything You Need To

            <span className="text-blue-500">

              {" "}Become A Champion

            </span>

          </h2>

          <p className="mt-6 text-sm sm:text-base lg:text-lg leading-6 sm:leading-7 max-w-2xl mx-auto text-slate-400">

            All Star Fencing Club combines expert coaching, structured
            training and competitive opportunities to help athletes
            reach their full potential.

          </p>

        </div>

        {/* Cards */}

        <div className="mt-10 sm:mt-12 lg:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">

          {features.map((feature, index) => {

            const Icon = feature.icon;

            return (

              <div
                key={index}
                className="group rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 p-5 sm:p-6 lg:p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-500/60 hover:shadow-[0_20px_60px_rgba(37,99,235,0.15)]"
              >

                <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-blue-600/20 transition group-hover:bg-blue-600">

                  <Icon
                    size={28}
                    className="text-blue-400 transition group-hover:text-white"
                  />

                </div>

                <h3 className="mt-6 sm:mt-8 text-xl sm:text-2xl font-bold text-white">

                  {feature.title}

                </h3>

                <p className="mt-4 sm:mt-5 text-sm sm:text-base leading-7 sm:leading-8 text-slate-400">

                  {feature.description}

                </p>

              </div>

            );

          })}

        </div>

      </div>

    </section>
  );
}