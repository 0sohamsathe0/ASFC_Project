import { useEffect, useRef } from "react";
import { LogOut, ShieldCheck, X } from "lucide-react";

import AdminNavigation from "./AdminNavigation";

const AdminMobileDrawer = ({ open, onClose, onLogout, loggingOut }) => {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[120] lg:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close admin navigation"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={`absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
      />

      <aside
        id="admin-mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Admin navigation menu"
        className={`absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] flex-col border-r border-slate-800 bg-slate-950 text-white shadow-2xl transition-transform duration-300 ease-out ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex min-h-16 items-center justify-between border-b border-slate-800 px-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600">
              <ShieldCheck size={21} />
            </span>
            <div className="min-w-0">
              <p className="truncate font-bold">ASFC Admin</p>
              <p className="text-xs text-slate-400">Management portal</p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close admin navigation"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={21} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain p-4">
          <AdminNavigation onNavigate={onClose} />
        </div>

        <div className="border-t border-slate-800 p-4">
          <button
            type="button"
            onClick={onLogout}
            disabled={loggingOut}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 font-semibold text-red-300 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut size={18} />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>
    </div>
  );
};

export default AdminMobileDrawer;
