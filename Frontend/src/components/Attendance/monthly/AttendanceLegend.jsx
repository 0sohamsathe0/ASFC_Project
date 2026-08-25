const AttendanceLegend = () => (
  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-400" aria-label="Attendance status legend">
    <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />Present</span>
    <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rose-400" />Absent</span>
    <span className="flex items-center gap-2"><span className="h-0.5 w-3 bg-slate-500" />Not Marked</span>
  </div>
);

export default AttendanceLegend;
