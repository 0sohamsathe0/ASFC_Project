import { useEffect, useMemo, useState } from "react";
import { CalendarRange, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { api } from "../../api";
import { getApiErrorMessage } from "../attendance-ui";
import AttendanceToolbar from "./AttendanceToolbar";
import DesktopAttendanceTable from "./DesktopAttendanceTable";
import MobileAttendanceList from "./MobileAttendanceList";
import { calculateAttendanceSummary, getInitialMonth, getMonthDays, getMonthLabel, shiftMonth } from "./monthly-attendance-utils";

const EMPTY_PLAYERS = [];

const MonthlyAttendance = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(getInitialMonth);
  const [monthlyData, setMonthlyData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventFilter, setEventFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadMonthlyAttendance = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/admin/attendance/monthly", {
          params: selectedMonth,
          signal: controller.signal,
        });
        setMonthlyData(response.data);
      } catch (apiError) {
        if (apiError.code === "ERR_CANCELED") return;
        if ([401, 403].includes(apiError.response?.status)) {
          navigate("/admin/login", { replace: true });
          return;
        }
        setMonthlyData(null);
        setError(getApiErrorMessage(apiError, "Unable to load the monthly attendance register."));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadMonthlyAttendance();
    return () => controller.abort();
  }, [navigate, selectedMonth]);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const players = monthlyData?.players || EMPTY_PLAYERS;
  const filteredPlayers = useMemo(
    () => players
      .filter((player) =>
        (!normalizedSearch || player.fullName.toLowerCase().includes(normalizedSearch)) &&
        (!eventFilter || player.event === eventFilter) &&
        (!genderFilter || player.gender === genderFilter)
      )
      .map((player) => ({
        ...player,
        summary: calculateAttendanceSummary(player.attendance),
      })),
    [players, normalizedSearch, eventFilter, genderFilter]
  );
  const days = useMemo(
    () => monthlyData ? getMonthDays(monthlyData.year, monthlyData.month, monthlyData.daysInMonth) : [],
    [monthlyData]
  );
  const monthLabel = getMonthLabel(selectedMonth);

  return (
    <div className="min-h-[calc(100vh-65px)] min-w-0 overflow-x-hidden bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto min-w-0 max-w-[1800px]">
        <div className="mb-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 ring-1 ring-slate-800"><CalendarRange size={18} className="text-blue-500" />Attendance Management</div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Monthly Attendance</h1>
          <p className="mt-2 text-slate-400">Morning and evening attendance for every active player.</p>
        </div>

        <AttendanceToolbar monthLabel={monthLabel} onPreviousMonth={() => setSelectedMonth((current) => shiftMonth(current, -1))} onNextMonth={() => setSelectedMonth((current) => shiftMonth(current, 1))} searchTerm={searchTerm} onSearchChange={setSearchTerm} eventFilter={eventFilter} onEventChange={setEventFilter} genderFilter={genderFilter} onGenderChange={setGenderFilter} filteredCount={filteredPlayers.length} totalCount={players.length} />

        <div className="mt-5">
          {loading ? (
            <div className="flex h-72 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900" role="status"><div className="text-center"><RefreshCw className="mx-auto animate-spin text-blue-500" size={30} /><p className="mt-3 text-sm text-slate-400">Loading {monthLabel}…</p></div></div>
          ) : error ? (
            <div className="rounded-2xl border border-rose-900 bg-rose-950/30 p-8 text-center"><h2 className="font-bold text-rose-300">Could not load attendance</h2><p className="mt-2 text-sm text-rose-400">{error}</p></div>
          ) : players.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-10 text-center text-slate-400">No active players found.</div>
          ) : filteredPlayers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-10 text-center text-slate-400">{normalizedSearch ? `No players match “${searchTerm.trim()}”.` : "No players match the selected filters."}</div>
          ) : (
            <><DesktopAttendanceTable players={filteredPlayers} days={days} /><MobileAttendanceList players={filteredPlayers} days={days} /></>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlyAttendance;
