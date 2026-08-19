import { Check, UserRound, X } from "lucide-react";
import { useState } from "react";

import { getOptimizedPlayerPhoto } from "./attendance-ui";

const AttendancePlayerCard = ({ player, position, total, submitting, onMark }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const optimizedPhoto = getOptimizedPlayerPhoto(player.photoURL);

  return (
  <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/20">
    <div className="border-b border-slate-800 bg-slate-900 px-6 py-4">
      <p className="text-sm font-medium text-slate-400">
        Player {position} of {total}
      </p>
    </div>

    <div className="p-8">
      <div className="flex flex-col items-center text-center">
        {optimizedPhoto ? (
          <div className="relative h-28 w-28 overflow-hidden rounded-full bg-slate-800 ring-4 ring-slate-800">
            {!imageLoaded && (
              <div className="absolute inset-0 flex animate-pulse items-center justify-center text-slate-500">
                <UserRound size={42} />
              </div>
            )}
            <img
              src={optimizedPhoto}
              alt={player.fullName}
              loading="eager"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              className={`h-full w-full object-cover transition-opacity duration-200 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        ) : (
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-slate-800 text-slate-500">
            <UserRound size={44} />
          </div>
        )}

        <h2 className="mt-5 text-2xl font-bold text-white">
          {player.fullName}
        </h2>
        <span className="mt-2 rounded-full bg-slate-800 px-3 py-1 text-sm font-medium text-slate-300">
          {player.event}
        </span>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          disabled={submitting}
          onClick={() => onMark("Present")}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Check size={20} />
          Present
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={() => onMark("Absent")}
          className="flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <X size={20} />
          Absent
        </button>
      </div>

      {submitting && (
        <p className="mt-4 text-center text-sm text-slate-400">
          Saving attendance...
        </p>
      )}
    </div>
  </div>
  );
};

export default AttendancePlayerCard;
