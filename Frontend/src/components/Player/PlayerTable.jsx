import { CalendarDays, Mail, Pencil, Phone, School, UserRound } from "lucide-react";

const STATUS_STYLES = {
  Accepted: {
    border: "border-emerald-500",
    text: "text-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  },
  Pending: {
    border: "border-amber-400",
    text: "text-amber-300",
    badge: "bg-amber-500/15 text-amber-200 ring-amber-500/30",
  },
  Rejected: {
    border: "border-rose-500",
    text: "text-rose-400",
    badge: "bg-rose-500/15 text-rose-300 ring-rose-500/30",
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

const PlayerTable = ({ title, data = [], onEdit }) => {
  const styles = STATUS_STYLES[title] || STATUS_STYLES.Pending;

  return (
    <section className={`overflow-hidden rounded-xl border-l-4 bg-slate-800 shadow-lg shadow-black/10 ${styles.border}`}>
      <header className="flex items-center justify-between gap-3 border-b border-slate-700 px-4 py-4 sm:px-5">
        <h2 className={`min-w-0 font-semibold sm:text-lg ${styles.text}`}>
          {title} Players
        </h2>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ring-1 ${styles.badge}`}>
          {data.length}
        </span>
      </header>

      {data.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-slate-400">
          No {title.toLowerCase()} players
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-slate-600 text-left text-slate-300">
                  <th className="px-5 py-3 font-semibold">Player</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Gender</th>
                  <th className="px-4 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((player) => (
                  <tr key={player._id} className="border-b border-slate-700 transition last:border-b-0 hover:bg-slate-700/70">
                    <td className="px-5 py-3">
                      <div className="flex min-w-0 items-center gap-3">
                        {player.photoURL ? (
                          <img src={player.photoURL} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-slate-600" />
                        ) : (
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700 text-slate-400">
                            <UserRound size={19} />
                          </span>
                        )}
                        <span className="max-w-56 break-words font-medium text-white">{player.fullName}</span>
                      </div>
                    </td>
                    <td className="max-w-72 break-all px-4 py-3 text-slate-300">{player.email}</td>
                    <td className="px-4 py-3 text-slate-300">{player.gender}</td>
                    <td className="px-4 py-3 text-right">
                      <button type="button" onClick={() => onEdit(player)} aria-label={`Edit ${player.fullName}`} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-500">
                        <Pencil size={16} /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 p-3 md:hidden">
            {data.map((player) => (
              <article key={player._id} className="min-w-0 rounded-xl border border-slate-700 bg-slate-900/70 p-4 shadow-sm">
                <div className="flex min-w-0 items-start gap-3">
                  {player.photoURL ? (
                    <img src={player.photoURL} alt={`${player.fullName} profile`} className="h-14 w-14 shrink-0 rounded-xl object-cover ring-1 ring-slate-600" />
                  ) : (
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-400">
                      <UserRound size={24} />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="break-words font-bold leading-snug text-white">{player.fullName}</h3>
                    <span className={`mt-1.5 inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${styles.badge}`}>{title}</span>
                  </div>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 text-sm">
                  <div className="min-w-0">
                    <dt className="text-xs text-slate-500">Event</dt>
                    <dd className="mt-0.5 break-words font-medium text-slate-200">{player.event || "Not provided"}</dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="text-xs text-slate-500">Gender</dt>
                    <dd className="mt-0.5 break-words font-medium text-slate-200">{player.gender || "Not provided"}</dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="flex items-center gap-1 text-xs text-slate-500"><CalendarDays size={13} /> DOB</dt>
                    <dd className="mt-0.5 text-slate-200">{formatDate(player.dob)}</dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="flex items-center gap-1 text-xs text-slate-500"><Phone size={13} /> Phone</dt>
                    <dd className="mt-0.5 break-words text-slate-200">{player.phone || "Not provided"}</dd>
                  </div>
                </dl>

                <div className="mt-3 min-w-0 border-t border-slate-800 pt-3">
                  <p className="flex items-center gap-1 text-xs text-slate-500"><School size={13} /> School / College</p>
                  <p className="mt-1 break-words text-sm text-slate-200">{player.institute || "Not provided"}</p>
                </div>

                <details className="mt-3 rounded-lg bg-slate-800/70 px-3 py-2 text-sm">
                  <summary className="cursor-pointer font-semibold text-blue-300">More details</summary>
                  <div className="mt-3 space-y-2 border-t border-slate-700 pt-3 text-slate-300">
                    <p className="flex min-w-0 items-start gap-2"><Mail size={14} className="mt-0.5 shrink-0" /><span className="break-all">{player.email || "Email not provided"}</span></p>
                    <p className="break-words"><span className="text-slate-500">Aadhaar:</span> {player.aadharCard || "Not provided"}</p>
                    <p className="break-words"><span className="text-slate-500">FAI ID:</span> {player.faiId || "Not provided"}</p>
                    <p className="break-words"><span className="text-slate-500">MFA ID:</span> {player.mfaId || "Not provided"}</p>
                    <p className="break-words"><span className="text-slate-500">Address:</span> {[player.address?.addressLine1, player.address?.addressLine2, player.address?.pincode].filter(Boolean).join(", ") || "Not provided"}</p>
                  </div>
                </details>

                <button type="button" onClick={() => onEdit(player)} className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-500" aria-label={`Edit ${player.fullName}`}>
                  <Pencil size={17} /> Edit Player
                </button>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default PlayerTable;
