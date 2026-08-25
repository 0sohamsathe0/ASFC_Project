import { useEffect, useState } from "react";
import { CalendarCheck2, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { api } from "../api";
import MonthNavigator from "./MonthNavigator";
import PlayerAttendanceCalendar from "./PlayerAttendanceCalendar";
import PlayerAttendanceStats from "./PlayerAttendanceStats";
import {
  getCurrentMonthValue,
  shiftMonthValue,
} from "./player-attendance-utils";

const EMPTY_STATISTICS = {
  totalSessions: 0,
  presentCount: 0,
  absentCount: 0,
  attendancePercentage: 0,
};

const PlayerAttendance = () => {
  const navigate = useNavigate();
  const currentMonth = getCurrentMonthValue();
  const [month, setMonth] = useState(currentMonth);
  const [records, setRecords] = useState([]);
  const [statistics, setStatistics] = useState(EMPTY_STATISTICS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    api
      .get("/player/attendance", { params: { month } })
      .then((response) => {
        if (cancelled) return;
        setRecords(response.data.data || []);
        setStatistics(response.data.statistics || EMPTY_STATISTICS);
      })
      .catch((apiError) => {
        if (cancelled) return;

        if ([401, 403].includes(apiError.response?.status)) {
          navigate("/player/login", { replace: true });
          return;
        }

        setRecords([]);
        setStatistics(EMPTY_STATISTICS);
        setError(
          apiError.response?.data?.message ||
            "Unable to load attendance. Please try again."
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [month, navigate, refreshKey]);

  const selectMonth = (nextMonth) => {
    setLoading(true);
    setError("");
    setMonth(nextMonth);
  };

  const retry = () => {
    setLoading(true);
    setError("");
    setRefreshKey((value) => value + 1);
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
      <div className="border-b border-blue-100 bg-blue-50 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <CalendarCheck2 size={19} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">My Attendance</h2>
            <p className="text-xs text-slate-500">
              Monthly Morning and Evening practice records
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-4 sm:p-6">
        <MonthNavigator
          month={month}
          currentMonth={currentMonth}
          loading={loading}
          onPrevious={() => selectMonth(shiftMonthValue(month, -1))}
          onNext={() => selectMonth(shiftMonthValue(month, 1))}
          onToday={() => selectMonth(currentMonth)}
        />

        {loading ? (
          <div className="flex h-44 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
            <p className="text-sm font-medium text-rose-700">{error}</p>
            <button
              type="button"
              onClick={retry}
              className="mx-auto mt-4 flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
            >
              <RefreshCw size={16} /> Try again
            </button>
          </div>
        ) : (
          <>
            <PlayerAttendanceStats statistics={statistics} />

            <PlayerAttendanceCalendar month={month} records={records} />

            <p className="text-center text-xs leading-5 text-slate-400">
              Statistics include only attendance explicitly marked by the club.
              Missing sessions are not counted as absent.
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default PlayerAttendance;
