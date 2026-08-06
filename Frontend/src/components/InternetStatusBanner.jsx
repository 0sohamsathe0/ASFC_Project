import { AnimatePresence, motion } from "framer-motion";
import { WifiOff, Wifi } from "lucide-react";
import { useServerStatus } from "../context/ServerStatusContext";

export default function InternetStatusBanner() {
  const {
    showInternetBanner,
    internetRecovered,
    isOnline,
  } = useServerStatus();

  return (
    <AnimatePresence>
      {showInternetBanner && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className={`fixed top-4 left-1/2 z-[9999] flex -translate-x-1/2 items-center gap-3 rounded-xl px-5 py-3 shadow-2xl text-white
            ${
              isOnline
                ? "bg-green-600"
                : "bg-red-600"
            }`}
        >
          {isOnline ? (
            <Wifi size={22} />
          ) : (
            <WifiOff size={22} />
          )}

          <div className="flex flex-col">
            <span className="font-semibold">
              {internetRecovered
                ? "Back Online"
                : "No Internet Connection"}
            </span>

            <span className="text-xs opacity-90">
              {internetRecovered
                ? "You're connected again."
                : "Some features may not work."}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}