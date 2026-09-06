import { useEffect, useState } from "react";
import { api } from "../api.js";
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
    const res = await api.get("/player/getAllPlayers");
    setPlayers(res.data.data);
  };

  useEffect(() => {
    api.get("/player/getAllPlayers").then((res) => {
      setPlayers(res.data.data);
    });
  }, []);

  return (
    <div className="min-h-full bg-slate-900 p-4 text-white sm:p-6">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
          Players
        </p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Player Management</h1>
        <p className="mt-2 text-sm text-slate-400">
          Review and update registered club players by status.
        </p>
      </div>

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
