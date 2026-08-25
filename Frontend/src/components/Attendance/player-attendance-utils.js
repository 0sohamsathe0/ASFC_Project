const getCurrentMonthValue = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
};

const shiftMonthValue = (monthValue, offset) => {
  const [year, month] = monthValue.split("-").map(Number);
  const monthIndex = year * 12 + (month - 1) + offset;
  const shiftedYear = Math.floor(monthIndex / 12);
  const shiftedMonth = (monthIndex % 12 + 12) % 12;
  return `${shiftedYear}-${String(shiftedMonth + 1).padStart(2, "0")}`;
};

const formatMonthLabel = (monthValue) => {
  const [year, month] = monthValue.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
};

const formatPlayerAttendanceDate = (dateValue) => {
  const [year, month, day] = dateValue.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export {
  formatMonthLabel,
  formatPlayerAttendanceDate,
  getCurrentMonthValue,
  shiftMonthValue,
};
