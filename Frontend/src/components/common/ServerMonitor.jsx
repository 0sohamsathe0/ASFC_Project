import { useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useServerStatus } from "../../context/ServerStatusContext";
import { SERVER_DOWN_EVENT } from "../../utils/serverEvents";

const ServerMonitor = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { isServerDown, setIsServerDown } = useServerStatus();

  // Listen for server down events from Axios
  useEffect(() => {
    const handleServerDown = () => {
      setIsServerDown(true);
    };

    window.addEventListener(SERVER_DOWN_EVENT, handleServerDown);

    return () => {
      window.removeEventListener(SERVER_DOWN_EVENT, handleServerDown);
    };
  }, [setIsServerDown]);

  // Redirect to maintenance page
  useEffect(() => {
    if (!isServerDown) return;

    // Save current page
    if (location.pathname !== "/maintenance") {
      sessionStorage.setItem(
        "redirectAfterMaintenance",
        location.pathname + location.search
      );
    }

    const timer = setTimeout(() => {
      navigate("/maintenance", {
        replace: true,
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [isServerDown, navigate, location]);

  return (
    <Snackbar
      open={isServerDown}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <Alert
        severity="warning"
        variant="filled"
        sx={{ width: "100%" }}
      >
        Our servers are currently under maintenance. Redirecting...
      </Alert>
    </Snackbar>
  );
};

export default ServerMonitor;