import { useEffect, useState } from "react";
import axios from "axios";
import getAdminToken from '../../utils/getAdminToken.js'

const AddTeamResult = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState("");

  const [players, setPlayers] = useState([]);
  const [results, setResults] = useState({});
  const [selectedPlayers, setSelectedPlayers] = useState({});
  const [selectedPlace, setSelectedPlace] = useState({});

  const BASE_URL = "http://localhost:5050";

  const events = ["Epee", "Foil", "Sabre"];
  const genders = ["Male", "Female"];
  const places = ["First", "Second", "Third"];

  const eventColors = {
    Epee: "text-yellow-300",
    Foil: "text-blue-400",
    Sabre: "text-red-400",
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    const res = await axios.get(`http://localhost:5050/tournament?type=completed`, {
      headers: { authorization: `Bearer ${getAdminToken()}` },
    });
    setTournaments(res.data.data);
  };

  const handleTournamentChange = async (tid) => {
    setSelectedTournament(tid);
    setSelectedPlayers({});
    setSelectedPlace({});

    const entryRes = await axios.get(
      `${BASE_URL}/tournament/entry/${tid}`,
      { headers: { authorization: `Bearer ${getAdminToken()}` } }
    );

    const playersData = entryRes.data.data.map((entry) => ({
      _id: entry.playerId._id,
      name: entry.playerId.fullName,
      gender: entry.playerId.gender,
      event: entry.playerId.event,
      entryId: entry._id,
    }));

    setPlayers(playersData);

    const resultRes = await axios.get(
      `${BASE_URL}/result/team/${tid}`,
      { headers: { authorization: `Bearer ${getAdminToken()}` } }
    );

    const formatted = {};

    resultRes.data.data.forEach((r) => {
      if (!formatted[r.category]) {
        formatted[r.category] = {
          First: null,
          Second: null,
          Third: null,
        };
      }

      formatted[r.category][r.place] = {
        team: r.players,
        locked: true,
      };
    });

    setResults(formatted);
  };

  const togglePlayer = (key, player) => {
    setSelectedPlayers((prev) => {
      const current = prev[key] || [];
      const exists = current.find((p) => p._id === player._id);

      if (exists) {
        return {
          ...prev,
          [key]: current.filter((p) => p._id !== player._id),
        };
      }

      return {
        ...prev,
        [key]: [...current, player],
      };
    });
  };

  const addExternalPlayer = (key, name) => {
    setSelectedPlayers((prev) => {
      const current = prev[key] || [];
      return {
        ...prev,
        [key]: [...current, { _id: Date.now(), name }],
      };
    });
  };

  const saveResult = async (categoryKey) => {
    const team = selectedPlayers[categoryKey] || [];
    const place = selectedPlace[categoryKey];
    const current = results[categoryKey] || {};

    // 🔥 BLOCK if any result already exists
    if (current.First || current.Second || current.Third) {
      return alert("Result already declared for this category");
    }

    if (!place) return alert("Select position");
    if (team.length === 0) return alert("Select players");

    try {
      await axios.post(
        `${BASE_URL}/result/team`,
        {
          tournamentId: selectedTournament,
          category: categoryKey,
          place,
          players: team.map((p) => ({
            playerId: p.entryId ? p._id : null,
            entryId: p.entryId || null,
            name: p.name,
          })),
        },
        {
          headers: { authorization: `Bearer ${getAdminToken()}` },
        }
      );

      alert("Saved ✅");
      handleTournamentChange(selectedTournament);
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h2 className="text-2xl text-yellow-400 mb-6">
        Add Team Result
      </h2>

      <select
        onChange={(e) => handleTournamentChange(e.target.value)}
        className="mb-6 w-1/3 bg-slate-800 px-4 py-2 rounded"
      >
        <option>Select Tournament</option>
        {tournaments.map((t) => (
          <option key={t._id} value={t._id}>
            {t.title}
          </option>
        ))}
      </select>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {events.map((event) =>
          genders.map((gender) => {
            const key = `${gender}_${event}`;
            const filtered = players.filter(
              (p) => p.gender === gender && p.event === event
            );

            const selected = selectedPlayers[key] || [];
            const current = results[key] || {};

            // 🔥 GLOBAL LOCK
            const isLocked =
              current.First || current.Second || current.Third;

            return (
              <div key={key} className="bg-slate-800 p-4 rounded">
                <h3 className={`mb-2 ${eventColors[event]}`}>
                  {event} {gender}
                </h3>

                <div className="flex flex-wrap gap-1 mb-2 max-h-28 overflow-y-auto">
                  {filtered.map((p) => {
                    const isSelected = selected.find(
                      (sp) => sp._id === p._id
                    );

                    return (
                      <span
                        key={p._id}
                        title={p.name}
                        onClick={() =>
                          !isLocked && togglePlayer(key, p)
                        }
                        className={`text-[11px] px-2 py-0.5 rounded cursor-pointer
                          ${
                            isSelected
                              ? "bg-yellow-400 text-black"
                              : "bg-slate-700"
                          }
                          ${isLocked && "opacity-50 cursor-not-allowed"}
                        `}
                      >
                        {p.name.split(" ")[0]}
                      </span>
                    );
                  })}
                </div>

                <input
                  type="text"
                  placeholder="Add external player"
                  disabled={isLocked}
                  className="text-xs px-2 py-1 bg-slate-700 rounded w-full mb-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value) {
                      addExternalPlayer(key, e.target.value);
                      e.target.value = "";
                    }
                  }}
                />

                <div className="text-xs mb-2 space-x-3">
                  <span>🥇 {current.First ? "✔" : "-"}</span>
                  <span>🥈 {current.Second ? "✔" : "-"}</span>
                  <span>🥉 {current.Third ? "✔" : "-"}</span>
                </div>

                <div className="flex gap-2">
                  <select
                    disabled={isLocked}
                    value={selectedPlace[key] || ""}
                    onChange={(e) =>
                      setSelectedPlace((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    className="text-xs bg-slate-700 px-2 py-1 rounded"
                  >
                    <option value="">Select Position</option>
                    {places.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>

                  <button
                    disabled={isLocked}
                    onClick={() => saveResult(key)}
                    className={`text-xs px-3 py-1 rounded ${
                      isLocked
                        ? "bg-gray-500"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    Submit
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AddTeamResult;