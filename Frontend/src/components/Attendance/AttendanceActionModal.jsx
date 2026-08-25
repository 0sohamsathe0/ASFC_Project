import { AlertTriangle, Pencil, Trash2, X } from "lucide-react";

const AttendanceActionModal = ({ record, mode, loading, onClose, onConfirm }) => {
  if (!record) return null;

  const isDelete = mode === "delete";
  const nextStatus = record.status === "Present" ? "Absent" : "Present";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="attendance-modal-title"
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-800 p-6">
          <div className="flex gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                isDelete
                  ? "bg-rose-100 text-rose-600"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {isDelete ? <AlertTriangle size={21} /> : <Pencil size={20} />}
            </div>
            <div>
              <h2 id="attendance-modal-title" className="text-lg font-bold text-white">
                {isDelete ? "Delete attendance?" : "Change attendance status?"}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {isDelete
                  ? "This permanently removes the record."
                  : `Status will change from ${record.status} to ${nextStatus}.`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close modal"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3 p-6 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Player</span>
            <span className="text-right font-semibold text-white">
              {record.player?.fullName || "Deleted player"}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Session</span>
            <span className="font-semibold text-white">{record.session}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Current status</span>
            <span className="font-semibold text-white">{record.status}</span>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-800 bg-slate-950/50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 font-semibold text-slate-200 hover:bg-slate-700 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(isDelete ? undefined : nextStatus)}
            disabled={loading}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 ${
              isDelete
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            {isDelete ? <Trash2 size={17} /> : <Pencil size={17} />}
            {loading ? "Saving..." : isDelete ? "Delete permanently" : `Mark ${nextStatus}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceActionModal;
