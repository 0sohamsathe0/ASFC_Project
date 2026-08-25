const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const MONTH_PATTERN = /^(\d{4})-(\d{2})$/;

const ATTENDANCE_SESSIONS = ["Morning", "Evening"];
const ATTENDANCE_STATUSES = ["Present", "Absent"];

const isLeapYear = (year) =>
  year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

const daysInMonth = (year, month) => {
  const monthLengths = [
    31,
    isLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  return monthLengths[month - 1];
};

const isValidAttendanceDate = (value) => {
  if (typeof value !== "string") return false;

  const match = value.match(DATE_PATTERN);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (year < 1 || month < 1 || month > 12) return false;

  return day >= 1 && day <= daysInMonth(year, month);
};

const isValidAttendanceMonth = (value) => {
  if (typeof value !== "string") return false;

  const match = value.match(MONTH_PATTERN);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  return year >= 1 && month >= 1 && month <= 12;
};

const getMonthDateRange = (monthValue) => {
  if (!isValidAttendanceMonth(monthValue)) return null;

  const [year, month] = monthValue.split("-").map(Number);
  const lastDay = String(daysInMonth(year, month)).padStart(2, "0");

  return {
    startDate: `${monthValue}-01`,
    endDate: `${monthValue}-${lastDay}`,
  };
};

const isValidAttendanceSession = (value) =>
  ATTENDANCE_SESSIONS.includes(value);

const isValidAttendanceStatus = (value) =>
  ATTENDANCE_STATUSES.includes(value);

export {
  ATTENDANCE_SESSIONS,
  ATTENDANCE_STATUSES,
  getMonthDateRange,
  isValidAttendanceDate,
  isValidAttendanceMonth,
  isValidAttendanceSession,
  isValidAttendanceStatus,
};
