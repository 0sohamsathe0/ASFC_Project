const CLUB_TIME_ZONE = "Asia/Kolkata";

const getClubDateBoundary = (now = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-IN", {
    timeZone: CLUB_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));

  return new Date(`${values.year}-${values.month}-${values.day}T00:00:00.000Z`);
};

const getTournamentScheduleQuery = (type, now = new Date()) => {
  const today = getClubDateBoundary(now);

  if (type === "upcoming") {
    return { filter: { startingDate: { $gt: today } }, sort: { startingDate: 1 } };
  }
  if (type === "ongoing") {
    return {
      filter: { startingDate: { $lte: today }, endDate: { $gte: today } },
      sort: { startingDate: 1 },
    };
  }
  if (type === "completed") {
    return { filter: { endDate: { $lt: today } }, sort: { endDate: -1 } };
  }

  return { filter: {}, sort: { startingDate: 1 } };
};

export { getClubDateBoundary, getTournamentScheduleQuery };
