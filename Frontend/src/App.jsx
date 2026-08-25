import "./App.css";
import "@fontsource/merriweather/700.css";
import "@fontsource/merriweather/900.css";
import "@fontsource/playfair-display/700.css";

import { lazy, Suspense } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import LoadingScreen from "./components/common/loadingState.jsx";
import AdminRoute from "./pages/admin/AdminRoute.jsx";
import AdminAttendanceRoute from "./pages/admin/AdminAttendanceRoute.jsx";
import NotFound from "./pages/NotFound.jsx";
import ServerMonitor from "./components/common/ServerMonitor.jsx";
import PlayerRoute from "./pages/player/PlayerRoute.jsx";


// Lazy Loaded Pages
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const PlayerProfile = lazy(() => import("./pages/PlayerProfile"));
const EditPlayerProfile = lazy(() =>import("./components/Player/EditPlayerProfile.jsx"));

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin.jsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.jsx"));
const Maintenance = lazy(() => import("./pages/Maintenance.jsx"));
const ClubMedalRecord = lazy(() => import("./components/homepage/ClubMedalRecord.jsx"));

const PublicFooter = lazy(()=>import("./components/PublicFooter.jsx"))
// Admin Dashboard Components
const AnalyticsDashboard = lazy(() =>import("./components/Admin/AnalyticsDashboard.jsx"));

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

// Certificate Components
const MeritCertificates = lazy(() =>import("./components/Certificate/MeritCertificates.jsx"));
const ParticipationCertificates = lazy(() =>import("./components/Certificate/ParticipationCertificates.jsx"));
const ExploreTournament = lazy(() =>import("./components/homepage/ExploreTournament.jsx"));

function App() {
  const { pathname } = useLocation();
  const isPublicRoute =
  !pathname.startsWith("/player") &&
  !pathname.startsWith("/admin") &&
  pathname !== "/maintenance";

  return (
    <>
      <ServerMonitor/>

      <Navbar />

      <Suspense fallback={<LoadingScreen />}>
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

          <Route path="/player/profile" element={
            <PlayerRoute>
            <PlayerProfile />
            </PlayerRoute>
            } />
          <Route
            path="/player/edit/:playerId"
            element={<EditPlayerProfile />}
          />

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Mobile and desktop attendance workspace */}
          <Route
            path="/admin/attendance"
            element={
              <AdminAttendanceRoute>
                <AttendanceLayout />
              </AdminAttendanceRoute>
            }
          >
            <Route index element={<Navigate to="mark" replace />} />
            <Route path="mark" element={<MarkAttendance />} />
            <Route path="records" element={<AttendanceRecords />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route
            path="/admin/dashboard/*"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          >
            {/* Dashboard */}
            <Route index element={<AnalyticsDashboard />} />

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
            <Route
              path="individual-results"
              element={<IndividualResult />}
            />
            <Route path="team-results" element={<TeamResult />} />

            {/* Certificates */}
            <Route
              path="merit-certificates"
              element={<MeritCertificates />}
            />
            <Route
              path="participation-certificates"
              element={<ParticipationCertificates />}
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {isPublicRoute && <PublicFooter />}
    </>
  );
}

export default App;
