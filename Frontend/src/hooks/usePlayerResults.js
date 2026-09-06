import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../components/api";

const usePlayerResults = (type) => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    api.get(`/result/player/${type}`, { signal: controller.signal })
      .then((response) => setResults(response.data.data || []))
      .catch((apiError) => {
        if (apiError.code === "ERR_CANCELED") return;
        if ([401, 403].includes(apiError.response?.status)) {
          navigate("/player/login", { replace: true });
          return;
        }
        setError(apiError.response?.data?.message || `Unable to load ${type} results.`);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [attempt, navigate, type]);

  const retry = useCallback(() => {
    setLoading(true);
    setError("");
    setAttempt((value) => value + 1);
  }, []);

  return { results, loading, error, retry };
};

export default usePlayerResults;
