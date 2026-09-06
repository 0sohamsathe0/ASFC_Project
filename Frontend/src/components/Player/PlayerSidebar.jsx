import { Swords } from "lucide-react";

import PlayerNavigation from "./PlayerNavigation";
import logo from "../../assets/ASFC_Logo.png";

const PlayerSidebar = ({ player }) => (
  <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 self-start flex-col border-r border-slate-800 bg-[#07111F] text-white lg:flex">
    <div className="flex min-h-20 items-center gap-3 border-b border-slate-800 px-5">
      <img
        src={logo}
        alt=""
        className="h-11 w-11 shrink-0 object-contain"
      />
      <div className="min-w-0">
        <p className="truncate font-bold">ASFC Player</p>
        <p className="text-xs text-blue-300/70">Athlete portal</p>
      </div>
    </div>

    <div className="border-b border-slate-800 px-5 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-blue-300">
          <Swords size={18} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {player?.fullName || "ASFC Athlete"}
          </p>
          <p className="truncate text-xs text-slate-400">
            {player?.event || "Train · Compete · Grow"}
          </p>
        </div>
      </div>
    </div>

    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
      <PlayerNavigation />
    </div>
  </aside>
);

export default PlayerSidebar;

