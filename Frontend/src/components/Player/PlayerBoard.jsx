import { useEffect, useState } from "react";
import axios from "axios";
import PlayerTable from "./PlayerTable.jsx";
import EditPlayerModal from "./EditPlayerModal.jsx";

const PlayersBoard = () => {
  const [players, setPlayers] = useState({
    Accepted: [],
    Pending: [],
    Rejected: [],
  });

  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const fetchPlayers = async () => {
    const res = await axios.get(
      "http://localhost:5050/player/getAllPlayers"
    );
    setPlayers(res.data.data);
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Player Management</h1>

      <div className="space-y-6">
        <PlayerTable
          title="Accepted"
          data={players?.Accepted || []}
          onEdit={setSelectedPlayer}
        />

        <PlayerTable
          title="Pending"
          data={players?.Pending || []}
          onEdit={setSelectedPlayer}
        />

        <PlayerTable
          title="Rejected"
          data={players?.Rejected || []}
          onEdit={setSelectedPlayer}
        />
      </div>

      {selectedPlayer && (
        <EditPlayerModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          refresh={fetchPlayers}
        />
      )}
    </div>
  );
};

export default PlayersBoard;