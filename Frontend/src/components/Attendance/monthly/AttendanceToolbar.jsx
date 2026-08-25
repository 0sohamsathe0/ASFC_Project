import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";

import AttendanceLegend from "./AttendanceLegend";

const AttendanceToolbar = ({ monthLabel, onPreviousMonth, onNextMonth, searchTerm, onSearchChange, eventFilter, onEventChange, genderFilter, onGenderChange, filteredCount, totalCount }) => (
  <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-xl shadow-black/10 sm:p-5">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <button type="button" onClick={onPreviousMonth} aria-label={`Show previous month before ${monthLabel}`} className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 text-slate-300 transition hover:border-blue-500 hover:bg-slate-800 hover:text-white"><ChevronLeft size={20} /></button>
        <div className="min-w-40 text-center text-lg font-bold text-white sm:min-w-48">{monthLabel}</div>
        <button type="button" onClick={onNextMonth} aria-label={`Show next month after ${monthLabel}`} className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 text-slate-300 transition hover:border-blue-500 hover:bg-slate-800 hover:text-white"><ChevronRight size={20} /></button>
      </div>
      <p className="text-sm font-semibold text-slate-300">
        {filteredCount === totalCount ? `${totalCount} Players` : `${filteredCount} of ${totalCount} players`}
      </p>
    </div>

    <div className="grid gap-3 lg:grid-cols-[minmax(260px,1fr)_180px_180px]">
      <label className="relative block">
        <span className="sr-only">Search player by name</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input value={searchTerm} onChange={(event) => onSearchChange(event.target.value)} aria-label="Search player by name" placeholder="Search player by name..." className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950 py-2 pl-10 pr-10 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-950" />
        {searchTerm && <button type="button" onClick={() => onSearchChange("")} aria-label="Clear player search" className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"><X size={17} /></button>}
      </label>
      <label>
        <span className="sr-only">Filter by event</span>
        <select value={eventFilter} onChange={(event) => onEventChange(event.target.value)} aria-label="Filter players by event" className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-slate-200 outline-none focus:border-blue-500">
          <option value="">All Events</option><option>Epee</option><option>Foil</option><option>Sabre</option>
        </select>
      </label>
      <label>
        <span className="sr-only">Filter by gender</span>
        <select value={genderFilter} onChange={(event) => onGenderChange(event.target.value)} aria-label="Filter players by gender" className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-slate-200 outline-none focus:border-blue-500">
          <option value="">All Genders</option><option>Male</option><option>Female</option><option>Other</option>
        </select>
      </label>
    </div>
    <AttendanceLegend />
  </div>
);

export default AttendanceToolbar;
