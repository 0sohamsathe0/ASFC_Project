import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import { formatMonthLabel } from "./player-attendance-utils";

const MonthNavigator = ({ month, currentMonth, loading, onPrevious, onNext, onToday }) => (
  <div className="flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
        <CalendarDays size={19} />
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-500">
          Attendance month
        </p>
        <p className="font-bold text-slate-900">{formatMonthLabel(month)}</p>
      </div>
    </div>

    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:flex">
      <button
        type="button"
        onClick={onPrevious}
        disabled={loading}
        aria-label="Previous month"
        className="rounded-xl border border-blue-200 bg-white p-2.5 text-blue-700 transition hover:bg-blue-100 disabled:opacity-50"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        onClick={onToday}
        disabled={loading || month === currentMonth}
        className="rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-default disabled:opacity-50"
      >
        Current month
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={loading || month >= currentMonth}
        aria-label="Next month"
        className="rounded-xl border border-blue-200 bg-white p-2.5 text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  </div>
);

export default MonthNavigator;
