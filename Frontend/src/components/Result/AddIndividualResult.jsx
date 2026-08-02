import { useEffect, useMemo, useState } from "react";
import React from "react";
import { api } from "../api";

const AddIndividualResult = () => {
  const places = ["First", "Second", "Third"];

  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState("");

  const [entries, setEntries] = useState([]);
  const [existingResults, setExistingResults] = useState([]);

  const [selectedResults, setSelectedResults] = useState({});
  const [expandedRows, setExpandedRows] = useState({});

  const [loadingTournaments, setLoadingTournaments] = useState(true);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [savingRow, setSavingRow] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  useEffect(() => {
    fetchCompletedTournaments();
  }, []);

  const fetchCompletedTournaments = async () => {
    try {
      setLoadingTournaments(true);

      const res = await api.get("/tournament?type=completed");

      setTournaments(res.data.data || []);
    } catch (err) {
      console.error(err);

      setSnackbar({
        open: true,
        severity: "error",
        message: "Unable to load tournaments.",
      });
    } finally {
      setLoadingTournaments(false);
    }
  };

  const handleTournamentChange = async (tournamentId) => {
    setSelectedTournament(tournamentId);

    if (!tournamentId) {
      setEntries([]);
      setExistingResults([]);
      setSelectedResults({});
      setExpandedRows({});
      return;
    }

    try {
      setLoadingEntries(true);

      const [entryRes, resultRes] = await Promise.all([
        api.get(`/tournament/entry/${tournamentId}`),
        api.get(`/result/individual/${tournamentId}`),
      ]);

      const entryData = entryRes.data.data || [];
      const resultData = resultRes.data.data || [];

      setEntries(entryData);
      setExistingResults(resultData);

      const existingMap = {};

      resultData.forEach((result) => {
        if (!result.tournamentEntryId) return;

        existingMap[result.tournamentEntryId._id] = {
          place: result.place,
          category: result.category,
          submitted: true,
        };
      });

      setSelectedResults(existingMap);
    } catch (err) {
      console.error(err);

      setSnackbar({
        open: true,
        severity: "error",
        message: "Unable to load tournament data.",
      });
    } finally {
      setLoadingEntries(false);
    }
  };

  const groupedEntries = useMemo(() => {
    const grouped = {};

    entries.forEach((entry) => {
      if (!entry.playerId) return;

      const player = entry.playerId;

      const category = `${player.gender}_${player.event}`;

      if (!grouped[category]) {
        grouped[category] = [];
      }

      grouped[category].push({
        entryId: entry._id,
        playerId: player._id,
        name: player.fullName,
        gender: player.gender,
        event: player.event,
        place: selectedResults[entry._id]?.place || "",
        submitted: !!selectedResults[entry._id]?.submitted,
      });
    });

    return grouped;
  }, [entries, selectedResults]);

  const categories = useMemo(() => {
    return Object.keys(groupedEntries).sort();
  }, [groupedEntries]);

  const toggleRow = (entryId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [entryId]: !prev[entryId],
    }));
  };

  const handlePlaceChange = (entryId, place) => {
    setSelectedResults((prev) => ({
      ...prev,
      [entryId]: {
        ...(prev[entryId] || {}),
        place,
        submitted: false,
      },
    }));
  };  
  const handleSave = async (player) => {
    const selectedPlace = selectedResults[player.entryId]?.place;

    if (!selectedPlace) {
      setSnackbar({
        open: true,
        severity: "warning",
        message: "Please select a medal position.",
      });
      return;
    }

    const category = `${player.gender}_${player.event}`;

    const duplicate = entries.find((entry) => {
      if (entry._id === player.entryId) return false;

      if (
        entry.playerId.gender !== player.gender ||
        entry.playerId.event !== player.event
      ) {
        return false;
      }

      const assigned = selectedResults[entry._id];

      if (!assigned) return false;

      return assigned.place === selectedPlace;
    });

    if (duplicate) {
      setSnackbar({
        open: true,
        severity: "warning",
        message: `${selectedPlace} has already been assigned in this category.`,
      });
      return;
    }

    try {
      setSavingRow(player.entryId);

      await api.post("/result/individual", [
        {
          tournamentId: selectedTournament,
          tournamentEntryId: player.entryId,
          playerId: player.playerId,
          category,
          place: selectedPlace,
        },
      ]);

      const openedRows = { ...expandedRows };

      await handleTournamentChange(selectedTournament);

      setExpandedRows(openedRows);

      setSnackbar({
        open: true,
        severity: "success",
        message: `${player.name}'s result saved successfully.`,
      });
    } catch (err) {
      console.error(err);

      setSnackbar({
        open: true,
        severity: "error",
        message:
          err.response?.data?.message ||
          "Failed to save individual result.",
      });
    } finally {
      setSavingRow("");
    }
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };
  const isPlaceTaken = (currentPlayer, place) => {
  return entries.some((entry) => {
    // Skip current player
    if (entry._id === currentPlayer.entryId) return false;

    // Only compare within same category
    if (
      entry.playerId.gender !== currentPlayer.gender ||
      entry.playerId.event !== currentPlayer.event
    ) {
      return false;
    }

    const assigned = selectedResults[entry._id];

    return assigned?.place === place;
  });
};

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-emerald-400">
            Individual Results
          </h1>

          <p className="text-slate-400 mt-2">
            Declare results only for players who participated in the selected
            tournament.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">

          <label className="block text-sm text-slate-300 mb-2">
            Completed Tournament
          </label>

          <select
            value={selectedTournament}
            disabled={loadingTournaments}
            onChange={(e) => handleTournamentChange(e.target.value)}
            className="w-full md:w-[500px] bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-emerald-500"
          >
            <option value="">
              {loadingTournaments
                ? "Loading tournaments..."
                : "Select Tournament"}
            </option>

            {tournaments.map((tournament) => (
              <option
                key={tournament._id}
                value={tournament._id}
              >
                {tournament.title}
              </option>
            ))}
          </select>

        </div>

        {!selectedTournament && (
          <div className="bg-slate-900 border border-dashed border-slate-700 rounded-xl p-14 text-center">

            <div className="text-6xl mb-5">
              🏆
            </div>

            <h2 className="text-2xl font-semibold">
              Select a Tournament
            </h2>

            <p className="text-slate-400 mt-3">
              Tournament entries will appear here once a completed tournament is
              selected.
            </p>

          </div>
        )}

        {selectedTournament && loadingEntries && (
          <div className="space-y-5">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 animate-pulse"
              >
                <div className="h-5 w-60 bg-slate-700 rounded mb-5"></div>

                <div className="space-y-3">

                  <div className="h-12 bg-slate-800 rounded"></div>

                  <div className="h-12 bg-slate-800 rounded"></div>

                  <div className="h-12 bg-slate-800 rounded"></div>

                </div>

              </div>
            ))}

          </div>
        )}

        {selectedTournament &&
          !loadingEntries &&
          categories.length === 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-14 text-center">

              <div className="text-6xl mb-5">
                📋
              </div>

              <h2 className="text-2xl font-semibold">
                No Tournament Entries
              </h2>

              <p className="text-slate-400 mt-3">
                No players have registered for this tournament.
              </p>

            </div>
          )}

        {selectedTournament &&
          !loadingEntries &&
          categories.length > 0 && (
            <div className="space-y-6">              {categories.map((category) => {
                const players = groupedEntries[category];

                const [gender, event] = category.split("_");

                return (
                  <div
                    key={category}
                    className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">

                      <div>
                        <h2 className="text-xl font-semibold text-emerald-400">
                          {event} {gender}
                        </h2>

                        <p className="text-sm text-slate-400 mt-1">
                          {players.length} Participant
                          {players.length > 1 ? "s" : ""}
                        </p>
                      </div>

                      <span className="px-4 py-1 rounded-full bg-emerald-600/20 border border-emerald-700 text-emerald-400 text-sm font-medium">
                        {players.length}
                      </span>

                    </div>

                    <div className="overflow-x-auto">

                      <table className="w-full">

                        <thead className="bg-slate-800/60">

                          <tr>

                            <th className="w-20 px-6 py-4"></th>

                            <th className="text-left px-6 py-4 text-slate-300 font-medium">
                              Player
                            </th>

                            <th className="text-left px-6 py-4 text-slate-300 font-medium">
                              Status
                            </th>

                            <th className="text-right px-6 py-4 text-slate-300 font-medium">
                              Action
                            </th>

                          </tr>

                        </thead>

                        <tbody>

                          {players.map((player) => {
                            const expanded =
                              expandedRows[player.entryId];

                            return (
                              <React.Fragment key={player.entryId}>
                                <tr
                                  key={player.entryId}
                                  className="border-t border-slate-800 hover:bg-slate-800/40 transition-colors"
                                >
                                  <td className="px-6 py-4">

                                    <button
                                      onClick={() =>
                                        toggleRow(player.entryId)
                                      }
                                      className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition"
                                    >
                                      <svg
                                        className={`w-4 h-4 transition-transform duration-200 ${
                                          expanded
                                            ? "rotate-90"
                                            : ""
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M9 5l7 7-7 7"
                                        />
                                      </svg>
                                    </button>

                                  </td>

                                  <td className="px-6 py-4">

                                    <div className="font-medium text-white">
                                      {player.name}
                                    </div>

                                    <div className="text-xs text-slate-500 mt-1">
                                      Entry :
                                      {" "}
                                      {player.entryId.slice(-8)}
                                    </div>

                                  </td>

                                  <td className="px-6 py-4">

                                    {player.submitted ? (
                                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/20 border border-emerald-700 text-emerald-400 text-sm">
                                        🏅 Submitted
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-700 text-yellow-300 text-sm">
                                        Pending
                                      </span>
                                    )}

                                  </td>

                                  <td className="px-6 py-4 text-right">

                                    <button
                                      disabled={player.submitted}
                                      onClick={() =>
                                        toggleRow(player.entryId)
                                      }
                                      className={`px-5 py-2 rounded-lg transition font-medium

                                      ${
                                        player.submitted
                                          ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                                          : "bg-emerald-600 hover:bg-emerald-500"
                                      }
                                      `}
                                    >
                                      {player.submitted
                                        ? "Locked"
                                        : "Declare"}
                                    </button>

                                  </td>
                                </tr>

                                {expanded &&
                                  !player.submitted && (
                                    <tr className="bg-slate-950 border-t border-slate-800">

                                      <td
                                        colSpan={4}
                                        className="px-8 py-6"
                                      >

                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                                          <div>

                                            <h3 className="text-lg font-semibold">
                                              {player.name}
                                            </h3>

                                            <p className="text-sm text-slate-400 mt-1">
                                              Select the medal position and
                                              save the result.
                                            </p>

                                          </div>

                                          <div className="flex flex-wrap items-center gap-4">

                                            <select
                                              value={
                                                selectedResults[
                                                  player.entryId
                                                ]?.place || ""
                                              }
                                              disabled={
                                                savingRow ===
                                                player.entryId
                                              }
                                              onChange={(e) =>
                                                handlePlaceChange(
                                                  player.entryId,
                                                  e.target.value
                                                )
                                              }
                                              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 outline-none focus:border-emerald-500 disabled:opacity-50"
                                            >
                                              <option value="">
                                                Select Medal
                                              </option>

                                              {places.map((place) => {
  const disabled =
    isPlaceTaken(player, place) &&
    selectedResults[player.entryId]?.place !== place;

  return (
    <option
      key={place}
      value={place}
      disabled={disabled}
    >
      {place === "First" && "🥇 "}
      {place === "Second" && "🥈 "}
      {place === "Third" && "🥉 "}
      {place}
      {disabled ? " (Assigned)" : ""}
    </option>
  );
})}

                                            </select>

                                            <button
                                              onClick={() =>
                                                handleSave(player)
                                              }
                                              disabled={
                                                savingRow ===
                                                  player.entryId ||
                                                !selectedResults[
                                                  player.entryId
                                                ]?.place
                                              }
                                              className={`min-w-[140px] rounded-lg px-5 py-2 font-medium transition

                                              ${
                                                savingRow ===
                                                player.entryId
                                                  ? "bg-emerald-700 cursor-not-allowed"
                                                  : "bg-emerald-600 hover:bg-emerald-500"
                                              }

                                              disabled:opacity-50`}
                                            >
                                              {savingRow ===
                                              player.entryId
                                                ? "Saving..."
                                                : "Save Result"}
                                            </button>

                                          </div>

                                        </div>

                                      </td>

                                    </tr>
                                  )}
                              </React.Fragment>
                            );
                          })}

                        </tbody>

                      </table>

                    </div>

                  </div>
                );
              })}
            </div>
          )}
          </div>
                <div
        className={`fixed top-6 right-6 z-50 transition-all duration-300 ${
          snackbar.open
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`min-w-[320px] rounded-xl border px-5 py-4 shadow-2xl flex items-start gap-3

          ${
            snackbar.severity === "success"
              ? "bg-emerald-950 border-emerald-700 text-emerald-300"
              : snackbar.severity === "warning"
              ? "bg-yellow-950 border-yellow-700 text-yellow-300"
              : "bg-red-950 border-red-700 text-red-300"
          }
          `}
        >
          <div className="text-xl">
            {snackbar.severity === "success" && "✅"}
            {snackbar.severity === "warning" && "⚠️"}
            {snackbar.severity === "error" && "❌"}
          </div>

          <div className="flex-1">
            <p className="font-medium">
              {snackbar.message}
            </p>
          </div>

          <button
            onClick={closeSnackbar}
            className="text-lg hover:opacity-70 transition"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddIndividualResult;