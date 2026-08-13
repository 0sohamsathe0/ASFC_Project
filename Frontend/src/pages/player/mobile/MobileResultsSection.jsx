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
  results,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50"
    >

      {/* Header */}

      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-blue-50/40 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
      >

        <div className="flex min-w-0 items-center gap-4">

          {/* Trophy Icon */}

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50">

            <Trophy
              size={22}
              className="text-blue-600"
            />

          </div>

          {/* Title */}

          <div className="min-w-0">

            <h2 className="break-words text-lg font-bold text-slate-900">
              {title}
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              {results.length} Result
              {results.length !== 1 && "s"}
            </p>

          </div>

        </div>

        {/* Expand Button */}

        <div
          className={`ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
            expanded
              ? "bg-blue-100 text-blue-600"
              : "bg-slate-100 text-slate-600"
          }`}
        >

          {expanded ? (
            <ChevronUp size={19} />
          ) : (
            <ChevronDown size={19} />
          )}

        </div>

      </button>

      {/* Results */}

      <AnimatePresence initial={false}>

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

            <div className="border-t border-slate-100 px-5 pb-5 pt-4">

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

                /* Empty State */

                <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/50 p-8 text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">

                    <Trophy
                      size={27}
                      className="text-blue-600"
                    />

                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-slate-800">
                    No Results Yet
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Your tournament results will appear here once
                    competitions are completed.
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