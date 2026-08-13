import { motion } from "framer-motion";
import {
  CalendarDays,
  MapPin,
  Trophy,
  Users,
  ArrowUpRight,
} from "lucide-react";

const MobileUpcoming = ({ upcomingTournaments }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-4"
    >

      {/* Section Header */}
      <div className="px-1">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">

            <Trophy
              size={19}
              className="text-blue-600"
            />

          </div>

          <div>

            <h2 className="text-xl font-bold text-slate-900">
              Upcoming Tournaments
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Prepare for your next competition.
            </p>

          </div>

        </div>

      </div>

      {upcomingTournaments.length > 0 ? (

        <div className="space-y-4">

          {upcomingTournaments.map((tournament) => {

            const location = [
              tournament.locationCity,
              tournament.locationState,
            ]
              .filter(Boolean)
              .join(", ");

            return (

              <motion.div
                key={tournament.id}
                whileTap={{ scale: 0.98 }}
                className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50"
              >

                {/* Blue Accent */}
                <div className="absolute bottom-0 left-0 top-0 w-1.5 bg-gradient-to-b from-blue-600 to-blue-400" />

                <div className="p-5 pl-6">

                  {/* Top */}
                  <div className="flex items-start justify-between gap-4">

                    <div className="min-w-0 flex-1">

                      <h3 className="break-words text-lg font-bold leading-6 text-slate-900">
                        {tournament.title}
                      </h3>

                      {/* Date */}
                      <div className="mt-3 flex items-center gap-2 text-slate-500">

                        <CalendarDays
                          size={17}
                          className="shrink-0 text-blue-600"
                        />

                        <span className="text-sm">
                          {tournament.date ||
                            tournament.startingDate ||
                            "Date To Be Announced"}
                        </span>

                      </div>

                      {/* Location */}
                      {location && (
                        <div className="mt-2 flex items-center gap-2 text-slate-500">

                          <MapPin
                            size={17}
                            className="shrink-0 text-blue-600"
                          />

                          <span className="break-words text-sm">
                            {location}
                          </span>

                        </div>
                      )}

                    </div>

                    {/* Trophy */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">

                      <Trophy size={22} />

                    </div>

                  </div>

                  {/* Badges */}
                  {(tournament.level || tournament.ageCategory) && (

                    <div className="mt-5 flex flex-wrap gap-2">

                      {tournament.level && (
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          {tournament.level}
                        </span>
                      )}

                      {tournament.ageCategory && (
                        <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">

                          <Users size={12} />

                          Under {tournament.ageCategory}

                        </span>
                      )}

                    </div>

                  )}

                  {/* Footer */}
                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                    <span className="text-xs font-semibold text-blue-600">
                      Ready to compete
                    </span>

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">

                      <ArrowUpRight
                        size={17}
                        className="text-blue-600"
                      />

                    </div>

                  </div>

                </div>

              </motion.div>

            );
          })}

        </div>

      ) : (

        /* Empty State */
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg shadow-slate-200/50">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">

            <CalendarDays
              size={30}
              className="text-blue-600"
            />

          </div>

          <h3 className="mt-5 text-lg font-bold text-slate-800">
            No Upcoming Tournaments
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            New tournaments will appear here once announced by the club.
          </p>

        </div>

      )}

    </motion.section>
  );
};

export default MobileUpcoming;