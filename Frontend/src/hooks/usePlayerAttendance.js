import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../components/api";
import { getCurrentMonthValue } from "../components/Attendance/player-attendance-utils";

export const EMPTY_ATTENDANCE_STATISTICS = {
  totalSessions: 0,
  presentCount: 0,
  absentCount: 0,
  attendancePercentage: 0,
};

const usePlayerAttendance = (initialMonth = getCurrentMonthValue()) => {
  const navigate = useNavigate();
  const [month, setMonth] = useState(initialMonth);
  const [records, setRecords] = useState([]);
  const [statistics, setStatistics] = useState(EMPTY_ATTENDANCE_STATISTICS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    api
      .get("/player/attendance", {
        params: { month },
        signal: controller.signal,
      })
      .then((response) => {
        setRecords(response.data.data || []);
        setStatistics(
          response.data.statistics || EMPTY_ATTENDANCE_STATISTICS,
        );
      })
      .catch((apiError) => {
        if (apiError.code === "ERR_CANCELED") return;

        if ([401, 403].includes(apiError.response?.status)) {
          navigate("/player/login", { replace: true });
          return;
        }

        setRecords([]);
        setStatistics(EMPTY_ATTENDANCE_STATISTICS);
        setError(
          apiError.response?.data?.message ||
            "Unable to load attendance. Please try again.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [attempt, month, navigate]);

  const selectMonth = useCallback((nextMonth) => {
    setLoading(true);
    setError("");
    setMonth(nextMonth);
  }, []);

  const retry = useCallback(() => {
    setLoading(true);
    setError("");
    setAttempt((value) => value + 1);
  }, []);

  return {
    month,
    records,
    statistics,
    loading,
    error,
    selectMonth,
    retry,
  };
};

export default usePlayerAttendance;
