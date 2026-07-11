import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CertificateExporter from "../../../components/Certificate/CertificateExporter";

import {
  Award,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Download,
  MapPin,
  Medal,
} from "lucide-react";

const medalColors = {
  First: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-300",
  },
  Second: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-300",
  },
  Third: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-300",
  },
};

const MobileResultCard = ({
  result,
}) => {
  const [expanded, setExpanded] = useState(false);

  const medal =
    medalColors[result.result.place] || {
      bg: "bg-purple-100",
      text: "text-purple-700",
      border: "border-purple-300",
    };

  return (
    <motion.div
      layout
      transition={{ duration: 0.25 }}
      className={`overflow-hidden rounded-2xl border border-gray-300 bg-gray-50 transition-all duration-300 ${expanded ? "shadow-lg" : "shadow-sm"
        }`}
    >
      {/* Summary */}

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left active:scale-[0.99] transition-transform"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div
              className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border ${medal.bg} ${medal.text} ${medal.border}`}
            >
              <Medal size={20} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="break-words text-sm font-semibold leading-5 text-gray-900">
                {result.tournament.title}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {result.result.place} Place
              </p>
            </div>
          </div>

          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
            {expanded ? (
              <ChevronUp size={18} className="text-gray-600" />
            ) : (
              <ChevronDown size={18} className="text-gray-600" />
            )}
          </div>
        </div>
      </button>

      {/* Expanded */}

      <AnimatePresence>
        {expanded && (
          <motion.div
            layout
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.25,
            }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <Award
                      size={18}
                      className="text-purple-600"
                    />

                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Category
                      </p>

                      <p className="font-medium">
                        {result.result.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CalendarDays
                      size={18}
                      className="text-purple-600"
                    />

                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Date
                      </p>

                      <p className="font-medium">
                        {new Date(
                          result.tournament.startingDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {(result.tournament.locationCity ||
                    result.tournament.locationState) && (
                      <div className="flex items-center gap-3">
                        <MapPin
                          size={18}
                          className="text-purple-600"
                        />

                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500">
                            Venue
                          </p>

                          <p className="font-medium">
                            {[
                              result.tournament.locationCity,
                              result.tournament.locationState,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        </div>
                      </div>
                    )}

                  <CertificateExporter certificateData={result}>
                    {(downloadCertificate) => (
                      <button
                        onClick={downloadCertificate}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 py-3 font-semibold text-white shadow-md transition-all hover:from-purple-700 hover:to-violet-700 active:scale-[0.98]"
                      >
                        <Download size={18} />

                        Download Certificate
                      </button>
                    )}
                  </CertificateExporter>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MobileResultCard;