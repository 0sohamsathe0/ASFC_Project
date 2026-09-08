import { createElement } from "react";
import {
  ArrowRight,
  CalendarCheck2,
  Medal,
  Trophy,
  UserRound,
  WalletCards,
} from "lucide-react";
import { Link } from "react-router-dom";

const quickActions = [
  {
    label: "My Fees",
    to: "/player/fees",
    icon: WalletCards,
  },
  {
    label: "Attendance",
    to: "/player/attendance",
    icon: CalendarCheck2,
  },
  {
    label: "Tournaments",
    to: "/player/tournaments",
    icon: Trophy,
  },
  {
    label: "Achievements",
    to: "/player/achievements",
    icon: Medal,
  },
  {
    label: "My Profile",
    to: "/player/profile",
    icon: UserRound,
  },
];

const PlayerQuickActions = () => (
  <section aria-labelledby="player-quick-actions-title">
    <div className="mb-3 flex items-end justify-between gap-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
          Shortcuts
        </p>
        <h2
          id="player-quick-actions-title"
          className="mt-1 text-lg font-bold text-slate-900 sm:text-xl"
        >
          Quick Actions
        </h2>
      </div>
    </div>

    <nav
      aria-label="Player quick actions"
      className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 xl:grid-cols-5"
    >
      {quickActions.map(({ label, to, icon: Icon }) => (
        <Link
          key={label}
          to={to}
          className="group flex min-h-20 min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-blue-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 motion-reduce:transition-none sm:min-h-24 sm:p-4"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white motion-reduce:transition-none">
            {createElement(Icon, { size: 19, "aria-hidden": true })}
          </span>
          <span className="min-w-0 flex-1 break-words text-sm font-bold leading-5 text-slate-800">
            {label}
          </span>
          <ArrowRight
            size={16}
            className="hidden shrink-0 text-slate-400 group-hover:text-blue-600 xl:block"
            aria-hidden="true"
          />
        </Link>
      ))}
    </nav>
  </section>
);

export default PlayerQuickActions;
