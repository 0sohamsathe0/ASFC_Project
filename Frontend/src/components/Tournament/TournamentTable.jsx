import { CalendarDays, MapPin, Pencil, Trophy } from "lucide-react";

const STATUS_STYLES = {
  Upcoming: {
    border: "border-emerald-500",
    text: "text-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  },
  Ongoing: {
    border: "border-amber-400",
    text: "text-amber-300",
    badge: "bg-amber-500/15 text-amber-200 ring-amber-500/30",
  },
  Completed: {
    border: "border-slate-500",
    text: "text-slate-300",
    badge: "bg-slate-500/20 text-slate-200 ring-slate-500/40",
  },
};

const formatDate = (date) => {
  if (!date) return "Not provided";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getLocation = (tournament) =>
  [tournament.locationCity, tournament.locationState]
    .filter(Boolean)
    .join(", ") || "Not provided";

const TournamentTable = ({ title, data = [], onEdit }) => {
  const styles = STATUS_STYLES[title] || STATUS_STYLES.Completed;

  return (
    <section className={`overflow-hidden rounded-xl border-l-4 bg-slate-800 shadow-lg shadow-black/10 ${styles.border}`}>
      <header className="flex items-center justify-between gap-3 border-b border-slate-700 px-4 py-4 sm:px-5">
        <h2 className={`min-w-0 font-semibold sm:text-lg ${styles.text}`}>
          {title} Tournaments
        </h2>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ring-1 ${styles.badge}`}>
          {data.length}
        </span>
      </header>

      {data.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-slate-400">
          No {title.toLowerCase()} tournaments
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-slate-600 text-left text-slate-300">
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Location</th>
                  <th className="px-4 py-3 font-semibold">Level</th>
                  <th className="px-4 py-3 text-center font-semibold">Age</th>
                  <th className="px-4 py-3 font-semibold">Start Date</th>
                  <th className="px-4 py-3 font-semibold">End Date</th>
                  <th className="px-5 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((tournament) => (
                  <tr key={tournament._id} className="border-b border-slate-700 transition last:border-b-0 hover:bg-slate-700/70">
                    <td className="max-w-64 break-words px-5 py-3 font-medium text-white">{tournament.title}</td>
                    <td className="max-w-64 break-words px-4 py-3 text-slate-300">{getLocation(tournament)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-blue-500/15 px-2.5 py-1 text-xs font-semibold text-blue-300 ring-1 ring-blue-500/30">{tournament.level || "Not provided"}</span>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-300">{tournament.ageCategory ? `U${tournament.ageCategory}` : "—"}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-300">{formatDate(tournament.startingDate)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-300">{formatDate(tournament.endDate)}</td>
                    <td className="px-5 py-3 text-right">
                      <button type="button" onClick={() => onEdit(tournament)} aria-label={`Edit ${tournament.title}`} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-500">
                        <Pencil size={16} /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 p-3 md:hidden">
            {data.map((tournament) => (
              <article key={tournament._id} className="min-w-0 rounded-xl border border-slate-700 bg-slate-900/70 p-4 shadow-sm">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/30">
                    <Trophy size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="break-words font-bold leading-snug text-white">{tournament.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${styles.badge}`}>{title}</span>
                      {tournament.level && <span className="rounded-full bg-blue-500/15 px-2.5 py-1 text-[11px] font-bold text-blue-300 ring-1 ring-blue-500/30">{tournament.level}</span>}
                      {tournament.ageCategory && <span className="rounded-full bg-violet-500/15 px-2.5 py-1 text-[11px] font-bold text-violet-300 ring-1 ring-violet-500/30">U{tournament.ageCategory}</span>}
                    </div>
                  </div>
                </div>

                <dl className="mt-4 space-y-3 text-sm">
                  <div className="min-w-0">
                    <dt className="flex items-center gap-1.5 text-xs text-slate-500"><MapPin size={13} /> Location</dt>
                    <dd className="mt-1 break-words font-medium text-slate-200">{getLocation(tournament)}</dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="flex items-center gap-1.5 text-xs text-slate-500"><CalendarDays size={13} /> Dates</dt>
                    <dd className="mt-1 break-words font-medium text-slate-200">{formatDate(tournament.startingDate)} – {formatDate(tournament.endDate)}</dd>
                  </div>
                </dl>

                <button type="button" onClick={() => onEdit(tournament)} aria-label={`Edit ${tournament.title}`} className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-500">
                  <Pencil size={17} /> Edit Tournament
                </button>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default TournamentTable;
