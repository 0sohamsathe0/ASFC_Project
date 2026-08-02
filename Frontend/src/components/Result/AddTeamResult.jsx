import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";

const AddTeamResult = () => {
  /* -------------------------------------------------------------------------- */
  /*                                    STATE                                   */
  /* -------------------------------------------------------------------------- */

  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState("");

  // Registered teams grouped by category
  const [teamGroups, setTeamGroups] = useState({});

  // Existing results fetched from backend
  const [results, setResults] = useState({});

  // External players added by admin
  const [externalPlayers, setExternalPlayers] = useState({});

  // Selected position for every category
  const [selectedPlace, setSelectedPlace] = useState({});

  // UI States
  const [expandedRow, setExpandedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savingRow, setSavingRow] = useState(null);

  // Optional (will replace alerts later)
  const [rowErrors, setRowErrors] = useState({});
  const [rowSuccess, setRowSuccess] = useState({});

  /* -------------------------------------------------------------------------- */
  /*                                  CONSTANTS                                 */
  /* -------------------------------------------------------------------------- */

  const places = ["First", "Second", "Third"];

  const eventColors = {
    Epee: "text-yellow-300",
    Foil: "text-blue-400",
    Sabre: "text-red-400",
  };

  /* -------------------------------------------------------------------------- */
  /*                                INITIAL LOAD                                */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    fetchTournaments();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                            FETCH TOURNAMENT LIST                           */
  /* -------------------------------------------------------------------------- */

  const fetchTournaments = async () => {
    try {
      const res = await api.get("/tournament?type=completed");

      setTournaments(res.data.data);
    } catch (err) {
      console.error("Tournament Fetch Error:", err);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                        TOURNAMENT CHANGE HANDLER                            */
  /* -------------------------------------------------------------------------- */

  const handleTournamentChange = async (tournamentId) => {
    if (!tournamentId) return;

    setSelectedTournament(tournamentId);

    // Reset UI

    setExpandedRow(null);
    setSavingRow(null);

    setExternalPlayers({});
    setSelectedPlace({});
    setRowErrors({});
    setRowSuccess({});

    setTeamGroups({});
    setResults({});

    try {
      setLoading(true);

      /* ---------------------- Fetch Tournament Entries ---------------------- */

      const entryRes = await api.get(
        `/tournament/entry/${tournamentId}`
      );

      const entries = entryRes.data.data;

      const grouped = {};

      entries.forEach((entry) => {
        const player = entry.playerId;

        const category = `${player.gender}_${player.event}`;

        if (!grouped[category]) {
          grouped[category] = [];
        }

        grouped[category].push({
          _id: player._id,
          entryId: entry._id,
          name: player.fullName,
          gender: player.gender,
          event: player.event,
        });
      });

      setTeamGroups(grouped);

      /* ------------------------- Fetch Existing Results ------------------------- */

      const resultRes = await api.get(
        `/result/team/${tournamentId}`
      );

      const formatted = {};

      resultRes.data.data.forEach((result) => {
        if (!formatted[result.category]) {
          formatted[result.category] = {};
        }

        formatted[result.category][result.place] = result;
      });

      setResults(formatted);
    } catch (err) {
      console.error("Tournament Load Error:", err);
    } finally {
      setLoading(false);
    }
  };
  /* -------------------------------------------------------------------------- */
  /*                          ADD EXTERNAL PLAYER                               */
  /* -------------------------------------------------------------------------- */

  const addExternalPlayer = (category, name) => {
    const trimmed = name.trim();

    if (!trimmed) return;

    // Prevent duplicate names
    const alreadyExists = (externalPlayers[category] || []).some(
      (player) =>
        player.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (alreadyExists) {
      setRowErrors((prev) => ({
        ...prev,
        [category]: "Player already added.",
      }));
      return;
    }

    // Maximum team size = 4
    if (getTeamSize(category) >= 4) {
      setRowErrors((prev) => ({
        ...prev,
        [category]: "Maximum 4 players allowed.",
      }));
      return;
    }

    setExternalPlayers((prev) => ({
      ...prev,
      [category]: [
        ...(prev[category] || []),
        {
          id: Date.now(),
          name: trimmed,
        },
      ],
    }));

    setRowErrors((prev) => ({
      ...prev,
      [category]: "",
    }));
  };

  /* -------------------------------------------------------------------------- */
  /*                        REMOVE EXTERNAL PLAYER                              */
  /* -------------------------------------------------------------------------- */

  const removeExternalPlayer = (category, id) => {
    setExternalPlayers((prev) => ({
      ...prev,
      [category]: (prev[category] || []).filter(
        (player) => player.id !== id
      ),
    }));

    setRowErrors((prev) => ({
      ...prev,
      [category]: "",
    }));
  };

  /* -------------------------------------------------------------------------- */
  /*                              TEAM SIZE                                     */
  /* -------------------------------------------------------------------------- */

  const getTeamSize = (category) => {
    const registered = teamGroups[category] || [];
    const external = externalPlayers[category] || [];

    return registered.length + external.length;
  };

  /* -------------------------------------------------------------------------- */
  /*                             TEAM VALIDATION                                */
  /* -------------------------------------------------------------------------- */

  const validateTeam = (category) => {
    const registered = teamGroups[category] || [];
    const external = externalPlayers[category] || [];

    const total = registered.length + external.length;

    if (total < 3) {
      return {
        valid: false,
        message: "Minimum 3 players required.",
      };
    }

    if (total > 4) {
      return {
        valid: false,
        message: "Maximum 4 players allowed.",
      };
    }

    return {
      valid: true,
      message: "Team is ready.",
    };
  };

  /* -------------------------------------------------------------------------- */
  /*                               SAVE RESULT                                  */
  /* -------------------------------------------------------------------------- */

  const saveResult = async (category) => {
    const validation = validateTeam(category);

    if (!validation.valid) {
      setRowErrors((prev) => ({
        ...prev,
        [category]: validation.message,
      }));
      return;
    }

    if (!selectedPlace[category]) {
      setRowErrors((prev) => ({
        ...prev,
        [category]: "Please select a position.",
      }));
      return;
    }

    const existing = results[category] || {};

    if (
      existing.First ||
      existing.Second ||
      existing.Third
    ) {
      setRowErrors((prev) => ({
        ...prev,
        [category]: "Result already declared.",
      }));
      return;
    }

    try {
      setSavingRow(category);

      setRowErrors((prev) => ({
        ...prev,
        [category]: "",
      }));

      const registeredPlayers = (
        teamGroups[category] || []
      ).map((player) => ({
        playerId: player._id,
        entryId: player.entryId,
        name: player.name,
      }));

      const outsidePlayers = (
        externalPlayers[category] || []
      ).map((player) => ({
        playerId: null,
        entryId: null,
        name: player.name,
      }));

      await api.post("/result/team", {
        tournamentId: selectedTournament,
        category,
        place: selectedPlace[category],
        players: [
          ...registeredPlayers,
          ...outsidePlayers,
        ],
      });

      // Refresh latest data
      await handleTournamentChange(selectedTournament);
      setExpandedRow(category)

      setRowSuccess((prev) => ({
        ...prev,
        [category]: "Result saved successfully.",
      }));
    } catch (err) {
      console.error(err);

      setRowErrors((prev) => ({
        ...prev,
        [category]:
          err.response?.data?.message ||
          "Unable to save result.",
      }));
    } finally {
      setSavingRow(null);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                            CATEGORY LIST                                   */
  /* -------------------------------------------------------------------------- */

  const categories = useMemo(() => {
    return Object.keys(teamGroups).sort((a, b) => {
      const [genderA, eventA] = a.split("_");
      const [genderB, eventB] = b.split("_");

      if (eventA === eventB) {
        return genderA.localeCompare(genderB);
      }

      return eventA.localeCompare(eventB);
    });
  }, [teamGroups]);
  /* -------------------------------------------------------------------------- */
  /*                                   UI                                       */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">

      {/* ---------------------------------------------------------------------- */}
      {/* Header                                                                 */}
      {/* ---------------------------------------------------------------------- */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div>
          <h1 className="text-3xl font-bold text-green-400">
            Team Result Management
          </h1>

          <p className="text-slate-400 mt-1">
            Select a completed tournament and declare team results.
          </p>
        </div>

        <div className="w-full lg:w-96">

          <select
            value={selectedTournament}
            onChange={(e) =>
              handleTournamentChange(e.target.value)
            }
            className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none transition focus:border-green-500"
          >
            <option value="">
              Select Tournament
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

      </div>

      {!selectedTournament && (
        <div className="mt-10 rounded-xl border border-dashed border-slate-700 bg-slate-800/40 p-10 text-center">
          <div className="text-5xl mb-3">🏆</div>

          <h3 className="text-xl font-semibold text-white">
            No Tournament Selected
          </h3>

          <p className="mt-2 text-slate-400">
            Select a completed tournament above to view participating teams.
          </p>
        </div>
      )}



      {/* ---------------------------------------------------------------------- */}
      {/* Loading State                                                          */}
      {/* ---------------------------------------------------------------------- */}

      {selectedTournament && loading && (

        <div className="space-y-4">

          {[1, 2, 3, 4, 5].map((item) => (

            <div
              key={item}
              className="h-16 rounded-xl bg-slate-800 animate-pulse"
            />

          ))}

        </div>

      )}



      {/* ---------------------------------------------------------------------- */}
      {/* Empty State                                                            */}
      {/* ---------------------------------------------------------------------- */}

      {selectedTournament &&
        !loading &&
        categories.length > 0 && (
          <div className="rounded-xl bg-slate-800 border border-slate-700 p-10 text-center">

            <h2 className="text-xl font-semibold text-slate-200">
              No Team Entries Found
            </h2>

            <p className="mt-2 text-slate-400">
              No registered team entries are available for this
              tournament.
            </p>

          </div>

        )}

      {/* ---------------------------------------------------------------------- */}
      {/* Results Table                                                          */}
      {/* ---------------------------------------------------------------------- */}

      {!loading &&
        categories.length > 0 && (

          <div className="overflow-hidden rounded-2xl border border-slate-700">

            {/* ------------------------- Table Header -------------------------- */}

            <div className="grid grid-cols-12 bg-slate-800 px-6 py-4 text-sm font-semibold uppercase tracking-wide text-green-400">

              <div className="col-span-1"></div>

              <div className="col-span-3">
                Category
              </div>

              <div className="col-span-2">
                Registered
              </div>

              <div className="col-span-2">
                Team Size
              </div>

              <div className="col-span-2">
                Status
              </div>

              <div className="col-span-2 text-right">
                Action
              </div>

            </div>

            {/* --------------------------- Table Body -------------------------- */}

            {categories.map((category) => {

              const players =
                teamGroups[category] || [];

              const existing =
                results[category] || {};

              const validation =
                validateTeam(category);

              const expanded =
                expandedRow === category;

              const isSubmitted =
                existing.First ||
                existing.Second ||
                existing.Third;

              const [gender, event] =
                category.split("_");
              return (
                <div
                  key={category}
                  className={`border-t border-slate-700 transition-all duration-300 ${expanded
                    ? "bg-green-950/20"
                    : "bg-slate-900 hover:bg-slate-800/60"
                    }`}
                >
                  {/* ====================== Main Row ====================== */}

                  <div
                    onClick={() =>
                      setExpandedRow(
                        expanded ? null : category
                      )
                    }
                    className="grid grid-cols-12 items-center px-6 py-5 cursor-pointer"
                  >
                    {/* Expand */}

                    <div className="col-span-1 text-lg text-slate-400">
                      {expanded ? "▼" : "▶"}
                    </div>

                    {/* Category */}

                    <div className="col-span-3">

                      <div
                        className={`text-lg font-semibold ${eventColors[event]}`}
                      >
                        {event}
                      </div>

                      <div className="text-sm text-slate-400">
                        {gender}
                      </div>

                    </div>

                    {/* Registered */}

                    <div className="col-span-2">

                      <span className="inline-flex items-center rounded-full bg-slate-700 px-3 py-1 text-sm">

                        {players.length} Registered

                      </span>

                    </div>

                    {/* Team Size */}

                    <div className="col-span-2">

                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${validation.valid
                          ? "bg-green-600/20 text-green-400"
                          : "bg-red-600/20 text-red-400"
                          }`}
                      >
                        {getTeamSize(category)}/4
                      </span>

                    </div>

                    {/* Status */}

                    <div className="col-span-2">

                      {isSubmitted ? (
                        <span className="inline-flex rounded-full bg-green-600/20 px-3 py-1 text-sm text-green-400">

                          ✓ Submitted

                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-yellow-500/20 px-3 py-1 text-sm text-yellow-300">

                          Pending

                        </span>
                      )}

                    </div>

                    {/* Action */}

                    <div className="col-span-2 flex justify-end">

                      <button
                        type="button"
                        className="rounded-lg border border-slate-600 px-4 py-2 text-sm hover:border-green-500 hover:text-green-400 transition"
                      >
                        {expanded
                          ? "Collapse"
                          : "Expand"}
                      </button>

                    </div>

                  </div>

                  {/* ================= Expanded Section ================= */}

                  {expanded && (

                    <div className="border-t border-slate-700 bg-slate-800/40 p-6">

                      {/* Errors */}

                      {rowErrors[category] && (

                        <div className="mb-5 rounded-lg border border-red-500 bg-red-600/20 px-4 py-3 text-sm text-red-300">

                          {rowErrors[category]}

                        </div>

                      )}

                      {/* Success */}

                      {rowSuccess[category] && (

                        <div className="mb-5 rounded-lg border border-green-500 bg-green-600/20 px-4 py-3 text-sm text-green-300">

                          {rowSuccess[category]}

                        </div>

                      )}

                      {/* Two Column Layout */}

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                        {/* Left Column Starts Here */}
                        <div>

                          <h3 className="mb-4 text-lg font-semibold text-green-300">
                            Registered Players
                          </h3>

                          <div className="flex flex-wrap gap-2">

                            {players.map((player) => (

                              <span
                                key={player._id}
                                className="rounded-full bg-slate-700 px-3 py-2 text-sm"
                              >
                                {player.name}
                              </span>

                            ))}

                          </div>

                          {/* External Players starts below */}
                          {/* ================= External Players ================= */}

                          <div className="mt-8">

                            <h3 className="mb-4 text-lg font-semibold text-green-300">
                              External Players
                            </h3>

                            <div className="flex flex-wrap gap-2 mb-4">

                              {(externalPlayers[category] || []).length === 0 && (
                                <span className="text-sm text-slate-500">
                                  No external players added.
                                </span>
                              )}

                              {(externalPlayers[category] || []).map((player) => (

                                <div
                                  key={player.id}
                                  className="flex items-center gap-2 rounded-full border border-green-500/30 bg-green-600/20 px-3 py-2"
                                >

                                  <span className="text-sm">
                                    {player.name}
                                  </span>

                                  <button
                                    type="button"
                                    disabled={savingRow === category}
                                    onClick={() =>
                                      removeExternalPlayer(category, player.id)
                                    }
                                    className="text-red-400 transition hover:text-red-300"
                                  >
                                    ✕
                                  </button>

                                </div>

                              ))}

                            </div>

                            <input
                              type="text"
                              disabled={
                                savingRow === category ||
                                getTeamSize(category) >= 4
                              }
                              placeholder={
                                getTeamSize(category) >= 4
                                  ? "Maximum team size reached"
                                  : "Type player name and press Enter"
                              }
                              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none transition focus:border-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                              onKeyDown={(e) => {
                                if (
                                  e.key === "Enter" &&
                                  e.currentTarget.value.trim()
                                ) {
                                  addExternalPlayer(
                                    category,
                                    e.currentTarget.value
                                  );

                                  e.currentTarget.value = "";
                                }
                              }}
                            />

                          </div>

                        </div>

                        {/* ================= Right Column ================= */}

                        <div>

                          {/* Team Summary */}

                          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">

                            <h3 className="mb-5 text-lg font-semibold text-green-300">
                              Team Summary
                            </h3>

                            <div className="grid grid-cols-3 gap-4">

                              <div className="rounded-xl bg-slate-800 p-4 text-center">

                                <div className="text-xs uppercase tracking-wide text-slate-400">
                                  Registered
                                </div>

                                <div className="mt-2 text-3xl font-bold text-blue-400">
                                  {players.length}
                                </div>

                              </div>

                              <div className="rounded-xl bg-slate-800 p-4 text-center">

                                <div className="text-xs uppercase tracking-wide text-slate-400">
                                  External
                                </div>

                                <div className="mt-2 text-3xl font-bold text-yellow-400">
                                  {(externalPlayers[category] || []).length}
                                </div>

                              </div>

                              <div className="rounded-xl bg-slate-800 p-4 text-center">

                                <div className="text-xs uppercase tracking-wide text-slate-400">
                                  Total
                                </div>

                                <div className="mt-2 text-3xl font-bold text-green-400">
                                  {getTeamSize(category)}
                                </div>

                              </div>

                            </div>

                            <div className="mt-6">

                              {validation.valid ? (

                                <div className="rounded-xl border border-green-500 bg-green-600/20 px-4 py-3 text-green-300">

                                  ✓ {validation.message}

                                </div>

                              ) : (

                                <div className="rounded-xl border border-red-500 bg-red-600/20 px-4 py-3 text-red-300">

                                  ✕ {validation.message}

                                </div>

                              )}

                            </div>

                          </div>

                          {/* Position */}

                          <div className="mt-8">

                            <h3 className="mb-4 text-lg font-semibold text-green-300">
                              Select Position
                            </h3>

                            <div className="grid grid-cols-3 gap-3">

                              {places.map((place) => (

                                <label
                                  key={place}
                                  className={`cursor-pointer rounded-xl border p-4 text-center transition ${selectedPlace[category] === place
                                    ? "border-green-500 bg-green-600/20"
                                    : "border-slate-700 bg-slate-900 hover:border-green-500"
                                    }`}
                                >

                                  <input
                                    type="radio"
                                    className="hidden"
                                    disabled={savingRow === category}
                                    checked={
                                      selectedPlace[category] === place
                                    }
                                    onChange={() =>
                                      setSelectedPlace((prev) => ({
                                        ...prev,
                                        [category]: place,
                                      }))
                                    }
                                  />

                                  <div className="font-medium">

                                    {place === "First" && "🥇 Gold"}

                                    {place === "Second" && "🥈 Silver"}

                                    {place === "Third" && "🥉 Bronze"}

                                  </div>

                                </label>

                              ))}

                            </div>

                          </div>
                          {/* ================= Save Result ================= */}

                          <div className="mt-8 border-t border-slate-700 pt-6">

                            {(results[category]?.First ||
                              results[category]?.Second ||
                              results[category]?.Third) ? (

                              <div className="flex items-center justify-between rounded-2xl border border-green-500 bg-green-600/20 p-5">

                                <div>

                                  <h3 className="text-lg font-semibold text-green-300">
                                    Result Already Declared
                                  </h3>

                                  <p className="mt-1 text-sm text-green-200">
                                    Team result has already been submitted for
                                    this category.
                                  </p>

                                </div>

                                <div className="text-4xl">
                                  🏆
                                </div>

                              </div>

                            ) : (

                              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                                <div>

                                  {validation.valid ? (

                                    <p className="text-green-400 font-medium">
                                      ✓ Team is ready for submission.
                                    </p>

                                  ) : (

                                    <p className="text-red-400 font-medium">
                                      {validation.message}
                                    </p>

                                  )}

                                </div>

                                <button
                                  type="button"
                                  onClick={() => saveResult(category)}
                                  disabled={
                                    savingRow === category ||
                                    !validation.valid ||
                                    !selectedPlace[category]
                                  }
                                  className={`min-w-[220px] rounded-xl px-6 py-3 font-semibold transition-all duration-300 ${savingRow === category
                                    ? "cursor-not-allowed bg-green-800"
                                    : validation.valid &&
                                      selectedPlace[category]
                                      ? "bg-green-600 hover:bg-green-500 active:scale-95"
                                      : "cursor-not-allowed bg-slate-700 text-slate-400"
                                    }`}
                                >

                                  {savingRow === category ? (

                                    <div className="flex items-center justify-center gap-3">

                                      <svg
                                        className="h-5 w-5 animate-spin"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                      >
                                        <circle
                                          className="opacity-20"
                                          cx="12"
                                          cy="12"
                                          r="10"
                                          stroke="currentColor"
                                          strokeWidth="4"
                                        />

                                        <path
                                          className="opacity-90"
                                          fill="currentColor"
                                          d="M12 2a10 10 0 0110 10h-4a6 6 0 00-6-6V2z"
                                        />
                                      </svg>

                                      Saving...

                                    </div>

                                  ) : (

                                    "Save Result"

                                  )}

                                </button>

                              </div>

                            )}

                          </div>

                        </div>

                      </div>

                    </div>

                  )}

                </div>

              );

            })}

          </div>

        )}

    </div>

  );

};

export default AddTeamResult;