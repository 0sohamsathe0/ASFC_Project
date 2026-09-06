import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PublicButton } from "../components/public/PublicUI";
import { RefreshCw } from "lucide-react";

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
    <main
      id="public-content"
      className="public-site public-section public-utility"
    >
      <div className="public-container">
        <p className="public-eyebrow">All Star Fencing Club · Solapur</p>
        <h1 className="public-display">
          A short pause.
          <br />
          We'll be back.
        </h1>
        <p className="public-copy mt-6">
          The club service is temporarily unavailable. We'll reconnect you as
          soon as it is ready.
        </p>
        <p className="public-small mt-6">Automatic retry in {countdown}s</p>
        <PublicButton
          onClick={handleRetry}
          disabled={checking}
          className="mt-6"
        >
          <RefreshCw size={16} />
          {checking ? "Checking…" : "Try Again"}
        </PublicButton>
      </div>
    </main>
  );
};

export default Maintenance;
