import { useEffect, useRef } from "react";
import { AlertCircle, CheckCircle2, Clock3, PauseCircle, X, XCircle } from "lucide-react";

import {
  feeStateLabel,
  formatCurrency,
  formatFeeMonth,
  formatFinancialYear,
  groupMonthsByFinancialYear,
} from "./fee-ui";

const statusStyles = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  paused: "bg-amber-50 text-amber-800 ring-amber-200",
  closed: "bg-slate-200 text-slate-700 ring-slate-300",
  uninitialized: "bg-violet-50 text-violet-700 ring-violet-200",
};

export const FeeStatusBadge = ({ status }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold capitalize ring-1 ${statusStyles[status] || statusStyles.active}`}>
    {status || "active"}
  </span>
);

export const FeePageState = ({ title, message, onRetry }) => (
  <div role={title === "Unable to load" ? "alert" : "status"} className="rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm">
    <AlertCircle className="mx-auto text-slate-400" size={34} aria-hidden="true" />
    <h2 className="mt-3 text-lg font-bold text-slate-900">{title}</h2>
    <p className="mx-auto mt-1 max-w-xl text-sm text-slate-600">{message}</p>
    {onRetry && <button type="button" onClick={onRetry} className="mt-5 min-h-11 rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">Try again</button>}
  </div>
);

export const FeeDialog = ({ title, description, children, onClose, busy = false, destructive = false }) => {
  const closeRef = useRef(null);
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape" && !busy && !destructive) onCloseRef.current();
      if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [busy, destructive]);

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/65 p-3 backdrop-blur-sm sm:p-6">
      <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="fee-dialog-title" aria-describedby={description ? "fee-dialog-description" : undefined} className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[calc(100dvh-3rem)]">
        <header className="flex items-start gap-4 border-b border-slate-200 px-4 py-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <h2 id="fee-dialog-title" className="text-xl font-bold text-slate-900">{title}</h2>
            {description && <p id="fee-dialog-description" className="mt-1 text-sm text-slate-600">{description}</p>}
          </div>
          <button ref={closeRef} type="button" onClick={onClose} disabled={busy} aria-label={`Close ${title}`} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"><X size={20} /></button>
        </header>
        <div className="min-h-0 overflow-y-auto px-4 py-5 sm:px-6">{children}</div>
      </section>
    </div>
  );
};

const monthStyles = {
  Covered: [CheckCircle2, "border-emerald-200 bg-emerald-50 text-emerald-800"],
  Pending: [AlertCircle, "border-rose-200 bg-rose-50 text-rose-800"],
  Paused: [PauseCircle, "border-amber-200 bg-amber-50 text-amber-800"],
  "Future prepaid": [Clock3, "border-blue-200 bg-blue-50 text-blue-800"],
  Closed: [XCircle, "border-slate-300 bg-slate-100 text-slate-700"],
  "Not payable": [Clock3, "border-slate-200 bg-white text-slate-600"],
};

export const FeeMonthView = ({ months = [] }) => {
  const groups = groupMonthsByFinancialYear(months);
  if (!months.length) return <FeePageState title="No fee months to display" message="Monthly fee coverage will appear here when available." />;
  return <div className="space-y-5">{Object.entries(groups).map(([year, entries]) => (
    <section key={year} aria-labelledby={`fee-year-${year}`}>
      <h3 id={`fee-year-${year}`} className="mb-2 text-sm font-bold text-slate-800">{formatFinancialYear(year)}</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">{entries.map((entry) => {
        const label = feeStateLabel(entry);
        const [Icon, style] = monthStyles[label];
        return <article key={entry.month} className={`min-w-0 rounded-xl border p-3 ${style}`}>
          <div className="flex items-center gap-2 text-xs font-bold"><Icon size={15} aria-hidden="true" />{label}</div>
          <p className="mt-2 text-sm font-semibold">{formatFeeMonth(entry.month)}</p>
          <p className="mt-1 text-xs">{entry.scheduledRate == null ? "Not payable" : formatCurrency(entry.scheduledRate)}</p>
        </article>;
      })}</div>
    </section>
  ))}</div>;
};
