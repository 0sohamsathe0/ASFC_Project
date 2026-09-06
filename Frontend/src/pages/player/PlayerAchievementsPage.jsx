import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Award,
  CalendarDays,
  CircleAlert,
  Medal,
  RefreshCw,
  ShieldCheck,
  Swords,
  Trophy,
} from "lucide-react";

import MeritCertificates from "../../components/Certificate/MeritCertificates";
import usePlayerResults from "../../hooks/usePlayerResults";
import { formatTournamentDates } from "../../utils/tournamentDisplay";

const views = [
  { id: "individual", label: "Individual", empty: "Your individual competition results will appear here." },
  { id: "team", label: "Team", empty: "Your team competition results will appear here." },
];

const medalConfig = {
  First: { label: "Gold", style: "border-amber-200 bg-amber-50 text-amber-800" },
  Second: { label: "Silver", style: "border-slate-300 bg-slate-100 text-slate-700" },
  Third: { label: "Bronze", style: "border-orange-200 bg-orange-50 text-orange-800" },
};

const AchievementCard = ({ achievement, onCertificate }) => {
  const medal = medalConfig[achievement.result?.place] || {
    label: achievement.result?.place || "Result",
    style: "border-blue-200 bg-blue-50 text-blue-700",
  };

  return (
    <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${medal.style}`}>
            {medal.label} · {achievement.result?.place} place
          </span>
          <h2 className="mt-3 break-words text-lg font-bold leading-6 text-slate-950 sm:text-xl sm:leading-7">
            {achievement.tournament?.title || "Tournament unavailable"}
          </h2>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Medal size={19} aria-hidden="true" />
        </span>
      </div>

      <dl className="mt-4 space-y-2.5 border-t border-slate-100 pt-4 text-sm text-slate-700">
        <div className="flex min-w-0 items-start gap-2.5">
          <Swords size={16} className="mt-0.5 shrink-0 text-blue-600" aria-hidden="true" />
          <dt className="sr-only">Event and category</dt>
          <dd className="break-words font-medium">
            {[achievement.player?.event, achievement.result?.category].filter(Boolean).join(" · ") || "Event unavailable"}
          </dd>
        </div>
        {achievement.tournament?.startingDate && (
          <div className="flex min-w-0 items-start gap-2.5">
            <CalendarDays size={16} className="mt-0.5 shrink-0 text-blue-600" aria-hidden="true" />
            <dt className="sr-only">Tournament dates</dt>
            <dd className="break-words">{formatTournamentDates(achievement.tournament.startingDate, achievement.tournament.endDate)}</dd>
          </div>
        )}
        {(achievement.tournament?.level || achievement.tournament?.ageCategory) && (
          <div className="flex min-w-0 items-start gap-2.5">
            <Trophy size={16} className="mt-0.5 shrink-0 text-blue-600" aria-hidden="true" />
            <dt className="sr-only">Tournament classification</dt>
            <dd className="break-words">
              {[achievement.tournament.level, achievement.tournament.ageCategory ? `Under ${achievement.tournament.ageCategory}` : ""].filter(Boolean).join(" · ")}
            </dd>
          </div>
        )}
      </dl>

      <button
        type="button"
        onClick={() => onCertificate(achievement)}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:w-auto"
      >
        <Award size={17} aria-hidden="true" /> View certificate
      </button>
    </article>
  );
};

const ResultState = ({ loading, error, empty, onRetry }) => {
  if (loading) {
    return <div className="grid gap-3 md:grid-cols-2" aria-label="Loading achievements">
      {[0, 1, 2, 3].map((item) => <div key={item} className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white" />)}
    </div>;
  }

  if (error) {
    return <div className="rounded-2xl border border-rose-200 bg-white px-4 py-8 text-center shadow-sm">
      <CircleAlert className="mx-auto text-rose-600" aria-hidden="true" />
      <h2 className="mt-3 text-lg font-bold text-slate-900">Results unavailable</h2>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-600">{error}</p>
      <button type="button" onClick={onRetry} className="mx-auto mt-4 flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
        <RefreshCw size={16} aria-hidden="true" /> Try again
      </button>
    </div>;
  }

  return <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center">
    <Medal className="mx-auto text-slate-400" aria-hidden="true" />
    <h2 className="mt-3 font-bold text-slate-900">No results yet</h2>
    <p className="mt-1 text-sm text-slate-500">{empty}</p>
  </div>;
};

const CertificateDialog = ({ achievement, onClose }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!achievement) return undefined;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="Certificate preview" onClick={onClose} className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-2 backdrop-blur-sm sm:p-5">
      <div ref={dialogRef} tabIndex={-1} onClick={(event) => event.stopPropagation()} className="flex h-[92dvh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:h-[86vh]">
        <MeritCertificates certificateData={achievement} onClose={onClose} />
      </div>
    </div>
  );
};

const PlayerAchievementsPage = () => {
  const [activeView, setActiveView] = useState("individual");
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const individual = usePlayerResults("individual");
  const team = usePlayerResults("team");
  const combinedResults = useMemo(() => [...individual.results, ...team.results], [individual.results, team.results]);
  const medalSummary = useMemo(() => ({
    total: combinedResults.length,
    Gold: combinedResults.filter((item) => item.result?.place === "First").length,
    Silver: combinedResults.filter((item) => item.result?.place === "Second").length,
    Bronze: combinedResults.filter((item) => item.result?.place === "Third").length,
  }), [combinedResults]);
  const activeResults = activeView === "individual" ? individual : team;
  const activeConfig = views.find((view) => view.id === activeView);
  const closeCertificate = useCallback(() => setSelectedCertificate(null), []);

  return (
    <div className="px-3 py-4 min-[360px]:px-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">Compete</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Achievements</h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">Your individual and team competition history, with certificates generated from recorded results.</p>
        </header>

        {!individual.loading && !team.loading && medalSummary.total > 0 && (
          <section aria-label="Medal summary" className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white"><ShieldCheck size={20} aria-hidden="true" /></span>
              <div><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Total medals</p><p className="text-2xl font-bold text-slate-950">{medalSummary.total}</p></div>
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-2 sm:mt-0 sm:min-w-[340px]">
              {["Gold", "Silver", "Bronze"].map((medal) => <div key={medal} className="rounded-xl bg-slate-50 px-3 py-2 text-center"><dt className="text-xs font-semibold text-slate-500">{medal}</dt><dd className="mt-0.5 text-lg font-bold text-slate-900">{medalSummary[medal]}</dd></div>)}
            </dl>
          </section>
        )}

        <div role="tablist" aria-label="Achievement type" className="mt-5 grid grid-cols-2 gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm sm:inline-grid sm:min-w-[340px]">
          {views.map((view) => <button key={view.id} type="button" role="tab" id={`achievement-tab-${view.id}`} aria-selected={activeView === view.id} aria-controls="player-achievement-panel" onClick={() => setActiveView(view.id)} className={`min-h-11 rounded-lg px-4 py-2 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 motion-reduce:transition-none ${activeView === view.id ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}>{view.label}</button>)}
        </div>

        <section id="player-achievement-panel" role="tabpanel" tabIndex={0} aria-labelledby={`achievement-tab-${activeView}`} className="mt-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
          {activeResults.loading || activeResults.error || activeResults.results.length === 0 ? (
            <ResultState loading={activeResults.loading} error={activeResults.error} empty={activeConfig.empty} onRetry={activeResults.retry} />
          ) : (
            <div className="grid min-w-0 gap-3 md:grid-cols-2 lg:gap-4">
              {activeResults.results.map((achievement) => <AchievementCard key={achievement._id} achievement={achievement} onCertificate={setSelectedCertificate} />)}
            </div>
          )}
        </section>
      </div>

      <CertificateDialog achievement={selectedCertificate} onClose={closeCertificate} />
    </div>
  );
};

export default PlayerAchievementsPage;
