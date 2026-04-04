import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import PlayerProfile from "./pages/PlayerProfile";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminRoute from "./pages/admin/AdminRoute.jsx";

import AddTournament from "./components/Tournament/AddTournament.jsx";
import PlayerRequestQueue from "./components/Player/PlayerRequestQueue.jsx";
import RejectPlayer from "./components/Admin/RejectPlayer.jsx"
import AnalyticsDashboard from "./components/Admin/AnalyticsDashboard.jsx";
import PlayersBoard  from "./components/Player/PlayerBoard.jsx";
import AllTournaments from "./components/Tournament/AllTournaments.jsx";
import TournamentEntry from "./components/Tournament/TournamentEntry.jsx";
import IndividualResult from "./components/Result/IndividualResult.jsx";
import TeamResult from "./components/Result/TeamResult.jsx";
import MeritCertificates from "./components/Certificate/MeritCertificates.jsx";
import ParticipationCertificates from "./components/Certificate/ParticipationCertificates.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Player Routes */}
        <Route path="/player/login" element={<Login />} />
        <Route path="/player/profile" element={<PlayerProfile />} />
        <Route path="/player/register" element={<Register />} />
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin/dashboard/*"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        >
          <Route path="" element={<AnalyticsDashboard/>}/>

          //player routes inside admin dashboard
          <Route path="players" element={<PlayersBoard />}/>
          <Route path="requests" element={<PlayerRequestQueue />}>
            <Route path="reject" element={<RejectPlayer />} />
          </Route>

          //tournaments routes inside admin dashboard
          <Route path="tournaments" element={<AllTournaments/>}/>
          <Route path="add-tournament" element={<AddTournament />} />
            
          

          //tournament entries route inside admin dashboard
          <Route path="entries" element={<TournamentEntry/>}/>

          //Results routes inside admin dashboard
          <Route path="individual-results" element={<IndividualResult/>}/>
          <Route path="team-results" element={<TeamResult/>}/>

          //certificates routes inside admin dashboard
          <Route path="merit-certificates" element={<MeritCertificates/>}/>
          <Route path="participation-certificates" element={<ParticipationCertificates/>}/>

          
        </Route>

      </Routes>
    </>
  );
}

export default App;
