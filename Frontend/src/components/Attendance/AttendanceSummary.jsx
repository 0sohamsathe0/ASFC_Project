import { Check, Users, X } from "lucide-react";

const AttendanceSummary = ({ title, summary }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/10">
    <h3 className="font-semibold text-white">{title}</h3>
    <div className="mt-4 grid grid-cols-3 gap-3">
      <div className="rounded-xl bg-emerald-950/60 p-3">
        <Check className="text-emerald-600" size={18} />
        <p className="mt-2 text-2xl font-bold text-emerald-700">{summary.Present}</p>
        <p className="text-xs font-medium text-emerald-700">Present</p>
      </div>
      <div className="rounded-xl bg-rose-950/60 p-3">
        <X className="text-rose-600" size={18} />
        <p className="mt-2 text-2xl font-bold text-rose-700">{summary.Absent}</p>
        <p className="text-xs font-medium text-rose-700">Absent</p>
      </div>
      <div className="rounded-xl bg-slate-800 p-3">
        <Users className="text-slate-600" size={18} />
        <p className="mt-2 text-2xl font-bold text-white">{summary.Total}</p>
        <p className="text-xs font-medium text-slate-400">Total</p>
      </div>
    </div>
  </div>
);

export default AttendanceSummary;
