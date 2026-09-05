import { LogOut, Menu, ShieldCheck } from "lucide-react";

const Topbar = ({ pageTitle, drawerOpen, onMenuOpen, onLogout, loggingOut }) => (
  <header className="sticky top-0 z-40 flex min-h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur sm:px-6 lg:min-h-20 lg:px-8">
    <div className="flex min-w-0 items-center gap-3">
      <button type="button" onClick={onMenuOpen} aria-label="Open admin navigation" aria-controls="admin-mobile-navigation" aria-expanded={drawerOpen} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-100 lg:hidden">
        <Menu size={22} />
      </button>
      <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white sm:flex lg:hidden">
        <ShieldCheck size={20} />
      </div>
      <div className="min-w-0">
        <p className="hidden text-xs font-semibold uppercase tracking-wider text-slate-400 sm:block">Admin</p>
        <h1 className="truncate text-base font-bold text-slate-900 sm:text-lg lg:text-xl">{pageTitle}</h1>
      </div>
    </div>
    <button type="button" onClick={onLogout} disabled={loggingOut} className="hidden min-h-11 items-center gap-2 rounded-xl bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 lg:flex">
      <LogOut size={18} />
      {loggingOut ? "Logging out..." : "Logout"}
    </button>
  </header>
);

export default Topbar;
