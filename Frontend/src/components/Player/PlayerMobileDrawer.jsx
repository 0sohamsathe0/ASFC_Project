import { useEffect, useRef } from "react";
import { LogOut, X } from "lucide-react";

import PlayerNavigation from "./PlayerNavigation";
import logo from "../../assets/ASFC_Logo.png";

const PlayerMobileDrawer = ({
  open,
  onClose,
  onLogout,
  loggingOut,
  returnFocusRef,
}) => {
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    const returnFocusTarget = returnFocusRef.current;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const controls = drawerRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!controls?.length) return;

      const first = controls[0];
      const last = controls[controls.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      returnFocusTarget?.focus();
    };
  }, [onClose, open, returnFocusRef]);

  return (
    <div
      className={`fixed inset-0 z-[120] lg:hidden ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close player navigation"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={`absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] transition-opacity motion-reduce:transition-none ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        ref={drawerRef}
        id="player-mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Player navigation menu"
        inert={!open}
        className={`absolute inset-y-0 left-0 flex w-[min(19rem,88vw)] flex-col border-r border-slate-800 bg-[#07111F] text-white shadow-2xl transition-transform duration-300 ease-out motion-reduce:transition-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex min-h-16 items-center justify-between border-b border-slate-800 px-4">
          <div className="flex min-w-0 items-center gap-3">
            <img src={logo} alt="" className="h-10 w-10 object-contain" />
            <div className="min-w-0">
              <p className="truncate font-bold">ASFC Player</p>
              <p className="text-xs text-blue-300/70">Athlete portal</p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close player navigation"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-300 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <X size={21} aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
          <PlayerNavigation onNavigate={onClose} />
        </div>

        <div className="border-t border-slate-800 p-4">
          <button
            type="button"
            onClick={onLogout}
            disabled={loggingOut}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 font-semibold text-rose-200 transition hover:bg-rose-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut size={18} aria-hidden="true" />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>
    </div>
  );
};

export default PlayerMobileDrawer;
