import { useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { AlertTriangle, X } from "lucide-react";

const RejectPlayer = ({
  showModal,
  setShowModal,
  rejectReason,
  setRejectReason,
  handleReject,
  isLoading,
  playerName,
}) => {
  useEffect(() => {
    if (!showModal) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleEscape = (event) => {
      if (event.key === "Escape" && !isLoading) setShowModal(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isLoading, setShowModal, showModal]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:p-5" role="dialog" aria-modal="true" aria-labelledby="reject-player-title">
      <div className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-4 py-4 sm:px-6">
          <div className="flex min-w-0 gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <AlertTriangle size={20} />
            </span>
            <div className="min-w-0">
              <h2 id="reject-player-title" className="text-lg font-bold text-slate-900 sm:text-xl">Reject Player</h2>
              {playerName && <p className="mt-1 break-words text-sm text-slate-500">{playerName}</p>}
            </div>
          </div>
          <button type="button" onClick={() => setShowModal(false)} disabled={isLoading} aria-label="Close reject player dialog" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50">
            <X size={20} />
          </button>
        </header>

        <div className="px-4 py-5 sm:px-6">
          <label htmlFor="rejection-reason" className="mb-2 block text-sm font-semibold text-slate-700">Rejection reason</label>
          <textarea
            id="rejection-reason"
            rows={5}
            placeholder="Write rejection reason..."
            className="w-full resize-y rounded-xl border border-slate-300 p-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            value={rejectReason}
            onChange={(event) => setRejectReason(event.target.value)}
            disabled={isLoading}
          />
        </div>

        <footer className="grid grid-cols-1 gap-2 border-t border-slate-200 bg-slate-50 px-4 py-4 min-[360px]:grid-cols-2 sm:flex sm:justify-end sm:px-6">
          <button type="button" onClick={() => setShowModal(false)} disabled={isLoading} className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50">Cancel</button>
          <button type="button" onClick={handleReject} disabled={isLoading} className="flex min-h-11 min-w-0 items-center justify-center rounded-xl bg-rose-600 px-4 py-2.5 font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-400 sm:min-w-[150px]">
            {isLoading ? <><CircularProgress size={18} sx={{ color: "white", mr: 1 }} />Rejecting...</> : "Reject Player"}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default RejectPlayer;
