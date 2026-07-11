import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Trophy,
} from "lucide-react";

import MobileResultCard from "./MobileResultCard";

const MobileResultsSection = ({
  title,
  results
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-white shadow-lg overflow-hidden"
    >
      {/* Header */}

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 flex justify-between items-center"
      >
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-purple-100 flex items-center justify-center">
            <Trophy
              size={22}
              className="text-purple-700"
            />
          </div>

          <div className="text-left">
            <h2 className="text-lg font-bold text-gray-900">
              {title}
            </h2>

            <p className="text-sm text-gray-500">
              {results.length} Result
              {results.length !== 1 && "s"}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-gray-100 p-2">
          {expanded ? (
            <ChevronUp
              size={20}
              className="text-gray-700"
            />
          ) : (
            <ChevronDown
              size={20}
              className="text-gray-700"
            />
          )}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.3,
            }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              {results.length > 0 ? (
                <div className="space-y-5">
                  {results.map((result) => (
                    <MobileResultCard
                      key={result._id}
                      result={result}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-100">
                    <Trophy
                      size={28}
                      className="text-purple-700"
                    />
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-gray-800">
                    No Results Yet
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Your tournament results will
                    appear here once competitions
                    are completed.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default MobileResultsSection;