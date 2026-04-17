import React, { useEffect, useState } from "react";
import axios from "axios";

function TournamentEntry() {
  const [tournaments, setTournaments] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [existingPlayerIds, setExistingPlayerIds] = useState([]);

  const adminToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("adminToken="))
    ?.split("=")[1];

  // 🔹 Fetch tournaments
  const fetchTournaments = async () => {
    const result = await axios.get("http://localhost:5050/tournament", {
      headers: {
        authorization: `Bearer ${adminToken}`,
      },
    });
    setTournaments(result.data.data);
  };

  // 🔹 Fetch players
  const fetchPlayers = async () => {
    const result = await axios.get(
      "http://localhost:5050/player/getAllPlayers?status=Accepted",
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    setPlayers(result.data.data);
  };

  // 🔹 Fetch existing entries
  const fetchExistingEntries = async (tournamentId) => {
    try {
      const res = await axios.get(
        `http://localhost:5050/tournament/entry/${tournamentId}`,
        {
          headers: {
            authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const ids = res.data.data.map((entry) =>
        entry.playerId._id.toString()
      );

      setExistingPlayerIds(ids);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Calculate Age
  const calculateAge = (birthdate) => {
    const today = new Date();
    const dob = new Date(birthdate);

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dob.getDate())
    ) {
      age--;
    }

    return age;
  };

  // 🔹 Filter players
  const filterPlayers = (ageLimit) => {
    const filtered = players.filter((player) => {
      const age = calculateAge(player.dob);
      return age <= ageLimit;
    });

    setFilteredPlayers(filtered);
    setSelectedPlayers([]);
  };

  // 🔹 Select individual player
  const handleSelectPlayer = (id) => {
    if (existingPlayerIds.includes(id)) return; // 🚫 block

    setSelectedPlayers((prev) =>
      prev.includes(id)
        ? prev.filter((playerId) => playerId !== id)
        : [...prev, id]
    );
  };

  // 🔹 Select all (only selectable players)
  const handleSelectAll = () => {
    const selectablePlayers = filteredPlayers
      .filter((p) => !existingPlayerIds.includes(p._id))
      .map((p) => p._id);

    if (selectedPlayers.length === selectablePlayers.length) {
      setSelectedPlayers([]);
    } else {
      setSelectedPlayers(selectablePlayers);
    }
  };

  // 🔹 Create Entry API
  const handleCreateEntry = async () => {
    if (!selectedTournament || selectedPlayers.length === 0) {
      alert("Select tournament and players");
      return;
    }

    const payload = {
      tournamentId: selectedTournament._id,
      playerIds: selectedPlayers,
    };

    try {
      const response = await axios.post(
        "http://localhost:5050/tournament/createEntry",
        payload,
        {
          headers: {
            authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const data = response.data;

      alert(
        `${data.message}\nAdded: ${data.addedCount}\nSkipped: ${data.skippedCount}`
      );
      await fetchExistingEntries(selectedTournament._id); // update disabled players
      filterPlayers(selectedTournament.ageCategory);     // re-filter list
      setSelectedPlayers([]);
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Something went wrong");
      }
    }
  };

  useEffect(() => {
    fetchTournaments();
    fetchPlayers();
  }, []);

  useEffect(() => {
    if (selectedTournament) {
      filterPlayers(selectedTournament.ageCategory);
      fetchExistingEntries(selectedTournament._id);
    }
  }, [selectedTournament]);

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-white">
      <h1 className="text-amber-300 text-2xl mb-4">Create Entry</h1>

      {/* 🔹 Tournament Dropdown */}
      <h2 className="mb-2">Select Tournament:</h2>
      <select
        className="bg-slate-900 border border-amber-200 p-2 mb-4"
        value={selectedTournament?._id || ""}
        onChange={(e) => {
          const selected = tournaments.find(
            (t) => t._id === e.target.value
          );
          setSelectedTournament(selected);
        }}
      >
        <option value="" disabled>
          Select Tournament
        </option>
        {tournaments.map((tournament) => (
          <option key={tournament._id} value={tournament._id}>
            {tournament.title}
          </option>
        ))}
      </select>

      {/* 🔹 Players Table */}
      <div className="p-4">
        <table className="w-full border border-collapse">
          <thead>
            <tr className="bg-gray-200 text-black">
              <th className="border p-2 text-center">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                />
              </th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Gender</th>
              <th className="border p-2">Event</th>
              <th className="border p-2">DOB</th>
            </tr>
          </thead>

          <tbody>
            {filteredPlayers.map((player) => {
              const dob = new Date(player.dob);
              const formattedDOB = `${dob.getDate()} / ${dob.getMonth() + 1
                } / ${dob.getFullYear()}`;

              const isRegistered = existingPlayerIds.includes(
                player._id
              );

              return (
                <tr
                  key={player._id}
                  className={isRegistered ? "opacity-50" : ""}
                >
                  <td className="border p-2 text-center">
                    <input
                      type="checkbox"
                      disabled={isRegistered}
                      checked={selectedPlayers.includes(player._id)}
                      onChange={() =>
                        handleSelectPlayer(player._id)
                      }
                    />
                  </td>

                  <td className="border p-2 text-center">
                    {player.fullName}
                    {isRegistered && (
                      <span className="text-red-400 ml-2 text-xs">
                        (Already Registered)
                      </span>
                    )}
                  </td>

                  <td className="border p-2 text-center">
                    {player.gender}
                  </td>
                  <td className="border p-2 text-center">
                    {player.event}
                  </td>
                  <td className="border p-2 text-center">
                    {formattedDOB}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* 🔹 Selected Players */}
        <div className="mt-4 text-sm">
          <strong>Selected IDs:</strong>{" "}
          {selectedPlayers.length > 0
            ? selectedPlayers.join(", ")
            : "None"}
        </div>

        {/* 🔹 Create Entry Button */}
        <button
          className="bg-amber-400 text-black px-4 py-2 mt-4 rounded hover:bg-amber-500"
          onClick={handleCreateEntry}
        >
          Create Entry
        </button>
      </div>
    </div>
  );
}

export default TournamentEntry;