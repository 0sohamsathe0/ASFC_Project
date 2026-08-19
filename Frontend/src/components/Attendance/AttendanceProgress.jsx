import { CheckCircle2 } from "lucide-react";

const AttendanceProgress = ({ progress, remainingCount }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/10">
    <div className="mb-3 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-400">Session progress</p>
        <p className="mt-1 text-lg font-semibold text-white">
          {progress.completed} of {progress.total} marked
        </p>
      </div>
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <CheckCircle2 size={22} />
      </div>
    </div>

    <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
      <div
        className="h-full rounded-full bg-emerald-500 transition-all duration-300"
        style={{ width: `${progress.percentage}%` }}
      />
    </div>

    <div className="mt-3 flex justify-between text-sm text-slate-400">
      <span>{progress.percentage}% complete</span>
      <span>{remainingCount} remaining</span>
    </div>
  </div>
);

export default AttendanceProgress;
