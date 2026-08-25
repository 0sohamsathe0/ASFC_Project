import { useEffect, useState } from "react";
import { CalendarDays, ClipboardCheck, Moon, RefreshCw, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { api } from "../api";
import AttendancePlayerCard from "./AttendancePlayerCard";
import AttendanceProgress from "./AttendanceProgress";
import AttendanceSummary from "./AttendanceSummary";
import {
  formatAttendanceDate,
  getApiErrorMessage,
  getLocalDateString,
  getOptimizedPlayerPhoto,
} from "./attendance-ui";

const EMPTY_SUMMARY = { Present: 0, Absent: 0, Total: 0 };

const MarkAttendance = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(getLocalDateString);
  const [session, setSession] = useState("Morning");
  const [markingState, setMarkingState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleAuthError = (apiError) => {
    if ([401, 403].includes(apiError.response?.status)) {
      navigate("/admin/login", { replace: true });
      return true;
    }
    return false;
  };

  const loadMarkingState = async () => {
    if (!date || !session) return;

    setLoading(true);
    setError("");

    try {
      const response = await api.get("/admin/attendance/marking-state", {
        params: { date, session },
      });
      setMarkingState(response.data.data);
    } catch (apiError) {
      if (handleAuthError(apiError)) return;
      setMarkingState(null);
      setError(
        getApiErrorMessage(apiError, "Unable to load attendance progress.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectionChange = (setter) => (event) => {
    setter(event.target.value);
    setMarkingState(null);
    setError("");
  };

  const markCurrentPlayer = async (status) => {
    const currentPlayer = markingState?.remainingPlayers?.[0];
    if (!currentPlayer || submitting) return;

    setSubmitting(true);
    setError("");

    try {
      await api.post("/admin/attendance", {
        playerId: currentPlayer._id,
        date: markingState.date,
        session: markingState.session,
        status,
      });

      const remainingPlayers = markingState.remainingPlayers.slice(1);
      const markedCount = markingState.markedCount + 1;
      const percentage = markingState.totalEligible
        ? Math.round((markedCount / markingState.totalEligible) * 100)
        : 100;

      setMarkingState((current) => ({
        ...current,
        markedCount,
        remainingCount: remainingPlayers.length,
        remainingPlayers,
        markedPlayers: [
          ...current.markedPlayers,
          {
            player: currentPlayer,
            status,
            markedAt: new Date().toISOString(),
          },
        ],
        progress: {
          completed: markedCount,
          total: current.totalEligible,
          percentage,
        },
      }));

      toast.success(`${currentPlayer.fullName} marked ${status}`);
    } catch (apiError) {
      if (handleAuthError(apiError)) return;

      if (apiError.response?.status === 409) {
        toast("Attendance was already saved. Refreshing progress.");
        await loadMarkingState();
      } else {
        setError(
          getApiErrorMessage(apiError, "Unable to save attendance. Try again.")
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const currentPlayer = markingState?.remainingPlayers?.[0];

  useEffect(() => {
    markingState?.remainingPlayers?.slice(0, 2).forEach((player) => {
      const photo = getOptimizedPlayerPhoto(player.photoURL);
      if (photo) {
        const image = new Image();
        image.src = photo;
      }
    });
  }, [markingState?.remainingPlayers]);

  const sessionSummary = markingState?.markedPlayers?.reduce(
    (summary, item) => ({
      ...summary,
      [item.status]: summary[item.status] + 1,
      Total: summary.Total + 1,
    }),
    { ...EMPTY_SUMMARY }
  );

  return (
    <div className="min-h-[calc(100vh-65px)] bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 ring-1 ring-slate-800">
            <ClipboardCheck size={18} className="text-emerald-600" />
            Attendance Management
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Mark Attendance
          </h1>
          <p className="mt-2 text-slate-400">
            Select a practice session and continue from the first unmarked player.
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/10 sm:p-6">
          <div className="grid gap-5 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300">
                <CalendarDays size={17} /> Date
              </span>
              <input
                type="date"
                value={date}
                onChange={handleSelectionChange(setDate)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-950"
              />
            </label>

            <div>
              <p className="mb-2 text-sm font-semibold text-slate-300">Session</p>
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-950 p-1 ring-1 ring-slate-800">
                {["Morning", "Evening"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setSession(option);
                      setMarkingState(null);
                      setError("");
                    }}
                    className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                      session === option
                        ? "bg-slate-700 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {option === "Morning" ? <Sun size={17} /> : <Moon size={17} />}
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              disabled={loading || !date}
              onClick={loadMarkingState}
              className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              {loading ? "Loading..." : "Load Session"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex h-56 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-red-500" />
          </div>
        )}

        {!loading && markingState && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900 px-5 py-4 text-white">
              <div>
                <p className="font-semibold">{formatAttendanceDate(markingState.date)}</p>
                <p className="text-sm text-slate-300">{markingState.session} session</p>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium">
                {markingState.totalEligible} eligible players
              </span>
            </div>

            

            {markingState.totalEligible === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-10 text-center">
                <h2 className="text-lg font-semibold text-white">No eligible players</h2>
                <p className="mt-2 text-sm text-slate-400">
                  There are currently no Accepted players available for attendance.
                </p>
              </div>
            ) : currentPlayer ? (
              <AttendancePlayerCard
                player={currentPlayer}
                position={markingState.markedCount + 1}
                total={markingState.totalEligible}
                submitting={submitting}
                onMark={markCurrentPlayer}
              />
            ) : (
              <div className="space-y-5 rounded-3xl border border-emerald-900 bg-emerald-950/40 p-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <ClipboardCheck size={30} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-emerald-300">Session complete</h2>
                  <p className="mt-2 text-emerald-400">
                    All eligible players have been marked for this session.
                  </p>
                </div>
                <div className="mx-auto w-full max-w-md text-left">
                  <AttendanceSummary title={`${markingState.session} summary`} summary={sessionSummary} />
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/admin/attendance/records")}
                  className="mx-auto rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800"
                >
                  View Attendance Records
                </button>
              </div>
            )}

            <AttendanceProgress
              progress={markingState.progress}
              remainingCount={markingState.remainingCount}
            />

          </div>
        )}
      </div>
    </div>
  );
};

export default MarkAttendance;
