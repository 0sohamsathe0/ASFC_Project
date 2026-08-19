import { useMemo, useState } from "react";
import { Check, Minus, X } from "lucide-react";

import { formatPlayerAttendanceDate } from "./player-attendance-utils";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

const getLocalDateValue = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
};

const getDayState = (sessions) => {
  const statuses = [sessions.Morning?.status, sessions.Evening?.status];
  const presentCount = statuses.filter((status) => status === "Present").length;
  const hasAbsent = statuses.includes("Absent");

  if (presentCount === 2) {
    return {
      label: "Both sessions present",
      style: "border-emerald-700 bg-emerald-700 text-white hover:bg-emerald-600",
    };
  }

  if (presentCount === 1) {
    return {
      label: "One session present",
      style: "border-[#39d353] bg-[#39d353] text-[#07111F] hover:bg-[#56d364]",
    };
  }

  if (hasAbsent) {
    return {
      label: "Absent",
      style: "border-rose-500 bg-rose-500 text-white hover:bg-rose-400",
    };
  }

  return {
    label: "Not marked",
    style: "border-blue-900 bg-[#13243A] text-blue-300/40 hover:bg-[#19304D]",
  };
};

const StatusLine = ({ session, status, compact = false }) => {
  const isPresent = status === "Present";
  const isAbsent = status === "Absent";
  const Icon = isPresent ? Check : isAbsent ? X : Minus;

  return (
    <div className={`flex items-center justify-between gap-4 ${compact ? "text-[11px]" : "text-sm"}`}>
      <span className="font-medium text-blue-100">{session}</span>
      <span
        className={`flex items-center gap-1 font-semibold ${
          isPresent
            ? "text-emerald-400"
            : isAbsent
              ? "text-rose-400"
              : "text-blue-300/50"
        }`}
      >
        <Icon size={compact ? 12 : 15} />
        {status || "Not marked"}
      </span>
    </div>
  );
};

const PlayerAttendanceCalendar = ({ month, records }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const today = getLocalDateValue();

  const { calendarCells, recordsByDate } = useMemo(() => {
    const [year, monthNumber] = month.split("-").map(Number);
    const firstWeekday = new Date(year, monthNumber - 1, 1).getDay();
    const daysInMonth = new Date(year, monthNumber, 0).getDate();
    const byDate = new Map();

    records.forEach((record) => {
      if (!byDate.has(record.date)) byDate.set(record.date, {});
      byDate.get(record.date)[record.session] = record;
    });

    const cellCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
    const cells = Array.from({ length: cellCount }, (_, index) => {
      const day = index - firstWeekday + 1;
      if (day < 1 || day > daysInMonth) return null;

      const date = `${month}-${String(day).padStart(2, "0")}`;
      return { day, date, sessions: byDate.get(date) || {} };
    });

    return { calendarCells: cells, recordsByDate: byDate };
  }, [month, records]);

  const activeDate = selectedDate?.startsWith(`${month}-`) ? selectedDate : null;
  const selectedSessions = activeDate ? recordsByDate.get(activeDate) || {} : null;

  return (
    <div className="rounded-2xl border border-blue-900/70 bg-gradient-to-br from-[#07111F] via-[#0B1D35] to-blue-900 text-white shadow-xl shadow-blue-950/20">
      <div className="border-b border-blue-900/60 px-4 py-4 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-white">Monthly activity</h3>
            <p className="mt-1 text-xs text-blue-300/60">
              Hover or tap a day to inspect both sessions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[10px] font-medium text-blue-200/70 sm:text-xs">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-emerald-700" /> Both present
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-[#39d353]" /> One present
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-rose-500" /> Absent
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-[#13243A] ring-1 ring-blue-900" /> Not marked
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 sm:px-6">
        <div className="mx-auto w-fit">
          <div className="mb-1.5 grid grid-cols-7 gap-1.5 sm:gap-2">
            {WEEKDAYS.map((weekday, index) => (
              <div
                key={`${weekday}-${index}`}
                className="w-8 text-center text-[9px] font-bold text-blue-300/50 sm:w-9 sm:text-[10px]"
              >
                {weekday}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {calendarCells.map((cell, index) => {
              if (!cell) {
                return <div key={`empty-${index}`} className="h-8 w-8 sm:h-9 sm:w-9" />;
              }

              const dayState = getDayState(cell.sessions);
              const isToday = cell.date === today;
              const isSelected = cell.date === activeDate;

              return (
                <div key={cell.date} className="group relative">
                  <button
                    type="button"
                    onClick={() => setSelectedDate(cell.date)}
                    aria-label={`${formatPlayerAttendanceDate(cell.date)}. ${dayState.label}. Morning ${cell.sessions.Morning?.status || "not marked"}. Evening ${cell.sessions.Evening?.status || "not marked"}.`}
                    className={`flex h-8 w-8 items-center justify-center rounded-[5px] border text-[10px] font-bold transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:h-9 sm:w-9 sm:text-xs ${dayState.style} ${
                      isSelected
                        ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-[#07111F]"
                        : isToday
                          ? "ring-1 ring-blue-100 ring-offset-1 ring-offset-[#07111F]"
                          : ""
                    }`}
                  >
                    {cell.day}
                  </button>

                  <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 hidden w-48 -translate-x-1/2 rounded-xl border border-blue-800 bg-[#0B1D35] p-3 opacity-0 shadow-2xl shadow-blue-950/60 transition group-hover:block group-hover:opacity-100 group-focus-within:block group-focus-within:opacity-100">
                    <p className="mb-2 text-xs font-bold text-white">
                      {formatPlayerAttendanceDate(cell.date)}
                    </p>
                    <div className="space-y-1.5">
                      <StatusLine session="Morning" status={cell.sessions.Morning?.status} compact />
                      <StatusLine session="Evening" status={cell.sessions.Evening?.status} compact />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {activeDate && (
        <div className="border-t border-blue-900/60 bg-[#07111F]/70 px-4 py-4 sm:px-5">
          <p className="text-sm font-bold text-blue-100">
            {formatPlayerAttendanceDate(activeDate)}
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl border border-blue-900/70 bg-[#0B1D35] px-4 py-3">
              <StatusLine session="Morning" status={selectedSessions?.Morning?.status} />
            </div>
            <div className="rounded-xl border border-blue-900/70 bg-[#0B1D35] px-4 py-3">
              <StatusLine session="Evening" status={selectedSessions?.Evening?.status} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerAttendanceCalendar;
