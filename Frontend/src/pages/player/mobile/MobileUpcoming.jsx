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
        <h2 className="text-xl font-bold text-gray-900">
          Upcoming Tournaments
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Prepare for your next competition.
        </p>
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
                className="relative overflow-hidden rounded-3xl bg-white shadow-lg"
              >
                {/* Accent Bar */}
                <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-purple-600 to-indigo-600" />

                <div className="p-5 pl-6">
                  {/* Top */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 leading-6">
                        {tournament.title}
                      </h3>

                      <div className="mt-3 flex items-center gap-2 text-gray-500">
                        <CalendarDays size={17} />

                        <span className="text-sm">
                          {tournament.date ||
                            tournament.startingDate ||
                            "Date To Be Announced"}
                        </span>
                      </div>

                      {location && (
                        <div className="mt-2 flex items-center gap-2 text-gray-500">
                          <MapPin size={17} />

                          <span className="text-sm">
                            {location}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="rounded-2xl bg-purple-100 p-3 text-purple-700">
                      <Trophy size={24} />
                    </div>
                  </div>

                  {/* Badges */}
                  {(tournament.level || tournament.ageCategory) && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {tournament.level && (
                        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                          {tournament.level}
                        </span>
                      )}

                      {tournament.ageCategory && (
                        <span className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          <Users size={12} />
                          Under {tournament.ageCategory}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-5 flex items-center justify-between border-t pt-4">
                    <span className="text-sm font-medium text-purple-700">
                      Ready to compete
                    </span>

                    <ArrowUpRight
                      size={20}
                      className="text-purple-600"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
            <CalendarDays
              size={30}
              className="text-purple-600"
            />
          </div>

          <h3 className="mt-5 text-lg font-bold text-gray-800">
            No Upcoming Tournaments
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            New tournaments will appear here once announced by the club.
          </p>
        </div>
      )}
    </motion.section>
  );
};

export default MobileUpcoming;