import "./App.css";
import "./styles/public.css";
import "@fontsource/merriweather/700.css";
import "@fontsource/merriweather/900.css";
import "@fontsource/playfair-display/700.css";

import { lazy, Suspense } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import { PublicDataState } from "./components/public/PublicUI";
import LoadingScreen from "./components/common/loadingState.jsx";
import AdminRoute from "./pages/admin/AdminRoute.jsx";
import NotFound from "./pages/NotFound.jsx";
import ServerMonitor from "./components/common/ServerMonitor.jsx";
import PlayerRoute from "./pages/player/PlayerRoute.jsx";
import ScrollToTop from "./components/common/ScrollToTop.jsx";


// Lazy Loaded Pages
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const PlayerProfile = lazy(() => import("./pages/PlayerProfile"));
const EditPlayerProfile = lazy(() =>import("./components/Player/EditPlayerProfile.jsx"));
const PlayerPortalLayout = lazy(() =>import("./pages/player/PlayerPortalLayout.jsx"));
const PlayerDashboard = lazy(() =>import("./pages/player/PlayerDashboard.jsx"));
const PlayerAttendancePage = lazy(() =>import("./pages/player/PlayerAttendancePage.jsx"));
const PlayerTournamentsPage = lazy(() =>import("./pages/player/PlayerTournamentsPage.jsx"));
const PlayerAchievementsPage = lazy(() =>import("./pages/player/PlayerAchievementsPage.jsx"));

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin.jsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.jsx"));
const Maintenance = lazy(() => import("./pages/Maintenance.jsx"));
const ClubMedalRecord = lazy(() => import("./components/homepage/ClubMedalRecord.jsx"));

const PublicFooter = lazy(()=>import("./components/PublicFooter.jsx"))
// Admin Dashboard Components
const AnalyticsDashboard = lazy(() =>import("./components/Admin/AnalyticsDashboard.jsx"));
const AdminDashboardHome = lazy(() =>import("./components/Admin/AdminDashboardHome.jsx"));

const PlayersBoard = lazy(() =>import("./components/Player/PlayerBoard.jsx"));
const PlayerRequestQueue = lazy(() =>import("./components/Player/PlayerRequestQueue.jsx"));
const RejectPlayer = lazy(() =>import("./components/Admin/RejectPlayer.jsx"));

// Tournament Components
const AllTournaments = lazy(() =>import("./components/Tournament/AllTournaments.jsx"));
const AddTournament = lazy(() =>import("./components/Tournament/AddTournament.jsx"));
const TournamentEntry = lazy(() =>import("./components/Tournament/TournamentEntry.jsx"));

// Result Components
const IndividualResult = lazy(() =>import("./components/Result/IndividualResult.jsx"));
const TeamResult = lazy(() =>import("./components/Result/TeamResult.jsx"));

// Attendance Components
const MarkAttendance = lazy(() =>import("./components/Attendance/MarkAttendance.jsx"));
const AttendanceRecords = lazy(() =>import("./components/Attendance/AttendanceRecords.jsx"));
const AttendanceLayout = lazy(() =>import("./components/Attendance/AttendanceLayout.jsx"));
const MonthlyAttendance = lazy(() =>import("./components/Attendance/monthly/MonthlyAttendance.jsx"));

// Certificate Components
const MeritCertificates = lazy(() =>import("./components/Certificate/MeritCertificates.jsx"));
const ParticipationCertificates = lazy(() =>import("./components/Certificate/ParticipationCertificates.jsx"));
const ExploreTournament = lazy(() =>import("./components/homepage/ExploreTournament.jsx"));

function App() {
  const { pathname } = useLocation();
  const isPlayerAuthRoute =
    pathname === "/player/login" || pathname === "/player/register";
  const isPlayerPortalRoute =
    (pathname === "/player" || pathname.startsWith("/player/")) &&
    !isPlayerAuthRoute;
  const isPublicRoute =
  !pathname.startsWith("/player") &&
  !pathname.startsWith("/admin") &&
  pathname !== "/maintenance";

  return (
    <>
      <ScrollToTop />
      <ServerMonitor/>

      {!pathname.startsWith("/admin") && !isPlayerPortalRoute && <Navbar />}

      <Suspense fallback={isPublicRoute || pathname === "/maintenance" ? <main id="public-content" className="public-site public-section public-utility"><div className="public-container"><PublicDataState kind="loading" title="Getting ready…">Loading All Star Fencing Club.</PublicDataState></div></main> : <LoadingScreen />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/explore-tournament" element={<ExploreTournament />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/club-medal-record" element={<ClubMedalRecord />}/>

          {/* Player Routes */}
          <Route path="/player/login" element={<Login />} />
          <Route path="/player/register" element={<Register />} />

          <Route element={<PlayerRoute />}>
            <Route path="/player" element={<PlayerPortalLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<PlayerDashboard />} />
              <Route path="attendance" element={<PlayerAttendancePage />} />
              <Route path="tournaments" element={<PlayerTournamentsPage />} />
              <Route path="achievements" element={<PlayerAchievementsPage />} />
              <Route path="profile" element={<PlayerProfile />} />
              <Route path="profile/edit" element={<EditPlayerProfile />} />
              <Route path="edit/:playerId" element={<EditPlayerProfile />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Route>
          </Route>

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="attendance" element={<AttendanceLayout />}>
                <Route index element={<Navigate to="mark" replace />} />
                <Route path="mark" element={<MarkAttendance />} />
                <Route path="records" element={<AttendanceRecords />} />
                <Route path="monthly" element={<MonthlyAttendance />} />
              </Route>

              <Route path="dashboard">
                {/* Dashboard */}
                <Route index element={<AdminDashboardHome />} />

            {/* Players */}
                <Route path="players" element={<PlayersBoard />} />
                <Route path="requests" element={<PlayerRequestQueue />}>
                  <Route path="reject" element={<RejectPlayer />} />
                </Route>

            {/* Tournaments */}
                <Route path="tournaments" element={<AllTournaments />} />
                <Route path="add-tournament" element={<AddTournament />} />

            {/* Tournament Entries */}
                <Route path="entries" element={<TournamentEntry />} />

            {/* Results */}
                <Route path="club-results" element={<AnalyticsDashboard />} />
                <Route path="individual-results" element={<IndividualResult />} />
                <Route path="team-results" element={<TeamResult />} />

            {/* Certificates */}
                <Route path="merit-certificates" element={<MeritCertificates />} />
                <Route path="participation-certificates" element={<ParticipationCertificates />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {isPublicRoute && <PublicFooter />}
    </>
  );
}

export default App;
