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
    <section className="bg-[#020617] py-28">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center max-w-3xl mx-auto">

          <p className="uppercase tracking-[6px] text-blue-400 font-semibold">

            Why Choose ASFC

          </p>

          <h2 className="text-5xl lg:text-6xl font-black text-white mt-6">

            Everything You Need To

            <span className="text-blue-500">

              {" "}Become A Champion

            </span>

          </h2>

          <p className="text-slate-400 text-lg leading-8 mt-8">

            All Star Fencing Club combines expert coaching, structured
            training and competitive opportunities to help athletes
            reach their full potential.

          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">

          {features.map((feature, index) => {

            const Icon = feature.icon;

            return (

              <div
                key={index}
                className="group rounded-3xl border border-white/10 bg-slate-900 hover:border-blue-500 transition-all duration-300 p-8"
              >

                <div className="w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center group-hover:bg-blue-600 transition">

                  <Icon
                    className="text-blue-400 group-hover:text-white"
                    size={30}
                  />

                </div>

                <h3 className="text-white text-2xl font-bold mt-8">

                  {feature.title}

                </h3>

                <p className="text-slate-400 leading-8 mt-5">

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