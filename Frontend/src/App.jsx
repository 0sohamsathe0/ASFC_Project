import "./App.css";
import "@fontsource/merriweather/700.css";
import "@fontsource/merriweather/900.css";
import "@fontsource/playfair-display/700.css";

import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import LoadingScreen from "./components/common/loadingState.jsx";
import AdminRoute from "./pages/admin/AdminRoute.jsx";

// Lazy Loaded Pages
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const PlayerProfile = lazy(() => import("./pages/PlayerProfile"));
const EditPlayerProfile = lazy(() =>
  import("./components/Player/EditPlayerProfile .jsx")
);

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin.jsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.jsx"));

// Admin Dashboard Components
import AnalyticsDashboard from "./components/Admin/AnalyticsDashboard.jsx";
import PlayersBoard from "./components/Player/PlayerBoard.jsx";
import PlayerRequestQueue from "./components/Player/PlayerRequestQueue.jsx";
import RejectPlayer from "./components/Admin/RejectPlayer.jsx";

import AllTournaments from "./components/Tournament/AllTournaments.jsx";
import AddTournament from "./components/Tournament/AddTournament.jsx";
import TournamentEntry from "./components/Tournament/TournamentEntry.jsx";

import IndividualResult from "./components/Result/IndividualResult.jsx";
import TeamResult from "./components/Result/TeamResult.jsx";

import MeritCertificates from "./components/Certificate/MeritCertificates.jsx";
import ParticipationCertificates from "./components/Certificate/ParticipationCertificates.jsx";

function App() {
  return (
    <>
      <Navbar />

      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Player Routes */}
          <Route path="/player/login" element={<Login />} />
          <Route path="/player/register" element={<Register />} />
          <Route path="/player/profile" element={<PlayerProfile />} />
          <Route
            path="/player/edit/:playerId"
            element={<EditPlayerProfile />}
          />

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

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
        </Routes>
      </Suspense>
    </>
  );
}

export default App;