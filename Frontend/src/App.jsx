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
import AddTournament from "./pages/admin/AddTournament.jsx";
import PlayerRequestQueue from "./components/PlayerRequestQueue.jsx";

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
          <Route path="add-tournament" element={<AddTournament />} />
          <Route path="requests" element={<PlayerRequestQueue />} />
        </Route>

      </Routes>
    </>
  );
}

export default App;
