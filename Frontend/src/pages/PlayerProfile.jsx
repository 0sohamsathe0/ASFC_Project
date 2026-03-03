import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { set } from "mongoose";

const PlayerProfile = () => {
  const [player, setPlayer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      const response = await axios.get("http://localhost:5050/player/profile",{ withCredentials: true });
      console.log("Profile response: ", response.data.player);
      setPlayer(response.data.player);
    }
    fetchProfile();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Player Profile</h2>

        <h1 className="text-xl font-semibold text-center mb-4">{player?.fullName}</h1> 
        
        
        <button
          onClick={async () => {
            document.cookie = "_id=; path=/; max-age=0";
            document.cookie = "playerToken=; path=/; max-age=0";
            await axios.post("http://localhost:5050/player/logout", {}, { withCredentials: true });
            navigate("/");
          }}
          className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
        
      </div>
    </div>
  );
};

export default PlayerProfile;
