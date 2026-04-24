import { useEffect, useState } from "react";
import axios from "axios";

const AddIndividualResult = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState("");

  const [players, setPlayers] = useState([]);
  const [results, setResults] = useState({});

  const [activeGender, setActiveGender] = useState("Male");
  const [activeEvent, setActiveEvent] = useState("Epee");

  const adminToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("adminToken="))
    ?.split("=")[1];

  const categories = ["Male", "Female"];
  const events = ["Epee", "Foil", "Sabre"];
  const places = ["First", "Second", "Third"];

  const categoryKey = `${activeGender}_${activeEvent}`;

  // 🔥 Fetch tournaments
  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    const res = await axios.get("http://localhost:5050/tournament", {
      headers: { authorization: `Bearer ${adminToken}` },
    });
    setTournaments(res.data.data);
  };

  // 🔥 On tournament change → fetch players + results
  const handleTournamentChange = async (tid) => {
    setSelectedTournament(tid);

    // Entries
    const entryRes = await axios.get(
      `http://localhost:5050/tournament/entry/${tid}`,
      { headers: { authorization: `Bearer ${adminToken}` } }
    );

    const playersData = entryRes.data.data.map((entry) => ({
      _id: entry.playerId._id,
      name: entry.playerId.fullName,
      gender: entry.playerId.gender,
      event: entry.playerId.event,
      entryId: entry._id,
    }));

    setPlayers(playersData);

    // Results
    const resultRes = await axios.get(
      `http://localhost:5050/result/individual/${tid}`,
      { headers: { authorization: `Bearer ${adminToken}` } }
    );

    const formatted = {};

    resultRes.data.data.forEach((r) => {
      const key = r.category;

      if (!formatted[key]) {
        formatted[key] = { First: null, Second: null, Third: null };
      }

      formatted[key][r.place] = {
        playerId: r.tournamentEntryId?.playerId?._id,
        entryId: r.tournamentEntryId?._id,
        name: r.tournamentEntryId?.playerId?.fullName,
        locked: true,
      };
    });

    setResults(formatted);
  };

  // 🔥 Filter players
  const filteredPlayers = players.filter(
    (p) => p.gender === activeGender && p.event === activeEvent
  );

  // 🔥 Select handler
  const handleSelect = (player, place) => {
    setResults((prev) => {
      const updated = { ...prev };
      const current = updated[categoryKey] || {
        First: null,
        Second: null,
        Third: null,
      };

      // ❌ Prevent editing locked
      if (current[place]?.locked) {
        alert("Result already declared");
        return prev;
      }

      // Remove player from other places (if not locked)
      Object.keys(current).forEach((k) => {
        if (current[k]?.playerId === player._id && !current[k]?.locked) {
          current[k] = null;
        }
      });

      if (!place) {
        updated[categoryKey] = current;
        return updated;
      }

      if (current[place]) {
        alert(`${place} already assigned`);
        return prev;
      }

      current[place] = {
        playerId: player._id,
        entryId: player.entryId,
        name: player.name,
        locked: false,
      };

      updated[categoryKey] = current;
      return updated;
    });
  };

  // 🔥 Submit
  const handleSubmit = async () => {
    try {
      const final = [];

      Object.entries(results).forEach(([category, value]) => {
        Object.entries(value || {}).forEach(([place, val]) => {
          if (val && !val.locked) {
            final.push({
              tournamentId: selectedTournament,
              category,
              place,
              tournamentEntryId: val.entryId,
              playerId: val.playerId,
            });
          }
        });
      });

      if (final.length === 0) {
        alert("No new results to submit");
        return;
      }

      await axios.post(
        "http://localhost:5050/result/individual",
        final,
        {
          headers: {
            authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Results saved ✅");

      // 🔥 Refresh results
      handleTournamentChange(selectedTournament);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-yellow-400 mb-6">
          Add Individual Result
        </h2>

        {/* Tournament */}
        <select
          onChange={(e) => handleTournamentChange(e.target.value)}
          className="mb-6 w-full md:w-1/2 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2"
        >
          <option value="">Select Tournament</option>
          {tournaments.map((t) => (
            <option key={t._id} value={t._id}>
              {t.title}
            </option>
          ))}
        </select>

        {/* Tabs */}
        <div className="flex gap-3 mb-4">
          {categories.map((g) => (
            <button
              key={g}
              onClick={() => setActiveGender(g)}
              className={`px-4 py-2 rounded ${
                activeGender === g
                  ? "bg-yellow-400 text-black"
                  : "bg-slate-700"
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Event */}
        <select
          value={activeEvent}
          onChange={(e) => setActiveEvent(e.target.value)}
          className="mb-6 bg-slate-700 px-4 py-2 rounded"
        >
          {events.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>

        {/* Table */}
        <table className="w-full border border-slate-600">
          <thead className="bg-slate-700">
            <tr>
              <th className="p-3">Player</th>
              <th className="p-3">Position</th>
            </tr>
          </thead>

          <tbody>
            {filteredPlayers.map((player) => {
              const current = results[categoryKey] || {};

              const selected =
                Object.entries(current).find(
                  ([_, val]) => val?.playerId === player._id
                )?.[0] || "";

              return (
                <tr key={player._id} className="border-t border-slate-600">
                  <td className="p-3">{player.name}</td>

                  <td className="p-3">
                    <select
                      value={selected}
                      onChange={(e) =>
                        handleSelect(player, e.target.value)
                      }
                      disabled={
                        Object.values(current).some(
                          (val) =>
                            val?.playerId === player._id && val?.locked
                        )
                      }
                      className="bg-slate-900 px-2 py-1 rounded disabled:opacity-50"
                    >
                      <option value="">None</option>

                      {places.map((place) => (
                        <option
                          key={place}
                          value={place}
                          disabled={current[place]?.locked}
                        >
                          {place === "First" && "🥇"}
                          {place === "Second" && "🥈"}
                          {place === "Third" && "🥉"} {place}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <button
          onClick={handleSubmit}
          className="mt-6 bg-yellow-400 text-black px-6 py-2 rounded"
        >
          Submit Results
        </button>
      </div>
    </div>
  );
};

export default AddIndividualResult;