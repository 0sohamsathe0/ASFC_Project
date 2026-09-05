import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import { CalendarDays, ExternalLink, FileText, UserRound } from "lucide-react";

import RejectPlayer from "../Admin/RejectPlayer.jsx";
import { api } from "../api.js";

const formatDate = (date) => {
  if (!date) return "Not provided";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const RequestActions = ({ player, loadingPlayerId, loadingAction, onApprove, onReject }) => {
  const isProcessing = loadingPlayerId === player._id;

  return (
    <div className="grid w-full grid-cols-1 gap-2 min-[360px]:grid-cols-2 md:flex md:w-auto md:gap-3">
      <button
        type="button"
        disabled={isProcessing}
        onClick={onReject}
        className="flex min-h-11 min-w-0 items-center justify-center rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-400 md:min-w-[110px]"
      >
        {isProcessing && loadingAction === "reject" ? (
          <><CircularProgress size={16} sx={{ color: "white", mr: 1 }} />Rejecting...</>
        ) : "Reject"}
      </button>
      <button
        type="button"
        disabled={isProcessing}
        onClick={onApprove}
        className="flex min-h-11 min-w-0 items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400 md:min-w-[110px]"
      >
        {isProcessing && loadingAction === "approve" ? (
          <><CircularProgress size={16} sx={{ color: "white", mr: 1 }} />Approving...</>
        ) : "Approve"}
      </button>
    </div>
  );
};

function PlayerRequestQueue() {
  const [players, setPlayers] = useState([]);
  const [loadingPlayerId, setLoadingPlayerId] = useState(null);
  const [loadingAction, setLoadingAction] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, severity: "success", message: "" });
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleApprove = (playerId) => async () => {
    try {
      setLoadingPlayerId(playerId);
      setLoadingAction("approve");
      const res = await api.patch(`/admin/acceptPlayer/${playerId}`);
      setPlayers((prev) => prev.filter((player) => player._id !== playerId));
      setSnackbar({
        open: true,
        severity: res.data.emailSent ? "success" : "warning",
        message: res.data.message || (res.data.emailSent
          ? "Player accepted and confirmation email sent."
          : "Player accepted, but confirmation email could not be sent."),
      });
    } catch (err) {
      setSnackbar({ open: true, severity: "error", message: err.response?.data?.message || "Unable to approve player." });
    } finally {
      setLoadingPlayerId(null);
      setLoadingAction("");
    }
  };

  const handleReject = async () => {
    if (!selectedPlayer) return;

    try {
      setLoadingPlayerId(selectedPlayer._id);
      setLoadingAction("reject");
      const res = await api.patch("/admin/rejectPlayer", {
        playerId: selectedPlayer._id,
        reason: rejectReason,
      });
      setPlayers((prev) => prev.filter((player) => player._id !== selectedPlayer._id));
      setSnackbar({
        open: true,
        severity: res.data.emailSent ? "success" : "warning",
        message: res.data.message || (res.data.emailSent
          ? "Player rejected and notification email sent."
          : "Player rejected, but notification email could not be sent."),
      });
      setShowModal(false);
      setRejectReason("");
      setSelectedPlayer(null);
    } catch (err) {
      setSnackbar({ open: true, severity: "error", message: err.response?.data?.message || "Unable to reject player." });
    } finally {
      setLoadingPlayerId(null);
      setLoadingAction("");
    }
  };

  useEffect(() => {
    api.get("/admin/getPendingPlayers")
      .then((res) => setPlayers(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  const openRejectModal = (player) => {
    setSelectedPlayer(player);
    setShowModal(true);
  };

  return (
    <div className="min-h-full bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 px-4 py-5 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Players</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">Player Registration Requests</h1>
            <p className="mt-2 text-sm text-slate-500">Review identity documents before approving club access.</p>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1.5 text-sm font-bold text-amber-800 ring-1 ring-amber-200">Pending: {players.length}</span>
        </header>

        {players.length === 0 ? (
          <div className="px-4 py-14 text-center sm:px-6">
            <UserRound className="mx-auto text-slate-300" size={42} />
            <h2 className="mt-3 font-semibold text-slate-800">No pending requests</h2>
            <p className="mt-1 text-sm text-slate-500">New player registrations will appear here.</p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[850px] border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-left text-slate-600">
                    <th className="px-5 py-4">Photo</th>
                    <th className="px-4 py-4">Name</th>
                    <th className="px-4 py-4">Aadhaar Number</th>
                    <th className="px-4 py-4">Aadhaar Card</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => (
                    <tr key={player._id} className="border-b border-slate-100 transition last:border-b-0 hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <a href={player.photoURL} target="_blank" rel="noopener noreferrer" aria-label={`View ${player.fullName}'s profile photo`}>
                          <img src={player.photoURL} alt="" className="h-11 w-11 rounded-full object-cover ring-1 ring-slate-200" />
                        </a>
                      </td>
                      <td className="max-w-64 break-words px-4 py-4 font-medium text-slate-900">{player.fullName}</td>
                      <td className="px-4 py-4 text-slate-600">{player.aadharCard}</td>
                      <td className="px-4 py-4">
                        <a href={player.aadharCardURL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 font-semibold text-blue-600 hover:bg-blue-50 hover:text-blue-700" aria-label={`View Aadhaar document for ${player.fullName}`}>
                          <FileText size={17} /> View Document
                        </a>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          <RequestActions player={player} loadingPlayerId={loadingPlayerId} loadingAction={loadingAction} onApprove={handleApprove(player._id)} onReject={() => openRejectModal(player)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-4 p-3 md:hidden">
              {players.map((player) => (
                <article key={player._id} className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex min-w-0 items-start gap-3">
                    <a href={player.photoURL} target="_blank" rel="noopener noreferrer" className="shrink-0" aria-label={`View ${player.fullName}'s profile photo`}>
                      <img src={player.photoURL} alt="" className="h-14 w-14 rounded-xl object-cover ring-1 ring-slate-200" />
                    </a>
                    <div className="min-w-0 flex-1">
                      <h2 className="break-words font-bold leading-snug text-slate-900">{player.fullName}</h2>
                      <span className="mt-1.5 inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800 ring-1 ring-amber-200">Pending</span>
                    </div>
                  </div>

                  <dl className="mt-4 space-y-3 text-sm">
                    <div>
                      <dt className="flex items-center gap-1 text-xs text-slate-500"><CalendarDays size={13} /> Date of birth</dt>
                      <dd className="mt-0.5 font-medium text-slate-800">{formatDate(player.dob)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-500">Aadhaar Number</dt>
                      <dd className="mt-0.5 break-all font-medium text-slate-800">{player.aadharCard}</dd>
                    </div>
                  </dl>

                  <a href={player.aadharCardURL} target="_blank" rel="noopener noreferrer" className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 font-semibold text-blue-700 transition hover:bg-blue-100" aria-label={`View Aadhaar document for ${player.fullName}`}>
                    <FileText size={17} /> View Document <ExternalLink size={14} />
                  </a>

                  <div className="mt-3">
                    <RequestActions player={player} loadingPlayerId={loadingPlayerId} loadingAction={loadingAction} onApprove={handleApprove(player._id)} onReject={() => openRejectModal(player)} />
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
      <RejectPlayer showModal={showModal} setShowModal={setShowModal} rejectReason={rejectReason} setRejectReason={setRejectReason} handleReject={handleReject} isLoading={loadingPlayerId === selectedPlayer?._id && loadingAction === "reject"} playerName={selectedPlayer?.fullName} />
    </div>
  );
}

export default PlayerRequestQueue;
