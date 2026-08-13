import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";

const statusConfig = {
  Accepted: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    icon: ShieldCheck,
  },
  Pending: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    icon: ShieldAlert,
  },
  Rejected: {
    bg: "bg-red-100",
    text: "text-red-700",
    icon: ShieldX,
  },
};

const eventColors = {
  Epee: "bg-blue-100 text-blue-700",
  Foil: "bg-sky-100 text-sky-700",
  Sabre: "bg-indigo-100 text-indigo-700",
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
      className="relative overflow-hidden rounded-b-[2rem] bg-gradient-to-br from-[#07111F] via-[#0B1D35] to-blue-700 px-6 pb-8 pt-10 shadow-xl"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-400/20" />

      <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-blue-300/10" />

      <div className="pointer-events-none absolute right-1/4 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-blue-500/10 blur-2xl" />

      <div className="relative flex flex-col items-center">

        {/* Player Photo */}
        <div className="rounded-full bg-blue-400/20 p-1 shadow-xl shadow-blue-950/30">
          <img
            src={player.photoURL}
            alt={player.fullName}
            className="h-32 w-32 rounded-full border-4 border-white object-cover"
          />
        </div>

        {/* Name */}
        <h1 className="mt-5 text-center text-2xl font-bold tracking-tight text-white">
          {player.fullName}
        </h1>

        {/* FAI ID */}
        <p className="mt-1 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-blue-200">
          FAI ID: {player.faiId}
        </p>

        {/* Badges */}
        <div className="mt-5 flex flex-wrap justify-center gap-3">

          {/* Event */}
          <span
            className={`rounded-full px-4 py-2 text-sm font-semibold shadow ${eventColors[player.event] || "bg-blue-100 text-blue-700"}`}
          >
            ⚔ {player.event}
          </span>

          {/* Status */}
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