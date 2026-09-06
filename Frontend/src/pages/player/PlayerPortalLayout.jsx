import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import PlayerMobileDrawer from "../../components/Player/PlayerMobileDrawer";
import PlayerSidebar from "../../components/Player/PlayerSidebar";
import PlayerTopbar from "../../components/Player/PlayerTopbar";
import { getPlayerPageTitle } from "../../components/Player/playerNavigationConfig";
import { api } from "../../components/api";
import { useAuth } from "../../context/AuthContext";

const toPlayerSummary = (player, identityLoaded = false) => ({
  id: player?.id || player?._id,
  role: "player",
  fullName: player?.fullName || "",
  event: player?.event || "",
  photoURL: player?.photoURL || "",
  faiId: player?.faiId || "",
  mfaId: player?.mfaId || "",
  hasFaiRegistration: player?.hasFaiRegistration ?? true,
  hasMfaRegistration: player?.hasMfaRegistration ?? true,
  requestStatus: player?.requestStatus || "",
  rejectionReason: player?.rejectionReason || "",
  identityLoaded: player?.identityLoaded || identityLoaded,
});

const PlayerPortalLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();
  const [fetchedPlayer, setFetchedPlayer] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuButtonRef = useRef(null);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const player = user?.fullName ? toPlayerSummary(user) : fetchedPlayer;

  useEffect(() => {
    if (user?.identityLoaded) return undefined;

    const controller = new AbortController();

    api
      .get("/player/profile", { signal: controller.signal })
      .then((response) => {
        const summary = toPlayerSummary(response.data.player, true);
        setFetchedPlayer(summary);
        login(summary);
      })
      .catch((error) => {
        if (error.code === "ERR_CANCELED") return;
        if ([401, 403].includes(error.response?.status)) {
          navigate("/player/login", { replace: true });
        }
      });

    return () => controller.abort();
  }, [login, navigate, user]);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = (event) => {
      if (event.matches) closeDrawer();
    };

    desktopQuery.addEventListener("change", closeOnDesktop);
    return () => desktopQuery.removeEventListener("change", closeOnDesktop);
  }, [closeDrawer]);

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);
      await logout();
      navigate("/player/login", { replace: true });
    } catch (error) {
      console.error("Player logout failed:", error);
      setLoggingOut(false);
    }
  };

  return (
    <div className="flex min-h-dvh w-full min-w-0 bg-slate-100">
      <a
        href="#player-content"
        className="sr-only z-[150] rounded-lg bg-white px-4 py-3 font-semibold text-slate-900 shadow-lg focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        Skip to player content
      </a>
      <PlayerSidebar player={player} />
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        <PlayerTopbar
          pageTitle={getPlayerPageTitle(pathname)}
          player={player}
          drawerOpen={drawerOpen}
          menuButtonRef={menuButtonRef}
          onMenuOpen={() => setDrawerOpen(true)}
          onLogout={handleLogout}
          loggingOut={loggingOut}
        />
        <main id="player-content" className="min-w-0 flex-1 overflow-x-hidden">
          <Outlet context={{ player }} />
        </main>
      </div>
      <PlayerMobileDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        onLogout={handleLogout}
        loggingOut={loggingOut}
        returnFocusRef={menuButtonRef}
      />
    </div>
  );
};

export default PlayerPortalLayout;
