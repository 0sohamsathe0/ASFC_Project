import { useCallback, useState } from "react";
import {
  CalendarDays,
  ClipboardList,
  Pencil,
  RefreshCw,
  Trash2,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { api } from "../api";
import AttendanceActionModal from "./AttendanceActionModal";
import AttendanceSummary from "./AttendanceSummary";
import {
  formatAttendanceDate,
  getApiErrorMessage,
  getLocalDateString,
  getOptimizedPlayerPhoto,
} from "./attendance-ui";

const EMPTY_SUMMARY = {
  Morning: { Present: 0, Absent: 0, Total: 0 },
  Evening: { Present: 0, Absent: 0, Total: 0 },
};

const AttendanceRecords = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(getLocalDateString);
  const [session, setSession] = useState("");
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState("");
  const [activeRecord, setActiveRecord] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleAuthError = useCallback(
    (apiError) => {
      if ([401, 403].includes(apiError.response?.status)) {
        navigate("/admin/login", { replace: true });
        return true;
      }
      return false;
    },
    [navigate]
  );

  const fetchRecords = useCallback(async () => {
    if (!date) return;

    setLoading(true);
    setError("");

    try {
      const response = await api.get("/admin/attendance", {
        params: { date, ...(session ? { session } : {}) },
      });
      setRecords(response.data.data || []);
      setSummary(response.data.summary || EMPTY_SUMMARY);
      setHasLoaded(true);
    } catch (apiError) {
      if (handleAuthError(apiError)) return;
      setRecords([]);
      setSummary(EMPTY_SUMMARY);
      setHasLoaded(true);
      setError(getApiErrorMessage(apiError, "Unable to load attendance records."));
    } finally {
      setLoading(false);
    }
  }, [date, session, handleAuthError]);

  const openModal = (record, mode) => {
    setActiveRecord(record);
    setModalMode(mode);
  };

  const closeModal = () => {
    if (saving) return;
    setActiveRecord(null);
    setModalMode(null);
  };

  const confirmAction = async (nextStatus) => {
    if (!activeRecord) return;

    setSaving(true);
    try {
      if (modalMode === "delete") {
        await api.delete(`/admin/attendance/${activeRecord._id}`);
        toast.success("Attendance deleted successfully");
      } else {
        await api.patch(`/admin/attendance/${activeRecord._id}`, {
          status: nextStatus,
        });
        toast.success(`Attendance changed to ${nextStatus}`);
      }

      setActiveRecord(null);
      setModalMode(null);
      await fetchRecords();
    } catch (apiError) {
      if (handleAuthError(apiError)) return;
      toast.error(getApiErrorMessage(apiError, "Unable to update attendance."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 ring-1 ring-slate-800">
              <ClipboardList size={18} className="text-indigo-600" />
              Attendance Management
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Attendance Records
            </h1>
            <p className="mt-2 text-slate-400">
              Review and correct attendance for a selected practice day.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/admin/attendance/mark")}
            className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
          >
            Mark Attendance
          </button>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/10">
          <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <label>
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300">
                <CalendarDays size={17} /> Date
              </span>
              <input
                type="date"
                value={date}
                onChange={(event) => {
                  setDate(event.target.value);
                  setHasLoaded(false);
                }}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-red-500 focus:ring-2 focus:ring-red-950"
              />
            </label>

            <label>
              <span className="mb-2 block text-sm font-semibold text-slate-300">
                Session
              </span>
              <select
                value={session}
                onChange={(event) => {
                  setSession(event.target.value);
                  setHasLoaded(false);
                }}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-red-500 focus:ring-2 focus:ring-red-950"
              >
                <option value="">All sessions</option>
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
              </select>
            </label>

            <button
              type="button"
              onClick={fetchRecords}
              disabled={loading || !date}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 font-semibold text-slate-200 hover:bg-slate-700 disabled:opacity-60"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              {hasLoaded ? "Refresh" : "Load Records"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {hasLoaded && <div className="mb-6 grid gap-4 xl:grid-cols-2">
          {(!session || session === "Morning") && (
            <AttendanceSummary title="Morning session" summary={summary.Morning} />
          )}
          {(!session || session === "Evening") && (
            <AttendanceSummary title="Evening session" summary={summary.Evening} />
          )}
        </div>}

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl shadow-black/10">
          <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
            <div>
              <h2 className="font-semibold text-white">
                {date ? formatAttendanceDate(date) : "Select a date"}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {records.length} attendance record{records.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex h-56 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-red-500" />
            </div>
          ) : !hasLoaded ? (
            <div className="p-12 text-center">
              <CalendarDays className="mx-auto text-slate-600" size={44} />
              <h3 className="mt-4 font-semibold text-white">Choose records to view</h3>
              <p className="mt-2 text-sm text-slate-400">
                Select a date and optional session, then load the attendance records.
              </p>
            </div>
          ) : records.length === 0 ? (
            <div className="p-12 text-center">
              <ClipboardList className="mx-auto text-slate-600" size={44} />
              <h3 className="mt-4 font-semibold text-white">No attendance records</h3>
              <p className="mt-2 text-sm text-slate-400">
                No explicit attendance has been marked for this selection.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-950/60 text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Player</th>
                    <th className="px-4 py-4">Event</th>
                    <th className="px-4 py-4">Session</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Marked at</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {records.map((record) => (
                    <tr key={record._id} className="hover:bg-slate-800/60">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {record.player?.photoURL ? (
                            <img
                              src={getOptimizedPlayerPhoto(record.player.photoURL)}
                              alt={record.player.fullName}
                              loading="lazy"
                              decoding="async"
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-500">
                              <UserRound size={19} />
                            </div>
                          )}
                          <span className="font-semibold text-white">
                            {record.player?.fullName || "Deleted player"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-300">
                        {record.player?.event || "—"}
                      </td>
                      <td className="px-4 py-4 text-slate-300">{record.session}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            record.status === "Present"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-400">
                        {new Date(record.markedAt).toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openModal(record, "edit")}
                            title="Change attendance status"
                            className="rounded-lg border border-amber-200 bg-amber-50 p-2 text-amber-700 hover:bg-amber-100"
                          >
                            <Pencil size={17} />
                          </button>
                          <button
                            type="button"
                            onClick={() => openModal(record, "delete")}
                            title="Delete attendance"
                            className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-rose-700 hover:bg-rose-100"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <AttendanceActionModal
        record={activeRecord}
        mode={modalMode}
        loading={saving}
        onClose={closeModal}
        onConfirm={confirmAction}
      />
    </div>
  );
};

export default AttendanceRecords;
