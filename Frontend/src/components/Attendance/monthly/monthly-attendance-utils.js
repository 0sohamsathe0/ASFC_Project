const SESSION_LABELS = [
  { key: "Morning", shortLabel: "M" },
  { key: "Evening", shortLabel: "E" },
];

const getInitialMonth = () => {
  const today = new Date();
  return { year: today.getFullYear(), month: today.getMonth() + 1 };
};

const shiftMonth = ({ year, month }, offset) => {
  const shifted = new Date(year, month - 1 + offset, 1);
  return { year: shifted.getFullYear(), month: shifted.getMonth() + 1 };
};

const getMonthLabel = ({ year, month }) =>
  new Date(year, month - 1, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

const getMonthDays = (year, month, daysInMonth) =>
  Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const date = new Date(year, month - 1, day);
    return {
      day,
      dayLabel: String(day).padStart(2, "0"),
      weekday: date.toLocaleDateString("en-IN", { weekday: "short" }),
      accessibleDateLabel: date.toLocaleDateString("en-IN", { day: "numeric", month: "long" }),
      dateKey: `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    };
  });

const getStatusText = (status) => status || "Not Marked";

const getStatusClasses = (status) => {
  if (status === "Present") return "text-emerald-400";
  if (status === "Absent") return "text-rose-400";
  return "text-slate-500";
};

const calculateAttendanceSummary = (attendance = {}) => {
  let present = 0;
  let absent = 0;

  Object.values(attendance).forEach((dayAttendance) => {
    SESSION_LABELS.forEach(({ key }) => {
      if (dayAttendance?.[key] === "Present") present += 1;
      if (dayAttendance?.[key] === "Absent") absent += 1;
    });
  });

  const recorded = present + absent;
  return {
    recorded,
    present,
    absent,
    percentage: recorded ? Math.round((present / recorded) * 100) : null,
  };
};

export {
  SESSION_LABELS,
  calculateAttendanceSummary,
  getInitialMonth,
  getMonthDays,
  getMonthLabel,
  getStatusClasses,
  getStatusText,
  shiftMonth,
};
