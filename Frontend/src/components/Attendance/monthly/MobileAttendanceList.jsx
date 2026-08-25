import AttendanceCell from "./AttendanceCell";

const MobileAttendanceList = ({ players, days }) => (
  <div className="space-y-4 md:hidden">
    {players.map((player) => (
      <article key={player._id} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg shadow-black/10">
        <header className="border-b border-slate-800 px-4 py-3">
          <h2 className="font-bold text-white">{player.fullName}</h2>
          <p className="mt-0.5 text-xs text-slate-400">{player.event} · {player.gender}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium leading-4" aria-label={`${player.summary.recorded} recorded sessions, ${player.summary.present} present, ${player.summary.absent} absent, attendance ${player.summary.percentage ?? "not available"}${player.summary.percentage === null ? "" : " percent"}`}>
            <span className="text-slate-400"><strong className="text-slate-200">{player.summary.recorded}</strong> Recorded</span>
            <span aria-hidden="true" className="text-slate-700">•</span>
            <span className="text-emerald-400"><strong>{player.summary.present}</strong> Present</span>
            <span aria-hidden="true" className="text-slate-700">•</span>
            <span className="text-rose-400"><strong>{player.summary.absent}</strong> Absent</span>
            <span aria-hidden="true" className="text-slate-700">•</span>
            <span className="text-blue-400">{player.summary.percentage === null ? "—" : `${player.summary.percentage}%`}</span>
          </div>
        </header>
        <div className="overflow-x-auto overscroll-x-contain">
          <div className="grid w-max grid-cols-[44px_repeat(var(--day-count),56px)]" style={{ "--day-count": days.length }}>
            <div className="sticky left-0 z-20 border-b border-r border-slate-700 bg-slate-800" />
            {days.map((day) => <div key={day.dateKey} className="border-b border-r border-slate-700 bg-slate-800 py-2 text-center"><span className="block text-xs font-bold text-white">{day.dayLabel}</span><span className="block text-[10px] text-slate-400">{day.weekday}</span></div>)}
            <div className="sticky left-0 z-20 grid grid-rows-2 border-r border-slate-700 bg-slate-800 text-xs font-bold text-slate-300"><span className="flex h-9 items-center justify-center border-b border-slate-700">M</span><span className="flex h-9 items-center justify-center">E</span></div>
            {days.map((day) => <div key={day.dateKey} className="border-r border-slate-800 bg-slate-950/30 text-xs font-bold"><AttendanceCell attendance={player.attendance?.[day.dateKey]} dateLabel={day.accessibleDateLabel} stacked /></div>)}
          </div>
        </div>
      </article>
    ))}
  </div>
);

export default MobileAttendanceList;
