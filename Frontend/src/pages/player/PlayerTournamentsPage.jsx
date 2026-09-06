import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CircleAlert,
  Clock3,
  MapPin,
  RefreshCw,
  Trophy,
  UsersRound,
} from "lucide-react";

import { api } from "../../components/api";
import {
  formatTournamentDates,
  formatTournamentLocation,
  groupTournamentsByStatus,
} from "../../utils/tournamentDisplay";

const views = [
  { id: "upcoming", label: "Upcoming", empty: "No upcoming tournaments right now." },
  { id: "ongoing", label: "Ongoing", empty: "No tournaments are currently in progress." },
  { id: "completed", label: "Completed", empty: "No completed tournaments available yet." },
];

const statusStyles = {
  upcoming: "border-blue-200 bg-blue-50 text-blue-700",
  ongoing: "border-emerald-200 bg-emerald-50 text-emerald-700",
  completed: "border-slate-200 bg-slate-100 text-slate-600",
};

const TournamentCard = ({ tournament, status }) => {
  const location = formatTournamentLocation(tournament);
  const statusLabel = views.find((view) => view.id === status)?.label || status;

  return (
    <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${statusStyles[status]}`}>
              {statusLabel}
            </span>
            {tournament.level && (
              <span className="rounded-full border border-blue-100 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-600">
                {tournament.level}
              </span>
            )}
          </div>
          <h2 className="mt-3 break-words text-lg font-bold leading-6 text-slate-950 sm:text-xl sm:leading-7">
            {tournament.title}
          </h2>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
          <Trophy size={19} aria-hidden="true" />
        </span>
      </div>

      {status === "ongoing" && (
        <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-emerald-700">
          <Clock3 size={16} aria-hidden="true" /> Currently in progress
        </p>
      )}

      <dl className="mt-4 space-y-3 border-t border-slate-100 pt-4 text-sm">
        <div className="flex min-w-0 items-start gap-3">
          <CalendarDays size={17} className="mt-0.5 shrink-0 text-blue-600" aria-hidden="true" />
          <dt className="sr-only">Tournament dates</dt>
          <dd className="break-words font-medium text-slate-700">
            {formatTournamentDates(tournament.startingDate, tournament.endDate)}
          </dd>
        </div>
        {location && (
          <div className="flex min-w-0 items-start gap-3">
            <MapPin size={17} className="mt-0.5 shrink-0 text-blue-600" aria-hidden="true" />
            <dt className="sr-only">Location</dt>
            <dd className="break-words font-medium text-slate-700">{location}</dd>
          </div>
        )}
        {tournament.ageCategory && (
          <div className="flex min-w-0 items-start gap-3">
            <UsersRound size={17} className="mt-0.5 shrink-0 text-blue-600" aria-hidden="true" />
            <dt className="sr-only">Age category</dt>
            <dd className="font-medium text-slate-700">Under {tournament.ageCategory}</dd>
          </div>
        )}
      </dl>
    </article>
  );
};

const PlayerTournamentsPage = () => {
  const [activeView, setActiveView] = useState("upcoming");
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    api.get("/tournament/all", { signal: controller.signal })
      .then((response) => setTournaments(response.data.data || []))
      .catch((apiError) => {
        if (apiError.code === "ERR_CANCELED") return;
        setError(apiError.response?.data?.message || "Tournament information is unavailable right now.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [attempt]);

  const grouped = useMemo(() => groupTournamentsByStatus(tournaments), [tournaments]);
  const activeConfig = views.find((view) => view.id === activeView);
  const activeTournaments = grouped[activeView];

  const retry = () => {
    setLoading(true);
    setError("");
    setAttempt((value) => value + 1);
  };

  return (
    <div className="px-3 py-4 min-[360px]:px-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">Compete</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Tournaments</h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            Follow upcoming competitions, events in progress, and the club tournament calendar.
          </p>
        </header>

        <div role="tablist" aria-label="Tournament status" className="grid grid-cols-3 gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm sm:inline-grid sm:min-w-[430px]">
          {views.map((view) => (
            <button
              key={view.id}
              type="button"
              role="tab"
              id={`tournament-tab-${view.id}`}
              aria-selected={activeView === view.id}
              aria-controls="player-tournament-panel"
              onClick={() => setActiveView(view.id)}
              className={`min-h-11 min-w-0 rounded-lg px-2 py-2 text-xs font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 motion-reduce:transition-none min-[360px]:text-sm ${
                activeView === view.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span className="block truncate">{view.label}</span>
              {!loading && !error && <span className={`mt-0.5 block text-[10px] ${activeView === view.id ? "text-blue-100" : "text-slate-400"}`}>{grouped[view.id].length}</span>}
            </button>
          ))}
        </div>

        <section
          id="player-tournament-panel"
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={`tournament-tab-${activeView}`}
          className="mt-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          {loading ? (
            <div className="grid gap-3 md:grid-cols-2" aria-label="Loading tournaments">
              {[0, 1, 2, 3].map((item) => <div key={item} className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-white" />)}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-rose-200 bg-white px-4 py-8 text-center shadow-sm">
              <CircleAlert className="mx-auto text-rose-600" aria-hidden="true" />
              <h2 className="mt-3 text-lg font-bold text-slate-900">Tournament calendar unavailable</h2>
              <p className="mx-auto mt-1 max-w-md text-sm text-slate-600">{error}</p>
              <button type="button" onClick={retry} className="mx-auto mt-4 flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                <RefreshCw size={16} aria-hidden="true" /> Try again
              </button>
            </div>
          ) : activeTournaments.length ? (
            <div className="grid min-w-0 gap-3 md:grid-cols-2 lg:gap-4">
              {activeTournaments.map((tournament) => <TournamentCard key={tournament._id} tournament={tournament} status={activeView} />)}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center">
              <Trophy className="mx-auto text-slate-400" aria-hidden="true" />
              <h2 className="mt-3 font-bold text-slate-900">{activeConfig.empty}</h2>
              <p className="mt-1 text-sm text-slate-500">The latest club competition information will appear here.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default PlayerTournamentsPage;
