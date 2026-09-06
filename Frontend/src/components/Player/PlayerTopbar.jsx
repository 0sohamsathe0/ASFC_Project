import { LogOut, Menu, Swords } from "lucide-react";

const statusStyles = {
  Accepted: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  Rejected: "bg-rose-50 text-rose-700 ring-rose-200",
};

const PlayerTopbar = ({
  pageTitle,
  player,
  drawerOpen,
  menuButtonRef,
  onMenuOpen,
  onLogout,
  loggingOut,
}) => (
  <header className="sticky top-0 z-40 flex min-h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-3 shadow-sm backdrop-blur sm:px-5 lg:min-h-20 lg:px-7">
    <div className="flex min-w-0 items-center gap-3">
      <button
        ref={menuButtonRef}
        type="button"
        onClick={onMenuOpen}
        aria-label="Open player navigation"
        aria-controls="player-mobile-navigation"
        aria-expanded={drawerOpen}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 lg:hidden"
      >
        <Menu size={21} aria-hidden="true" />
      </button>

      <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white sm:flex lg:hidden">
        <Swords size={20} aria-hidden="true" />
      </span>

      <div className="min-w-0">
        <p className="hidden text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 sm:block">
          Player portal
        </p>
        <h1 className="truncate text-base font-bold text-slate-900 sm:text-lg lg:text-xl">
          {pageTitle}
        </h1>
      </div>
    </div>

    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
      {player?.requestStatus && (
        <span
          className={`hidden rounded-full px-3 py-1 text-xs font-bold ring-1 sm:inline-flex ${
            statusStyles[player.requestStatus] || statusStyles.Pending
          }`}
        >
          {player.requestStatus}
        </span>
      )}
      <button
        type="button"
        onClick={onLogout}
        disabled={loggingOut}
        className="hidden min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60 lg:flex"
      >
        <LogOut size={17} aria-hidden="true" />
        {loggingOut ? "Logging out..." : "Logout"}
      </button>
    </div>
  </header>
);

export default PlayerTopbar;

