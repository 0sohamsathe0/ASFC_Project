import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../components/api.js";

import DesktopProfile from "./player/DesktopProfile.jsx";
import MobileProfile from "./player/Mobile/MobileProfile.jsx";
import AadhaarPreview from "./player/AadhaarPreview.jsx";

const PlayerProfile = () => {
  const [player, setPlayer] = useState(null);
  const [showAadhar, setShowAadhar] = useState(false);
  const [individualResults, setIndividualResults] = useState([]);
  const [teamResults, setTeamResults] = useState([]);

  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();

  const totalTournamentsPlayed = 12;

  const upcomingTournaments = [
    {
      id: 1,
      title: "District Fencing Championship 2026",
      date: "15 April 2026",
    },
    {
      id: 2,
      title: "State Level Epee Tournament",
      date: "10 May 2026",
    },
  ];

  const HandleLogout = async () => {
    try {
      await logout();
      alert("Logged out successfully");
      navigate("/player/login");
    } catch (error) {
      alert("Logout failed");
      console.error(error);
    }
  };

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await api.get("/player/profile");

        setPlayer(response.data.player);

        const [individualRes, teamRes] = await Promise.all([
          api.get(`/result/player/individual/${response.data.player._id}`),
          api.get(`/result/player/team/${response.data.player._id}`),
        ]);

        setIndividualResults(individualRes.data.data);
        setTeamResults(teamRes.data.data);
      } catch (err) {
        console.log("Profile Error:", err);

        if (err.response?.status === 401) {
          navigate("/player/login");
        }
      }
    }

    fetchProfile();
  }, []);

  if (!player) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className="md:hidden">
        <MobileProfile
          player={player}
          showAadhar={showAadhar}
          setShowAadhar={setShowAadhar}
          individualResults={individualResults}
          teamResults={teamResults}
          selectedCertificate={selectedCertificate}
          setSelectedCertificate={setSelectedCertificate}
          showCertificate={showCertificate}
          setShowCertificate={setShowCertificate}
          HandleLogout={HandleLogout}
          totalTournamentsPlayed={totalTournamentsPlayed}
          upcomingTournaments={upcomingTournaments}
          navigate={navigate}
        />
      </div>

      <div className="hidden md:block">
        <DesktopProfile
          player={player}
          showAadhar={showAadhar}
          setShowAadhar={setShowAadhar}
          individualResults={individualResults}
          teamResults={teamResults}
          selectedCertificate={selectedCertificate}
          setSelectedCertificate={setSelectedCertificate}
          showCertificate={showCertificate}
          setShowCertificate={setShowCertificate}
          HandleLogout={HandleLogout}
          totalTournamentsPlayed={totalTournamentsPlayed}
          upcomingTournaments={upcomingTournaments}
          navigate={navigate}
        />
      </div>
      <AadhaarPreview
    open={showAadhar}
    image={player.aadharCardURL}
    onClose={() => setShowAadhar(false)}
  />
    </>

  );
};

export default PlayerProfile;