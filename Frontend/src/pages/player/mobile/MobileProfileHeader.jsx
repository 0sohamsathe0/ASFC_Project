import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";

const statusConfig = {
  Accepted: {
    bg: "bg-green-100",
    text: "text-green-700",
    icon: ShieldCheck,
  },
  Pending: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    icon: ShieldAlert,
  },
  Rejected: {
    bg: "bg-red-100",
    text: "text-red-700",
    icon: ShieldX,
  },
};

const eventColors = {
  Epee: "bg-purple-100 text-purple-700",
  Foil: "bg-blue-100 text-blue-700",
  Sabre: "bg-orange-100 text-orange-700",
};

const MobileProfileHeader = ({ player }) => {
  const status =
    statusConfig[player.requestStatus] || statusConfig.Pending;

  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-b-[2rem] bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-700 px-6 pt-10 pb-8 shadow-xl"
    >
      <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-white/10" />
      <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-white/10" />

      <div className="relative flex flex-col items-center">
        <img
          src={player.photoURL}
          alt={player.fullName}
          className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-xl"
        />

        <h1 className="mt-5 text-center text-2xl font-bold text-white">
          {player.fullName}
        </h1>

        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <span
            className={`rounded-full px-4 py-2 text-sm font-semibold shadow ${eventColors[player.event]}`}
          >
            ⚔ {player.event}
          </span>

          <span
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow ${status.bg} ${status.text}`}
          >
            <StatusIcon size={16} />
            {player.requestStatus}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default MobileProfileHeader;