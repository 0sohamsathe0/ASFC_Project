import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BuildRounded,
  RefreshRounded,
  WifiOffRounded,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

import { checkServer } from "../utils/checkServer";
import { useServerStatus } from "../context/ServerStatusContext";

const Maintenance = () => {
  const navigate = useNavigate();
  const { setIsServerDown } = useServerStatus();

  const [checking, setChecking] = useState(false);
  const [countdown, setCountdown] = useState(10);

  const redirectPath =
    sessionStorage.getItem("redirectAfterMaintenance") || "/";

  const handleRetry = async () => {
    if (checking) return;

    setChecking(true);

    const live = await checkServer();

    if (live) {
      setIsServerDown(false);

      sessionStorage.removeItem("redirectAfterMaintenance");

      navigate(redirectPath, { replace: true });
      return;
    }

    setChecking(false);
  };

  useEffect(() => {
    const retryInterval = setInterval(async () => {
      const live = await checkServer();

      if (live) {
        setIsServerDown(false);

        sessionStorage.removeItem("redirectAfterMaintenance");

        navigate(redirectPath, { replace: true });
      }
    }, 10000);

    return () => clearInterval(retryInterval);
  }, [navigate, redirectPath, setIsServerDown]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 10 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-xl"
      >
        <motion.div
          animate={{
            rotate: [0, -15, 15, -15, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
          }}
          className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-amber-500/20"
        >
          <BuildRounded sx={{ fontSize: 50, color: "#f59e0b" }} />
        </motion.div>

        <h1 className="mb-3 text-4xl font-bold text-white">
          Server Under Maintenance
        </h1>

        <p className="mx-auto mb-8 max-w-md text-slate-300">
          Our servers are temporarily unavailable while we perform maintenance.
          We are working hard to restore the service as quickly as possible.
        </p>

        <div className="mb-8 flex items-center justify-center gap-2 text-amber-400">
          <WifiOffRounded />
          <span className="text-sm">
            Automatic retry in{" "}
            <span className="font-semibold">{countdown}s</span>
          </span>
        </div>

        <button
          onClick={handleRetry}
          disabled={checking}
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-semibold text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {checking ? (
            <>
              <CircularProgress size={18} color="inherit" />
              Checking...
            </>
          ) : (
            <>
              <RefreshRounded />
              Try Again
            </>
          )}
        </button>

        <p className="mt-8 text-xs text-slate-500">
          If the issue persists, please try again in a few minutes.
        </p>
      </motion.div>
    </div>
  );
};

export default Maintenance;