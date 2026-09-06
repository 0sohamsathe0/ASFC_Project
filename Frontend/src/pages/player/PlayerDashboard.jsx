import { createElement, useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CalendarCheck2,
  Check,
  CircleAlert,
  Clock3,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Swords,
  Trophy,
  UserRound,
  X,
} from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";

import PlayerQuickActions from "../../components/Player/PlayerQuickActions";
import { api } from "../../components/api";
import usePlayerAttendance from "../../hooks/usePlayerAttendance";
import {
  formatTournamentDates,
  formatTournamentLocation,
} from "../../utils/tournamentDisplay";

const learningPreview = [
  {
    id: "watch",
    title: "Watch Competition",
    description: "Study elite bouts, distance and decision-making.",
    icon: Trophy,
  },
  {
    id: "technique",
    title: "Technique",
    description: "Build sharper footwork, blade work and timing.",
    icon: Swords,
  },
  {
    id: "rules",
    title: "Rules & Tactics",
    description: "Understand scoring, penalties and bout strategy.",
    icon: BookOpen,
  },
];

const statusStyles = {
  Accepted: {
    badge: "bg-emerald-500 text-white shadow-emerald-950/25",
    dot: "bg-emerald-200",
  },
  Pending: {
    badge: "bg-amber-400 text-slate-950 shadow-amber-950/20",
    dot: "bg-amber-700",
  },
  Rejected: {
    badge: "bg-rose-500 text-white shadow-rose-950/25",
    dot: "bg-rose-200",
  },
};

const PlayerAvatar = ({ fullName, photoURL }) => {
  const [failedPhotoURL, setFailedPhotoURL] = useState("");
  const showPhoto = Boolean(photoURL) && failedPhotoURL !== photoURL;

  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-white/80 bg-blue-400/15 text-blue-100 shadow-lg shadow-slate-950/25 sm:h-20 sm:w-20">
      {showPhoto ? (
        <img
          src={photoURL}
          alt={`${fullName || "Player"}'s profile`}
          onError={() => setFailedPhotoURL(photoURL)}
          className="h-full w-full object-cover object-top"
        />
      ) : (
        <UserRound size={30} aria-label="Default player avatar" />
      )}
    </div>
  );
};

const PlayerIdentityHero = ({ player }) => {
  const fullName = player?.fullName?.trim() || "ASFC Athlete";
  const eventName = player?.event?.trim() || "Fencer";
  const status = player?.requestStatus || "Pending";
  const statusStyle = statusStyles[status] || statusStyles.Pending;
  const membershipId = player?.mfaId?.trim() || player?.faiId?.trim();
  const membershipLabel = player?.mfaId?.trim() ? "MFA ID" : "FAI ID";

  return (
    <section className="relative overflow-hidden rounded-2xl border border-blue-800/60 bg-gradient-to-br from-[#07111F] via-[#0B1D35] to-blue-900 px-4 py-4 text-white shadow-sm sm:px-5 sm:py-5">
      <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-blue-300/10 blur-3xl" />
      <Swords
        size={92}
        className="pointer-events-none absolute bottom-0 right-5 hidden -rotate-12 text-white/[0.045] sm:block"
        aria-hidden="true"
      />

      <div className="relative grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-3 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-x-5">
        <PlayerAvatar fullName={fullName} photoURL={player?.photoURL} />

        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-blue-300 sm:text-[10px]">
            Player portal
          </p>
          <h2 className="mt-0.5 break-words text-xl font-bold leading-tight tracking-tight text-white sm:text-2xl lg:text-3xl">
            {fullName}
          </h2>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-blue-100 sm:text-sm">
            <span>{eventName}</span>
            {membershipId && (
              <>
                <span className="text-blue-400" aria-hidden="true">•</span>
                <span className="break-all">
                  <span className="text-blue-300">{membershipLabel}</span>{" "}
                  {membershipId}
                </span>
              </>
            )}
          </div>
          <p className="mt-1.5 hidden text-xs text-blue-200/80 min-[390px]:block sm:text-sm">
            Ready for your next challenge?
          </p>
        </div>

        <span
          className={`col-start-2 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold shadow-lg sm:col-start-3 sm:row-start-1 sm:px-4 sm:py-2 ${statusStyle.badge}`}
        >
          <span className={`h-2 w-2 rounded-full ${statusStyle.dot}`} aria-hidden="true" />
          {status}
        </span>
      </div>

      <PlayerStatusNotice player={player} />
    </section>
  );
};

const WidgetError = ({ message, onRetry }) => (
  <div className="flex min-h-36 flex-col items-center justify-center rounded-xl border border-rose-200 bg-rose-50 p-5 text-center">
    <AlertCircle size={22} className="text-rose-600" aria-hidden="true" />
    <p className="mt-2 text-sm font-medium text-rose-800">{message}</p>
    <button
      type="button"
      onClick={onRetry}
      className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
    >
      <RefreshCw size={15} aria-hidden="true" /> Try again
    </button>
  </div>
);

const PlayerStatusNotice = ({ player }) => {
  if (!player?.requestStatus || player.requestStatus === "Accepted") return null;

  const isRejected = player.requestStatus === "Rejected";

  return (
    <section
      aria-live="polite"
      className={`mt-3 flex flex-col gap-3 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${
        isRejected
          ? "border-rose-200 bg-rose-50"
          : "border-amber-200 bg-amber-50"
      }`}
    >
      <div className="flex min-w-0 items-start gap-3">
        <CircleAlert
          size={19}
          className={`mt-0.5 shrink-0 ${
            isRejected ? "text-rose-600" : "text-amber-600"
          }`}
          aria-hidden="true"
        />
        <div className="min-w-0">
          <p
            className={`text-sm font-bold ${
              isRejected ? "text-rose-900" : "text-amber-900"
            }`}
          >
            {isRejected
              ? "Your registration needs a correction."
              : "Your club registration is being reviewed."}
          </p>
          {isRejected && player.rejectionReason && (
            <p className="mt-1 break-words text-sm leading-5 text-rose-700">
              {player.rejectionReason}
            </p>
          )}
        </div>
      </div>
      {isRejected && (
        <Link
          to="/player/profile/edit"
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
        >
          Correct profile <ArrowRight size={15} aria-hidden="true" />
        </Link>
      )}
    </section>
  );
};

const AttendanceSummary = () => {
  const { statistics, loading, error, retry } = usePlayerAttendance();

  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
            This month
          </p>
          <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
            Attendance
          </h2>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <CalendarCheck2 size={20} aria-hidden="true" />
        </span>
      </div>

      {loading ? (
        <div className="mt-4 grid min-h-36 animate-pulse grid-cols-2 gap-2" aria-label="Loading attendance summary">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : error ? (
        <div className="mt-4">
          <WidgetError
            message={error}
            onRetry={() => {
              retry();
            }}
          />
        </div>
      ) : statistics.totalSessions === 0 ? (
        <div className="mt-4 flex min-h-36 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
          <Clock3 size={22} className="text-slate-400" aria-hidden="true" />
          <p className="mt-2 font-semibold text-slate-800">No attendance records yet</p>
          <p className="mt-1 text-sm leading-5 text-slate-500">
            Attendance will appear after your first recorded session.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          <div className="col-span-2 flex items-end justify-between rounded-xl bg-blue-600 px-4 py-3 text-white">
            <div>
              <p className="text-xs font-medium text-blue-100">Attendance rate</p>
              <p className="mt-0.5 text-3xl font-bold leading-none">
                {statistics.attendancePercentage}%
              </p>
            </div>
            <ShieldCheck size={24} className="text-blue-200" aria-hidden="true" />
          </div>
          {[
            ["Recorded", statistics.totalSessions, Clock3, "text-slate-600"],
            ["Present", statistics.presentCount, Check, "text-emerald-600"],
            ["Absent", statistics.absentCount, X, "text-rose-600"],
          ].map(([label, value, Icon, color]) => (
            <div
              key={label}
              className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2.5 sm:px-3"
            >
              {createElement(Icon, {
                size: 15,
                className: color,
                "aria-hidden": true,
              })}
              <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      )}

      <Link
        to="/player/attendance"
        className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        View attendance <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </section>
  );
};

const NextUp = () => {
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    api
      .get("/tournament/all", {
        params: { type: "upcoming" },
        signal: controller.signal,
      })
      .then((response) => {
        setTournament(response.data.data?.[0] || null);
      })
      .catch((apiError) => {
        if (apiError.code === "ERR_CANCELED") return;
        setError(
          apiError.response?.data?.message ||
            "Tournament information is unavailable right now.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [attempt]);

  const location = tournament ? formatTournamentLocation(tournament) : "";

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">
      <div className="border-b border-blue-100 bg-blue-50/70 px-4 py-4 sm:px-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
              Next Up
            </p>
            <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
              Your next challenge
            </h2>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Trophy size={20} aria-hidden="true" />
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        {loading ? (
          <div className="min-h-44 animate-pulse space-y-3" aria-label="Loading upcoming tournament">
            <div className="h-6 w-4/5 rounded bg-slate-100" />
            <div className="h-4 w-2/3 rounded bg-slate-100" />
            <div className="h-4 w-1/2 rounded bg-slate-100" />
          </div>
        ) : error ? (
          <WidgetError
            message={error}
            onRetry={() => {
              setLoading(true);
              setError("");
              setAttempt((value) => value + 1);
            }}
          />
        ) : tournament ? (
          <div className="min-h-44">
            <div className="flex flex-wrap gap-2">
              {tournament.level && (
                <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700">
                  {tournament.level}
                </span>
              )}
              {tournament.ageCategory && (
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                  Under {tournament.ageCategory}
                </span>
              )}
            </div>
            <h3 className="mt-3 break-words text-xl font-bold leading-7 text-slate-900">
              {tournament.title}
            </h3>
            <dl className="mt-4 space-y-2.5 text-sm text-slate-600">
              <div className="flex min-w-0 items-start gap-2">
                <Clock3 size={16} className="mt-0.5 shrink-0 text-blue-600" aria-hidden="true" />
                <dt className="sr-only">Date</dt>
                <dd className="break-words">
                  {formatTournamentDates(
                    tournament.startingDate,
                    tournament.endDate,
                  )}
                </dd>
              </div>
              {location && (
                <div className="flex min-w-0 items-start gap-2">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-blue-600" aria-hidden="true" />
                  <dt className="sr-only">Location</dt>
                  <dd className="break-words">{location}</dd>
                </div>
              )}
            </dl>
          </div>
        ) : (
          <div className="flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
            <Trophy size={24} className="text-slate-400" aria-hidden="true" />
            <p className="mt-3 font-bold text-slate-800">No upcoming tournaments</p>
            <p className="mt-1 max-w-sm text-sm leading-5 text-slate-500">
              You're all caught up. New tournaments will appear here.
            </p>
          </div>
        )}

        <Link
          to="/player/tournaments"
          className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          View tournaments <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
};

const LearningPreview = () => (
  <section
    id="learn-to-fence"
    aria-labelledby="learn-to-fence-title"
    className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
          Develop
        </p>
        <h2 id="learn-to-fence-title" className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
          Learn to Fence
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Build your understanding beyond practice.
        </p>
      </div>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <BookOpen size={20} aria-hidden="true" />
      </span>
    </div>

    <div className="mt-4 grid gap-2.5 md:grid-cols-3">
      {learningPreview.map(({ id, title, description, icon: Icon }) => (
        <article key={id} className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
          {createElement(Icon, {
            size: 18,
            className: "text-blue-600",
            "aria-hidden": true,
          })}
          <h3 className="mt-2 font-bold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm leading-5 text-slate-500">{description}</p>
        </article>
      ))}
    </div>
  </section>
);

const PlayerDashboard = () => {
  const { player } = useOutletContext();

  return (
    <div className="min-h-full bg-slate-100 px-3 py-4 sm:px-5 sm:py-5 lg:px-7 lg:py-6">
      <div className="mx-auto min-w-0 max-w-6xl space-y-5">
        <PlayerIdentityHero player={player} />

        <PlayerQuickActions />

        <div className="grid min-w-0 items-start gap-4 md:grid-cols-2">
          <NextUp />
          <AttendanceSummary />
        </div>

        <LearningPreview />
        <div className="h-2" aria-hidden="true" />
      </div>
    </div>
  );
};

export default PlayerDashboard;
