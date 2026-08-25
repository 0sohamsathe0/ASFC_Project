import AttendanceCell from "./AttendanceCell";

const DesktopAttendanceTable = ({ players, days }) => (
  <div className="hidden overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl shadow-black/10 md:block">
    <div className="max-h-[calc(100vh-285px)] min-h-72 overflow-auto overscroll-contain">
      <table className="w-max min-w-full border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            <th className="sticky left-0 top-0 z-40 w-16 min-w-16 border-b border-r border-slate-700 bg-slate-800 px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-300">Sr.</th>
            <th className="sticky left-16 top-0 z-40 w-56 min-w-56 border-b border-r border-slate-700 bg-slate-800 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300 shadow-[8px_0_14px_-12px_rgba(0,0,0,0.9)]">Player Name</th>
            {days.map((day) => <th key={day.dateKey} className="sticky top-0 z-30 w-[72px] min-w-[72px] border-b border-r border-slate-700 bg-slate-800 px-2 py-2 text-center"><span className="block font-bold text-slate-100">{day.dayLabel}</span><span className="block text-[11px] font-medium text-slate-400">{day.weekday}</span></th>)}
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={player._id} className="group">
              <td className="sticky left-0 z-20 border-b border-r border-slate-800 bg-slate-900 px-3 py-3 text-center tabular-nums text-slate-400 group-hover:bg-slate-800">{String(index + 1).padStart(2, "0")}</td>
              <th scope="row" className="sticky left-16 z-20 border-b border-r border-slate-800 bg-slate-900 px-4 py-3 text-left group-hover:bg-slate-800 shadow-[8px_0_14px_-12px_rgba(0,0,0,0.9)]">
                <span className="block max-w-48 truncate font-semibold text-slate-100" title={player.fullName}>{player.fullName}</span>
                <span className="mt-0.5 block text-xs font-normal text-slate-500">{player.event} · {player.gender}</span>
                <span className="mt-1.5 flex max-w-48 flex-wrap items-center gap-x-1 text-[10px] font-medium leading-4" aria-label={`${player.summary.recorded} recorded sessions, ${player.summary.present} present, ${player.summary.absent} absent, attendance ${player.summary.percentage ?? "not available"}${player.summary.percentage === null ? "" : " percent"}`}>
                  <span className="text-slate-400">{player.summary.recorded} rec</span>
                  <span aria-hidden="true" className="text-slate-700">·</span>
                  <span className="text-emerald-400">{player.summary.present} P</span>
                  <span aria-hidden="true" className="text-slate-700">·</span>
                  <span className="text-rose-400">{player.summary.absent} A</span>
                  <span aria-hidden="true" className="text-slate-700">·</span>
                  <span className="text-blue-400">{player.summary.percentage === null ? "—" : `${player.summary.percentage}%`}</span>
                </span>
              </th>
              {days.map((day) => <td key={day.dateKey} className="border-b border-r border-slate-800 bg-slate-950/30 px-2 py-3 text-center group-hover:bg-slate-800/50"><AttendanceCell attendance={player.attendance?.[day.dateKey]} dateLabel={day.accessibleDateLabel} /></td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default DesktopAttendanceTable;
