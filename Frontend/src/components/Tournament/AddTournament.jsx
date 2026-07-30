import { useEffect, useMemo, useState } from "react";
import { api } from "../api";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";

import toast from "react-hot-toast";

import {
  Trophy,
  CalendarDays,
  MapPin,
  PlusCircle,
  Loader2,
  Flag,
  Building2,
} from "lucide-react";

const CATEGORY_MAP = {
  U10: 10,
  U12: 12,
  U14: 14,
  U17: 17,
  U19: 19,
  OPEN: 65,
};

const AddTournament = () => {
  // ============================
  // STATES
  // ============================

  const [loading, setLoading] = useState(false);

  const [calendarDate, setCalendarDate] = useState(new Date());

  const [hovered, setHovered] = useState(null);

  const [selectedTournament, setSelectedTournament] = useState(null);

  const [upcomingTournaments, setUpcomingTournaments] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    ageCategory: "",
    level: "",
    locationState: "",
    locationCity: "",
    startingDate: "",
    endDate: "",
  });

  // ============================
  // FETCH TOURNAMENTS
  // ============================

  const fetchUpcomingTournaments = async () => {
    try {
      const res = await api.get("/tournament?type=upcoming");

      const tournaments = res.data.data || [];

      setUpcomingTournaments(tournaments);

      if (tournaments.length > 0) {
        setSelectedTournament(tournaments[0]);
      }
    } catch (error) {
      console.error(error);

      toast.error("Unable to load tournaments.");
    }
  };

  useEffect(() => {
    fetchUpcomingTournaments();
  }, []);

  // ============================
  // STATS
  // ============================

  const stats = useMemo(() => {
    return {
      upcoming: upcomingTournaments.length,

      national: upcomingTournaments.filter(
        (t) => t.level === "National"
      ).length,

      state: upcomingTournaments.filter(
        (t) => t.level === "State"
      ).length,

      district: upcomingTournaments.filter(
        (t) => t.level === "District"
      ).length,
    };
  }, [upcomingTournaments]);

  // ============================
  // INPUT CHANGE
  // ============================

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ============================
  // VALIDATION
  // ============================

  const validateForm = () => {
    const values = Object.values(formData);

    if (values.some((v) => !v)) {
      toast.error("Please fill all required fields.");
      return false;
    }

    const start = new Date(formData.startingDate);

    const end = new Date(formData.endDate);

    if (end < start) {
      toast.error(
        "End date cannot be before start date."
      );
      return false;
    }

    return true;
  };

  // ============================
  // SUBMIT
  // ============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = {
        ...formData,
        ageCategory: CATEGORY_MAP[formData.ageCategory],
      };

      await api.post("/tournament", payload);

      toast.success("Tournament created successfully!");

      setFormData({
        title: "",
        ageCategory: "",
        level: "",
        locationState: "",
        locationCity: "",
        startingDate: "",
        endDate: "",
      });

      await fetchUpcomingTournaments();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Unable to create tournament."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // CALENDAR RANGE COLORS
  // ============================

  const getTileClass = (date) => {
    for (const tournament of upcomingTournaments) {
      const current = new Date(date).setHours(
        0,
        0,
        0,
        0
      );

      const start = new Date(
        tournament.startingDate
      ).setHours(0, 0, 0, 0);

      const end = new Date(
        tournament.endDate
      ).setHours(0, 0, 0, 0);

      if (current === start) return "range-start";

      if (current === end) return "range-end";

      if (current > start && current < end)
        return "range-middle";
    }

    return "";
  };

  // ============================
  // CALENDAR EVENTS
  // ============================

  const getTournamentOnDate = (date) => {
    return upcomingTournaments.filter((t) => {
      const current = new Date(date).setHours(
        0,
        0,
        0,
        0
      );

      const start = new Date(
        t.startingDate
      ).setHours(0, 0, 0, 0);

      const end = new Date(
        t.endDate
      ).setHours(0, 0, 0, 0);

      return current >= start && current <= end;
    });
  };

  // ============================
  // JSX STARTS HERE
  // ============================

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 lg:p-8">
            {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <div className="mb-10">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-blue-600/20 flex items-center justify-center">

            <Trophy className="text-blue-500" size={30} />

          </div>

          <div>

            <h1 className="text-4xl font-bold tracking-tight">
              Tournament Management
            </h1>

            <p className="text-slate-400 mt-1">
              Create and manage fencing tournaments effortlessly.
            </p>

          </div>

        </div>

      </div>

      {/* ========================================= */}
      {/* STATS */}
      {/* ========================================= */}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg hover:border-blue-500 transition">

          <p className="text-slate-400 text-sm">
            Upcoming
          </p>

          <h2 className="text-4xl font-bold mt-3 text-blue-500">
            {stats.upcoming}
          </h2>

        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg hover:border-green-500 transition">

          <p className="text-slate-400 text-sm">
            National
          </p>

          <h2 className="text-4xl font-bold mt-3 text-green-400">
            {stats.national}
          </h2>

        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg hover:border-orange-500 transition">

          <p className="text-slate-400 text-sm">
            State
          </p>

          <h2 className="text-4xl font-bold mt-3 text-orange-400">
            {stats.state}
          </h2>

        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg hover:border-purple-500 transition">

          <p className="text-slate-400 text-sm">
            District
          </p>

          <h2 className="text-4xl font-bold mt-3 text-purple-400">
            {stats.district}
          </h2>

        </div>

      </div>

      {/* ========================================= */}
      {/* MAIN GRID */}
      {/* ========================================= */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* ========================================= */}
        {/* FORM */}
        {/* ========================================= */}

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl shadow-xl p-8">

          <div className="flex items-center gap-3 mb-8">

            <PlusCircle
              className="text-blue-500"
              size={28}
            />

            <h2 className="text-2xl font-semibold">
              Create Tournament
            </h2>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Name */}

            <div>

              <label className="block text-sm text-slate-400 mb-2">
                Tournament Name
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Mini State Championship"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />

            </div>

            {/* Category */}

            <div>

              <label className="block text-sm text-slate-400 mb-2">
                Age Category
              </label>

              <select
                name="ageCategory"
                value={formData.ageCategory}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Category</option>
                <option value="U10">U10</option>
                <option value="U12">U12</option>
                <option value="U14">U14</option>
                <option value="U17">U17</option>
                <option value="U19">U19</option>
                <option value="OPEN">OPEN</option>
              </select>

            </div>

            {/* Level */}

            <div>

              <label className="block text-sm text-slate-400 mb-2">
                Tournament Level
              </label>

              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Level</option>
                <option value="District">District</option>
                <option value="State">State</option>
                <option value="National">National</option>
              </select>

            </div>

            {/* State */}

            <div>

              <label className="block text-sm text-slate-400 mb-2">
                State
              </label>

              <input
                type="text"
                name="locationState"
                value={formData.locationState}
                onChange={handleChange}
                placeholder="Maharashtra"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />

            </div>

            {/* City */}

            <div>

              <label className="block text-sm text-slate-400 mb-2">
                City
              </label>

              <input
                type="text"
                name="locationCity"
                value={formData.locationCity}
                onChange={handleChange}
                placeholder="Pune"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />

            </div>

            {/* Dates */}

            <div className="grid grid-cols-2 gap-4">

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Start Date
                </label>

                <input
                  type="date"
                  name="startingDate"
                  value={formData.startingDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                />

              </div>

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  End Date
                </label>

                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                />

              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-3 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-semibold shadow-lg hover:shadow-blue-600/30 hover:scale-[1.02] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2
                    className="animate-spin"
                    size={20}
                  />
                  Creating Tournament...
                </>
              ) : (
                <>
                  <PlusCircle size={20} />
                  Create Tournament
                </>
              )}
            </button>

          </form>

        </div>
                {/* ========================================= */}
        {/* CALENDAR */}
        {/* ========================================= */}

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl shadow-xl p-8">

          <div className="flex items-center gap-3 mb-6">

            <CalendarDays
              className="text-blue-500"
              size={28}
            />

            <div>

              <h2 className="text-2xl font-semibold">
                Tournament Calendar
              </h2>

              <p className="text-sm text-slate-400">
                View upcoming tournaments by date
              </p>

            </div>

          </div>

          <Calendar
            value={calendarDate}
            onChange={setCalendarDate}
            tileClassName={({ date, view }) =>
              view === "month"
                ? getTileClass(date)
                : null
            }
            tileContent={({ date, view }) => {

              if (view !== "month") return null;

              const matches =
                getTournamentOnDate(date);

              if (matches.length === 0) return null;

              return (

                <div
                  className="flex justify-center mt-1"
                  onMouseEnter={() =>
                    setHovered({
                      date,
                      matches,
                    })
                  }
                  onMouseLeave={() =>
                    setHovered(null)
                  }
                >

                  <div className="w-2 h-2 rounded-full bg-blue-500" />

                </div>

              );

            }}
          />

          {/* ================= LEGEND ================= */}

          <div className="mt-8 border-t border-slate-700 pt-6">

            <h3 className="font-semibold mb-4">
              Calendar Legend
            </h3>

            <div className="grid grid-cols-1 gap-3 text-sm text-slate-300">

              <div className="flex items-center gap-3">

                <div className="w-4 h-4 rounded bg-green-500"></div>

                Tournament Start

              </div>

              <div className="flex items-center gap-3">

                <div className="w-4 h-4 rounded bg-blue-500"></div>

                Tournament Running

              </div>

              <div className="flex items-center gap-3">

                <div className="w-4 h-4 rounded bg-red-500"></div>

                Tournament End

              </div>

            </div>

          </div>

          {/* ================= HOVER DETAILS ================= */}

          {hovered && (

            <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-800 p-5">

              <p className="font-semibold text-blue-400">

                {new Date(
                  hovered.date
                ).toDateString()}

              </p>

              <div className="mt-4 space-y-3">

                {hovered.matches.map((t) => (

                  <button
                    key={t._id}
                    type="button"
                    onClick={() =>
                      setSelectedTournament(t)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 text-left transition hover:border-blue-500 hover:bg-slate-800"
                  >

                    <p className="font-semibold">

                      {t.title}

                    </p>

                    <p className="text-sm text-slate-400 mt-1">

                      {t.level} • U{t.ageCategory}

                    </p>

                  </button>

                ))}

              </div>

            </div>

          )}

          {/* ================= SELECTED TOURNAMENT ================= */}

          {selectedTournament && (

            <div className="mt-8 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 to-slate-900 p-6">

              <div className="flex items-center justify-between">

                <h3 className="text-xl font-semibold">

                  {selectedTournament.title}

                </h3>

                <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold">

                  U{selectedTournament.ageCategory}

                </span>

              </div>

              <div className="mt-6 space-y-4 text-slate-300">

                <div className="flex items-center gap-3">

                  <CalendarDays
                    size={18}
                    className="text-blue-400"
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
                    size={18}
                    className="text-red-400"
                  />

                  <span>

                    {selectedTournament.locationCity},{" "}

                    {selectedTournament.locationState}

                  </span>

                </div>

                <div className="flex items-center gap-3">

                  <Flag
                    size={18}
                    className="text-yellow-400"
                  />

                  <span>

                    {selectedTournament.level} Level

                  </span>

                </div>

              </div>

            </div>

          )}

        </div>
                {/* ========================================= */}
        {/* UPCOMING TOURNAMENTS */}
        {/* ========================================= */}

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl shadow-xl p-8">

          <div className="flex items-center gap-3 mb-8">

            <Trophy
              className="text-yellow-400"
              size={28}
            />

            <div>

              <h2 className="text-2xl font-semibold">
                Upcoming Tournaments
              </h2>

              <p className="text-sm text-slate-400">
                {upcomingTournaments.length} Tournament
                {upcomingTournaments.length !== 1 && "s"}
              </p>

            </div>

          </div>

          {upcomingTournaments.length === 0 ? (

            <div className="flex flex-col items-center justify-center py-20">

              <Trophy
                size={70}
                className="text-slate-700 mb-5"
              />

              <h3 className="text-xl font-semibold">
                No Upcoming Tournaments
              </h3>

              <p className="text-slate-500 mt-2 text-center">
                Create your first tournament to
                populate the calendar.
              </p>

            </div>

          ) : (

            <div className="space-y-5 max-h-[720px] overflow-y-auto pr-2">

              {upcomingTournaments.map((tournament) => (

                <button
                  key={tournament._id}
                  type="button"
                  onClick={() =>
                    setSelectedTournament(
                      tournament
                    )
                  }
                  className={`w-full rounded-2xl border transition-all duration-300 text-left p-5

                  ${
                    selectedTournament?._id ===
                    tournament._id
                      ? "border-blue-500 bg-blue-600/10"
                      : "border-slate-700 bg-slate-900 hover:border-blue-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10"
                  }`}
                >

                  <div className="flex justify-between items-start">

                    <div>

                      <h3 className="text-lg font-semibold">

                        {tournament.title}

                      </h3>

                      <p className="text-slate-400 mt-1">

                        {tournament.level} Level

                      </p>

                    </div>

                    <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold">

                      U{tournament.ageCategory}

                    </span>

                  </div>

                  <div className="mt-5 space-y-3 text-sm text-slate-300">

                    <div className="flex items-center gap-3">

                      <CalendarDays
                        size={16}
                        className="text-blue-400"
                      />

                      <span>

                        {new Date(
                          tournament.startingDate
                        ).toLocaleDateString()}

                        {"  "}—{"  "}

                        {new Date(
                          tournament.endDate
                        ).toLocaleDateString()}

                      </span>

                    </div>

                    <div className="flex items-center gap-3">

                      <MapPin
                        size={16}
                        className="text-red-400"
                      />

                      <span>

                        {tournament.locationCity},{" "}

                        {tournament.locationState}

                      </span>

                    </div>

                  </div>

                </button>

              ))}

            </div>

          )}

        </div>

      </div>

      {/* ========================================= */}
      {/* LOADING OVERLAY */}
      {/* ========================================= */}

      {loading && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-10 flex flex-col items-center shadow-2xl">

            <Loader2
              size={60}
              className="animate-spin text-blue-500"
            />

            <h2 className="mt-6 text-2xl font-semibold">

              Creating Tournament...

            </h2>

            <p className="text-slate-400 mt-2">

              Please wait while we save your tournament.

            </p>

          </div>

        </div>

      )}

    </div>
  );
};

export default AddTournament;