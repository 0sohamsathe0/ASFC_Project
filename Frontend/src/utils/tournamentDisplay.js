const CLUB_TIME_ZONE = "Asia/Kolkata";

const getDateKey = (value) => {
  if (!value) return "";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const parts = new Intl.DateTimeFormat("en-IN", {
    timeZone: CLUB_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value: part }) => [type, part]));
  return `${values.year}-${values.month}-${values.day}`;
};

export const getClubTodayKey = () => getDateKey(new Date());

export const getTournamentStatus = (tournament, todayKey = getClubTodayKey()) => {
  const startKey = getDateKey(tournament.startingDate);
  const endKey = getDateKey(tournament.endDate);

  if (startKey && startKey > todayKey) return "upcoming";
  if (endKey && endKey < todayKey) return "completed";
  return "ongoing";
};

const formatDateKey = (dateKey) => {
  if (!dateKey) return "Date unavailable";
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
};

export const formatTournamentDates = (startingDate, endDate) => {
  const start = formatDateKey(getDateKey(startingDate));
  const end = formatDateKey(getDateKey(endDate));
  return start === end ? start : `${start} – ${end}`;
};

export const formatTournamentLocation = (tournament) =>
  [tournament.locationCity, tournament.locationState].filter(Boolean).join(", ");

export const groupTournamentsByStatus = (tournaments) => {
  const grouped = { upcoming: [], ongoing: [], completed: [] };

  tournaments.forEach((tournament) => {
    grouped[getTournamentStatus(tournament)].push(tournament);
  });

  grouped.upcoming.sort((a, b) => getDateKey(a.startingDate).localeCompare(getDateKey(b.startingDate)));
  grouped.ongoing.sort((a, b) => getDateKey(a.endDate).localeCompare(getDateKey(b.endDate)));
  grouped.completed.sort((a, b) => getDateKey(b.endDate).localeCompare(getDateKey(a.endDate)));

  return grouped;
};
