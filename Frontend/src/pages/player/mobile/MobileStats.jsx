import { motion } from "framer-motion";
import { Trophy, Award, Swords } from "lucide-react";

const MobileStats = ({
  player,
  totalTournamentsPlayed,
  individualResults,
  teamResults,
}) => {
  const certificates =
    individualResults.length + teamResults.length;

  const stats = [
    {
      title: "Tournaments",
      value: totalTournamentsPlayed,
      icon: Trophy,
      color: "bg-purple-100 text-purple-700",
    },
    {
      title: "Certificates",
      value: certificates,
      icon: Award,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Weapon",
      value: player.event,
      icon: Swords,
      color: "bg-orange-100 text-orange-700",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.1,
            }}
            className="rounded-3xl bg-white p-4 shadow-lg"
          >
            <div
              className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${item.color}`}
            >
              <Icon size={24} />
            </div>

            <p className="mt-4 text-center text-xs font-medium text-gray-500">
              {item.title}
            </p>

            <p className="mt-1 text-center text-xl font-bold text-gray-800 break-words">
              {item.value}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MobileStats;