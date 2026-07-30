import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import toast from "react-hot-toast";

import {
  Trophy,
  Users,
  Search,
  Loader2,
  UserCheck,
  CalendarDays,
  MapPin,
  Filter,
} from "lucide-react";

const TournamentEntry = () => {
  // ============================================
  // STATES
  // ============================================

  const [loading, setLoading] = useState(false);

  const [tournaments, setTournaments] = useState([]);

  const [players, setPlayers] = useState([]);

  const [selectedTournament, setSelectedTournament] =
    useState(null);

  const [selectedPlayers, setSelectedPlayers] =
    useState([]);

  const [existingPlayerIds, setExistingPlayerIds] =
    useState([]);

  const [search, setSearch] = useState("");

  const [genderFilter, setGenderFilter] =
    useState("All");

  const [eventFilter, setEventFilter] =
    useState("All");

  // ============================================
  // FETCH TOURNAMENTS
  // ============================================

  const fetchTournaments = async () => {
    try {
      const res = await api.get(
        "/tournament?type=upcoming"
      );

      setTournaments(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load tournaments.");
    }
  };

  // ============================================
  // FETCH PLAYERS
  // ============================================

  const fetchPlayers = async () => {
    try {
      const res = await api.get(
        "/player/getAllPlayers?status=Accepted"
      );

      setPlayers(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load players.");
    }
  };

  // ============================================
  // FETCH EXISTING ENTRIES
  // ============================================

  const fetchExistingEntries = async (
    tournamentId
  ) => {
    try {
      const res = await api.get(
        `/tournament/entry/${tournamentId}`
      );

      const ids = res.data.data.map((entry) =>
        entry.playerId._id.toString()
      );

      setExistingPlayerIds(ids);
    } catch (err) {
      console.error(err);
      toast.error(
        "Unable to fetch tournament entries."
      );
    }
  };

  // ============================================
  // INITIAL LOAD
  // ============================================

  useEffect(() => {
    fetchTournaments();
    fetchPlayers();
  }, []);

  useEffect(() => {
    if (!selectedTournament) return;

    fetchExistingEntries(
      selectedTournament._id
    );

    setSelectedPlayers([]);
  }, [selectedTournament]);

  // ============================================
  // AGE
  // ============================================

  const calculateAge = (dob) => {
    const today = new Date();

    const birth = new Date(dob);

    let age =
      today.getFullYear() -
      birth.getFullYear();

    const month =
      today.getMonth() -
      birth.getMonth();

    if (
      month < 0 ||
      (month === 0 &&
        today.getDate() <
          birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  // ============================================
  // FILTERED PLAYERS
  // ============================================

  const filteredPlayers = useMemo(() => {
    if (!selectedTournament) return [];

    return players.filter((player) => {
      const age = calculateAge(player.dob);

      if (
        age >
        selectedTournament.ageCategory
      )
        return false;

      if (
        genderFilter !== "All" &&
        player.gender !== genderFilter
      )
        return false;

      if (
        eventFilter !== "All" &&
        player.event !== eventFilter
      )
        return false;

      if (
        search &&
        !player.fullName
          .toLowerCase()
          .includes(search.toLowerCase())
      )
        return false;

      return true;
    }).sort((a, b) =>
    a.fullName.localeCompare(b.fullName)
  );
  }, [
    players,
    selectedTournament,
    genderFilter,
    eventFilter,
    search,
  ]);

  // ============================================
  // STATISTICS
  // ============================================

  const stats = useMemo(() => {
    return {
      eligible:
        filteredPlayers.length,

      registered:
        existingPlayerIds.length,

      selected:
        selectedPlayers.length,

      available:
        filteredPlayers.filter(
          (p) =>
            !existingPlayerIds.includes(
              p._id
            )
        ).length,
    };
  }, [
    filteredPlayers,
    existingPlayerIds,
    selectedPlayers,
  ]);

  // ============================================
  // SELECT PLAYER
  // ============================================

  const handleSelectPlayer = (id) => {
    if (
      existingPlayerIds.includes(id)
    )
      return;

    setSelectedPlayers((prev) =>
      prev.includes(id)
        ? prev.filter(
            (playerId) =>
              playerId !== id
          )
        : [...prev, id]
    );
  };

  // ============================================
  // SELECT ALL
  // ============================================

  const handleSelectAll = () => {
    const selectable =
      filteredPlayers
        .filter(
          (player) =>
            !existingPlayerIds.includes(
              player._id
            )
        )
        .map((player) => player._id);

    if (
      selectedPlayers.length ===
      selectable.length
    ) {
      setSelectedPlayers([]);
    } else {
      setSelectedPlayers(selectable);
    }
  };

  // ============================================
  // CREATE ENTRY
  // ============================================

  const handleCreateEntry = async () => {
    if (!selectedTournament) {
      return toast.error(
        "Please select a tournament."
      );
    }

    if (
      selectedPlayers.length === 0
    ) {
      return toast.error(
        "Please select at least one player."
      );
    }

    try {
      setLoading(true);

      const res = await api.post(
        "/tournament/createEntry",
        {
          tournamentId:
            selectedTournament._id,
          playerIds:
            selectedPlayers,
        }
      );

      toast.success(
        `${res.data.addedCount} entries created successfully`
      );

      await fetchExistingEntries(
        selectedTournament._id
      );

      setSelectedPlayers([]);
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Unable to create entries."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // JSX STARTS
  // ============================================

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 lg:p-8">
            {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <div className="mb-10">

        <div className="flex items-center gap-4">

          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center">

            <Trophy
              className="text-blue-500"
              size={34}
            />

          </div>

          <div>

            <h1 className="text-4xl font-bold tracking-tight">
              Tournament Entry Management
            </h1>

            <p className="text-slate-400 mt-1">
              Register eligible players for upcoming tournaments.
            </p>

          </div>

        </div>

      </div>

      {/* ========================================= */}
      {/* STATS */}
      {/* ========================================= */}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 hover:border-blue-500 transition">

          <Users className="text-blue-500 mb-3" />

          <p className="text-slate-400 text-sm">
            Eligible Players
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {stats.eligible}
          </h2>

        </div>

        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 hover:border-green-500 transition">

          <UserCheck className="text-green-500 mb-3" />

          <p className="text-slate-400 text-sm">
            Registered
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {stats.registered}
          </h2>

        </div>

        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 hover:border-yellow-500 transition">

          <Trophy className="text-yellow-500 mb-3" />

          <p className="text-slate-400 text-sm">
            Selected
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {stats.selected}
          </h2>

        </div>

        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 hover:border-purple-500 transition">

          <Users className="text-purple-500 mb-3" />

          <p className="text-slate-400 text-sm">
            Available
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {stats.available}
          </h2>

        </div>

      </div>

      {/* ========================================= */}
      {/* TOURNAMENT + FILTERS */}
      {/* ========================================= */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">

        {/* Tournament */}

        <div className="xl:col-span-1 rounded-3xl bg-slate-900 border border-slate-800 p-8">

          <h2 className="text-2xl font-semibold mb-6">
            Select Tournament
          </h2>

          <select
            value={selectedTournament?._id || ""}
            onChange={(e) => {

              const tournament =
                tournaments.find(
                  (t) =>
                    t._id === e.target.value
                );

              setSelectedTournament(
                tournament
              );

            }}
            className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >

            <option value="">
              Choose Tournament
            </option>

            {tournaments.map(
              (tournament) => (

                <option
                  key={tournament._id}
                  value={tournament._id}
                >
                  {tournament.title}
                </option>

              )
            )}

          </select>

        </div>

        {/* Tournament Info */}

        <div className="xl:col-span-2 rounded-3xl bg-slate-900 border border-slate-800 p-8">

          {selectedTournament ? (

            <>

              <h2 className="text-2xl font-semibold">

                {selectedTournament.title}

              </h2>

              <div className="mt-6 grid md:grid-cols-2 gap-5 text-slate-300">

                <div className="flex items-center gap-3">

                  <CalendarDays
                    className="text-blue-500"
                    size={18}
                  />

                  <span>

                    {new Date(
                      selectedTournament.startingDate
                    ).toLocaleDateString()}

                    {"  "}—{"  "}

                    {new Date(
                      selectedTournament.endDate
                    ).toLocaleDateString()}

                  </span>

                </div>

                <div className="flex items-center gap-3">

                  <MapPin
                    className="text-red-400"
                    size={18}
                  />

                  <span>

                    {selectedTournament.locationCity},{" "}

                    {selectedTournament.locationState}

                  </span>

                </div>

                <div className="flex items-center gap-3">

                  <Trophy
                    className="text-yellow-400"
                    size={18}
                  />

                  <span>

                    {selectedTournament.level} Level

                  </span>

                </div>

                <div className="flex items-center gap-3">

                  <Users
                    className="text-green-400"
                    size={18}
                  />

                  <span>

                    U{selectedTournament.ageCategory}

                  </span>

                </div>

              </div>

            </>

          ) : (

            <div className="h-full flex items-center justify-center text-slate-500">

              Select a tournament to view details.

            </div>

          )}

        </div>

      </div>

      {/* ========================================= */}
      {/* SEARCH + FILTERS */}
      {/* ========================================= */}

      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 mb-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Search */}

          <div className="relative">

            <Search
              className="absolute left-4 top-3.5 text-slate-500"
              size={18}
            />

            <input
              type="text"
              placeholder="Search Player..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full rounded-xl bg-slate-800 border border-slate-700 pl-11 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

          </div>

          {/* Gender */}

          <select
            value={genderFilter}
            onChange={(e) =>
              setGenderFilter(
                e.target.value
              )
            }
            className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          >

            <option>All</option>
            <option>Male</option>
            <option>Female</option>

          </select>

          {/* Event */}

          <select
            value={eventFilter}
            onChange={(e) =>
              setEventFilter(
                e.target.value
              )
            }
            className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          >

            <option>All</option>
            <option>Epee</option>
            <option>Foil</option>
            <option>Sabre</option>

          </select>

        </div>

      </div>
            {/* ========================================= */}
      {/* PLAYER TABLE */}
      {/* ========================================= */}

      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">

        {!selectedTournament ? (

          <div className="flex flex-col items-center justify-center py-24">

            <Trophy
              size={70}
              className="text-slate-700 mb-6"
            />

            <h2 className="text-2xl font-semibold">
              No Tournament Selected
            </h2>

            <p className="text-slate-500 mt-2">
              Please select a tournament to view eligible players.
            </p>

          </div>

        ) : filteredPlayers.length === 0 ? (

          <div className="flex flex-col items-center justify-center py-24">

            <Users
              size={70}
              className="text-slate-700 mb-6"
            />

            <h2 className="text-2xl font-semibold">
              No Players Found
            </h2>

            <p className="text-slate-500 mt-2">
              Try changing the filters or search.
            </p>

          </div>

        ) : (

          <>

            {/* Header */}

            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-800">

              <div>

                <h2 className="text-xl font-semibold">
                  Eligible Players
                </h2>

                <p className="text-slate-400 text-sm mt-1">
                  {filteredPlayers.length} player
                  {filteredPlayers.length !== 1 && "s"} found
                </p>

              </div>

              <button
                onClick={handleSelectAll}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 transition px-5 py-2 font-medium"
              >
                {selectedPlayers.length ===
                filteredPlayers.filter(
                  (p) =>
                    !existingPlayerIds.includes(p._id)
                ).length
                  ? "Unselect All"
                  : "Select All"}
              </button>

            </div>

            {/* Table */}

            <div className="overflow-x-auto max-h-[650px]">

              <table className="min-w-full">

                <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 z-20">

                  <tr>

                    <th className="px-5 py-4 text-left">

                      <input
                        type="checkbox"
                        checked={
                          selectedPlayers.length > 0 &&
                          selectedPlayers.length ===
                            filteredPlayers.filter(
                              (p) =>
                                !existingPlayerIds.includes(
                                  p._id
                                )
                            ).length
                        }
                        onChange={handleSelectAll}
                      />

                    </th>

                    <th className="px-5 py-4 text-left">
                      Player
                    </th>

                    <th className="px-5 py-4 text-left">
                      Gender
                    </th>

                    <th className="px-5 py-4 text-left">
                      Event
                    </th>

                    <th className="px-5 py-4 text-left">
                      Age
                    </th>

                    <th className="px-5 py-4 text-left">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredPlayers.map((player) => {

                    const registered =
                      existingPlayerIds.includes(
                        player._id
                      );

                    const age =
                      calculateAge(player.dob);

                    return (

                      <tr
                        key={player._id}
                        className={`border-b border-slate-800 transition

                        ${
                          registered
                            ? "opacity-60"
                            : "hover:bg-slate-800/60"
                        }`}
                      >

                        <td className="px-5 py-4">

                          <input
                            type="checkbox"
                            disabled={registered}
                            checked={selectedPlayers.includes(
                              player._id
                            )}
                            onChange={() =>
                              handleSelectPlayer(
                                player._id
                              )
                            }
                          />

                        </td>

                        <td className="px-5 py-4">

                          <div>

                            <p className="font-medium">

                              {player.fullName}

                            </p>

                            <p className="text-xs text-slate-500">

                              {player.email}

                            </p>

                          </div>

                        </td>

                        <td className="px-5 py-4">

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium

                            ${
                              player.gender ===
                              "Male"
                                ? "bg-sky-500/20 text-sky-400"
                                : "bg-pink-500/20 text-pink-400"
                            }`}
                          >

                            {player.gender}

                          </span>

                        </td>

                        <td className="px-5 py-4">

                          <span className="rounded-full bg-purple-500/20 text-purple-300 px-3 py-1 text-xs">

                            {player.event}

                          </span>

                        </td>

                        <td className="px-5 py-4">

                          {age}

                        </td>

                        <td className="px-5 py-4">

                          {registered ? (

                            <span className="rounded-full bg-red-500/20 text-red-400 px-3 py-1 text-xs">

                              Registered

                            </span>

                          ) : (

                            <span className="rounded-full bg-green-500/20 text-green-400 px-3 py-1 text-xs">

                              Available

                            </span>

                          )}

                        </td>

                      </tr>

                    );

                  })}

                </tbody>

              </table>

            </div>

          </>

        )}

      </div>
            {/* ========================================= */}
      {/* ACTION BAR */}
      {/* ========================================= */}

      {selectedTournament && (
        <div className="mt-8 rounded-3xl bg-slate-900 border border-slate-800 p-8">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            {/* Selected Summary */}

            <div>

              <h2 className="text-2xl font-semibold">
                Ready to Create Entries
              </h2>

              <p className="text-slate-400 mt-2">
                Review your selection before submitting.
              </p>

              <div className="mt-6 flex flex-wrap gap-4">

                <div className="bg-slate-800 rounded-2xl px-5 py-4">

                  <p className="text-sm text-slate-400">
                    Selected Players
                  </p>

                  <h3 className="text-3xl font-bold text-blue-400 mt-2">
                    {selectedPlayers.length}
                  </h3>

                </div>

                <div className="bg-slate-800 rounded-2xl px-5 py-4">

                  <p className="text-sm text-slate-400">
                    Already Registered
                  </p>

                  <h3 className="text-3xl font-bold text-red-400 mt-2">
                    {existingPlayerIds.length}
                  </h3>

                </div>

                <div className="bg-slate-800 rounded-2xl px-5 py-4">

                  <p className="text-sm text-slate-400">
                    Eligible Players
                  </p>

                  <h3 className="text-3xl font-bold text-green-400 mt-2">
                    {filteredPlayers.length}
                  </h3>

                </div>

              </div>

            </div>

            {/* Create Button */}

            <div className="flex items-center">

              <button
                onClick={handleCreateEntry}
                disabled={loading || selectedPlayers.length === 0}
                className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-10 py-4 font-semibold text-lg shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2
                      className="animate-spin"
                      size={22}
                    />

                    Creating Entries...
                  </>
                ) : (
                  <>
                    <UserCheck size={22} />

                    Create {selectedPlayers.length} Entr
                    {selectedPlayers.length === 1
                      ? "y"
                      : "ies"}
                  </>
                )}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ========================================= */}
      {/* LOADING OVERLAY */}
      {/* ========================================= */}

      {loading && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">

          <div className="rounded-3xl bg-slate-900 border border-slate-700 p-10 flex flex-col items-center shadow-2xl">

            <Loader2
              size={60}
              className="animate-spin text-blue-500"
            />

            <h2 className="text-2xl font-semibold mt-6">
              Creating Tournament Entries
            </h2>

            <p className="text-slate-400 mt-2">
              Please wait while player entries are being created...
            </p>

          </div>

        </div>
      )}

    </div>
  );
};

export default TournamentEntry;