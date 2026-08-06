import { createContext, useContext, useEffect, useRef, useState } from "react";

const ServerStatusContext = createContext();

export const ServerStatusProvider = ({ children }) => {
  // Existing backend maintenance state
  const [isServerDown, setIsServerDown] = useState(false);

  // Internet status
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Banner visibility
  const [showInternetBanner, setShowInternetBanner] = useState(false);

  // false = red banner
  // true = green banner
  const [internetRecovered, setInternetRecovered] = useState(false);

  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleOffline = () => {
      clearTimeout(timeoutRef.current);

      setIsOnline(false);
      setInternetRecovered(false);
      setShowInternetBanner(true);
    };

    const handleOnline = () => {
      clearTimeout(timeoutRef.current);

      setIsOnline(true);
      setInternetRecovered(true);
      setShowInternetBanner(true);

      timeoutRef.current = setTimeout(() => {
        setShowInternetBanner(false);
      }, 3000);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);

      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <ServerStatusContext.Provider
      value={{
        // Existing
        isServerDown,
        setIsServerDown,

        // Internet
        isOnline,
        showInternetBanner,
        internetRecovered,
      }}
    >
      {children}
    </ServerStatusContext.Provider>
  );
};

export const useServerStatus = () => useContext(ServerStatusContext);