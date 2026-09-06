import { CalendarCheck2 } from "lucide-react";

import PlayerAttendance from "../../components/Attendance/PlayerAttendance";

const PlayerAttendancePage = () => (
  <div className="px-3 py-4 min-[360px]:px-4 sm:px-6 sm:py-6 lg:px-8">
    <div className="mx-auto max-w-5xl">
      <header className="mb-4 sm:mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
          Train
        </p>
        <div className="mt-1 flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
            <CalendarCheck2 size={20} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Attendance
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Review your recorded Morning and Evening training sessions.
            </p>
          </div>
        </div>
      </header>

      <PlayerAttendance />
    </div>
  </div>
);

export default PlayerAttendancePage;
