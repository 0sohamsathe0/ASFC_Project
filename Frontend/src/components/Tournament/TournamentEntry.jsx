import { createElement, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { CalendarDays, Check, Filter, Loader2, MapPin, Search, Trophy, UserCheck, Users } from "lucide-react";
import { api } from "../api";
import { exportTournamentEntries } from "../../utils/exportTournamentEntries.js";

const EVENT_ORDER = { Epee: 1, Foil: 2, Sabre: 3 };
const calculateAge = (dob) => {
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const month = today.getMonth() - birth.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};
const formatDate = (date) => new Date(date).toLocaleDateString();

const TournamentEntry = () => {
  const [loading, setLoading] = useState(false);
  const [tournaments, setTournaments] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [existingEntries, setExistingEntries] = useState([]);
  const [existingPlayerIds, setExistingPlayerIds] = useState([]);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [eventFilter, setEventFilter] = useState("All");
  const [entryGender, setEntryGender] = useState("Male");
  const [exporting, setExporting] = useState(false);

  const fetchTournaments = async () => {
    try {
      const res = await api.get("/tournament?type=upcoming");
      setTournaments(res.data.data || []);
    } catch (err) { console.error(err); toast.error("Unable to load tournaments."); }
  };
  const fetchPlayers = async () => {
    try {
      const res = await api.get("/player/getAllPlayers?status=Accepted");
      setPlayers(res.data.data || []);
    } catch (err) { console.error(err); toast.error("Unable to load players."); }
  };
  const fetchExistingEntries = async (tournamentId) => {
    try {
      setLoadingEntries(true);
      const res = await api.get(`/tournament/entry/${tournamentId}`);
      const entries = res.data.data || [];
      setExistingEntries(entries);
      setExistingPlayerIds(entries.map((entry) => entry.playerId._id.toString()));
    } catch (err) { console.error(err); toast.error("Unable to fetch tournament entries."); }
    finally { setLoadingEntries(false); }
  };

  useEffect(() => {
    // Initial remote data load; the setters run after the requests resolve.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTournaments(); fetchPlayers();
  }, []);
  useEffect(() => {
    if (!selectedTournament) return;
    // Refresh entries for the newly selected tournament.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchExistingEntries(selectedTournament._id);
    setSelectedPlayers([]);
  }, [selectedTournament]);

  const filteredPlayers = useMemo(() => {
    if (!selectedTournament) return [];
    return players.filter((player) => {
      const age = calculateAge(player.dob);
      if (age > selectedTournament.ageCategory) return false;
      if (genderFilter !== "All" && player.gender !== genderFilter) return false;
      if (eventFilter !== "All" && player.event !== eventFilter) return false;
      if (search && !player.fullName.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }).sort((a, b) => EVENT_ORDER[a.event] !== EVENT_ORDER[b.event]
      ? EVENT_ORDER[a.event] - EVENT_ORDER[b.event]
      : a.fullName.localeCompare(b.fullName));
  }, [players, selectedTournament, genderFilter, eventFilter, search]);

  const selectablePlayers = useMemo(() => filteredPlayers.filter(
    (player) => !existingPlayerIds.includes(player._id),
  ), [filteredPlayers, existingPlayerIds]);
  const visibleExistingEntries = useMemo(() => existingEntries.filter(
    (entry) => entry.playerId.gender === entryGender
      && entry.playerId.fullName.toLowerCase().includes(search.toLowerCase()),
  ).sort((a, b) => EVENT_ORDER[a.playerId.event] !== EVENT_ORDER[b.playerId.event]
    ? EVENT_ORDER[a.playerId.event] - EVENT_ORDER[b.playerId.event]
    : a.playerId.fullName.localeCompare(b.playerId.fullName)), [existingEntries, entryGender, search]);
  const stats = useMemo(() => ({
    eligible: filteredPlayers.length,
    registered: existingPlayerIds.length,
    selected: selectedPlayers.length,
    available: selectablePlayers.length,
  }), [filteredPlayers, existingPlayerIds, selectedPlayers, selectablePlayers]);

  const handleSelectPlayer = (id) => {
    if (existingPlayerIds.includes(id)) return;
    setSelectedPlayers((prev) => prev.includes(id)
      ? prev.filter((playerId) => playerId !== id) : [...prev, id]);
  };
  const handleSelectAll = () => {
    const selectable = filteredPlayers.filter(
      (player) => !existingPlayerIds.includes(player._id),
    ).map((player) => player._id);
    if (selectedPlayers.length === selectable.length) setSelectedPlayers([]);
    else setSelectedPlayers(selectable);
  };
  const handleCreateEntry = async () => {
    if (!selectedTournament) return toast.error("Please select a tournament.");
    if (selectedPlayers.length === 0) return toast.error("Please select at least one player.");
    try {
      setLoading(true);
      const res = await api.post("/tournament/createEntry", {
        tournamentId: selectedTournament._id, playerIds: selectedPlayers,
      });
      toast.success(`${res.data.addedCount} entries created successfully`);
      await fetchExistingEntries(selectedTournament._id);
      setSelectedPlayers([]);
    } catch (err) { console.error(err); toast.error(err.response?.data?.message || "Unable to create entries."); }
    finally { setLoading(false); }
  };
  const handleExport = async () => {
    try {
      setExporting(true);
      const filteredEntries = existingEntries.filter(
        (entry) => entry.playerId.gender === entryGender,
      ).sort((a, b) => EVENT_ORDER[a.playerId.event] !== EVENT_ORDER[b.playerId.event]
        ? EVENT_ORDER[a.playerId.event] - EVENT_ORDER[b.playerId.event]
        : a.playerId.fullName.localeCompare(b.playerId.fullName));
      await exportTournamentEntries(selectedTournament, filteredEntries, entryGender);
    } catch (err) { console.error(err); toast.error("Unable to export Excel."); }
    finally { setExporting(false); }
  };
  const allSelected = selectedPlayers.length > 0 && selectedPlayers.length === selectablePlayers.length;

  return (
    <main className="min-h-screen min-w-0 bg-slate-950 px-3 py-4 text-white sm:px-5 sm:py-6 lg:p-8">
      <header className="mb-6 flex min-w-0 items-start gap-3 sm:mb-8 sm:items-center sm:gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600/20 sm:h-16 sm:w-16 sm:rounded-2xl"><Trophy className="text-blue-500" size={30} /></div>
        <div className="min-w-0"><h1 className="break-words text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">Tournament Entry Management</h1><p className="mt-1 text-sm text-slate-400 sm:text-base">Register eligible players for upcoming tournaments.</p></div>
      </header>

      <section aria-label="Tournament entry statistics" className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 xl:grid-cols-4">
        {[["Eligible Players", stats.eligible, Users, "text-blue-400"], ["Registered", stats.registered, UserCheck, "text-emerald-400"], ["Selected", stats.selected, Trophy, "text-amber-300"], ["Available", stats.available, Users, "text-violet-400"]].map(([label, value, icon, color]) => (
          <article key={label} className="min-w-0 rounded-xl border border-slate-800 bg-slate-900 p-4 sm:rounded-2xl sm:p-5">{createElement(icon, { className: `mb-2 ${color}`, size: 20 })}<p className="break-words text-xs text-slate-400 sm:text-sm">{label}</p><p className="mt-1 text-2xl font-bold sm:text-3xl">{value}</p></article>
        ))}
      </section>

      <section className="mb-6 grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
          <label htmlFor="tournament-select" className="mb-3 block text-lg font-semibold sm:text-xl">1. Select Tournament</label>
          <select id="tournament-select" value={selectedTournament?._id || ""} onChange={(e) => setSelectedTournament(tournaments.find((t) => t._id === e.target.value))} className="min-h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"><option value="">Choose Tournament</option>{tournaments.map((t) => <option key={t._id} value={t._id}>{t.title}</option>)}</select>
        </div>
        <div className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6 xl:col-span-2">
          {selectedTournament ? <><h2 className="break-words text-xl font-semibold sm:text-2xl">{selectedTournament.title}</h2><div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-300 sm:grid-cols-2"><p className="flex min-w-0 items-start gap-2"><CalendarDays className="mt-0.5 shrink-0 text-blue-400" size={17} /><span className="break-words">{formatDate(selectedTournament.startingDate)} – {formatDate(selectedTournament.endDate)}</span></p><p className="flex min-w-0 items-start gap-2"><MapPin className="mt-0.5 shrink-0 text-rose-400" size={17} /><span className="break-words">{selectedTournament.locationCity}, {selectedTournament.locationState}</span></p><p className="flex items-start gap-2"><Trophy className="mt-0.5 shrink-0 text-amber-300" size={17} />{selectedTournament.level} Level</p><p className="flex items-start gap-2"><Users className="mt-0.5 shrink-0 text-emerald-400" size={17} />U{selectedTournament.ageCategory}</p></div></> : <p className="py-4 text-center text-sm text-slate-500 sm:py-8">Select a tournament to view its details.</p>}
        </div>
      </section>

      <section aria-labelledby="entry-filters" className="mb-6 min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
        <h2 id="entry-filters" className="mb-4 flex items-center gap-2 font-semibold"><Filter size={18} className="text-blue-400" />2. Filter Eligible Players</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="min-w-0"><label htmlFor="player-search" className="mb-1.5 block text-sm text-slate-300">Search player</label><div className="relative"><Search className="absolute left-3 top-3 text-slate-500" size={18} /><input id="player-search" type="search" placeholder="Search Player..." value={search} onChange={(e) => setSearch(e.target.value)} className="min-h-11 w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500" /></div></div>
          <div><label htmlFor="gender-filter" className="mb-1.5 block text-sm text-slate-300">Gender</label><select id="gender-filter" value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} className="min-h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"><option>All</option><option>Male</option><option>Female</option></select></div>
          <div className="sm:col-span-2 lg:col-span-1"><label htmlFor="event-filter" className="mb-1.5 block text-sm text-slate-300">Event</label><select id="event-filter" value={eventFilter} onChange={(e) => setEventFilter(e.target.value)} className="min-h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"><option>All</option><option>Epee</option><option>Foil</option><option>Sabre</option></select></div>
        </div>
      </section>

      <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
        {!selectedTournament ? <EmptyState icon={Trophy} title="No Tournament Selected" message="Please select a tournament to view eligible players." /> : filteredPlayers.length === 0 ? <EmptyState icon={Users} title="No Players Found" message="Try changing the filters or search." /> : <>
          <header className="flex min-w-0 items-center justify-between gap-3 border-b border-slate-800 px-4 py-4 sm:px-6"><div className="min-w-0"><h2 className="font-semibold sm:text-xl">3. Select Eligible Players</h2><p className="mt-1 text-xs text-slate-400 sm:text-sm">{filteredPlayers.length} found · {selectedPlayers.length} selected</p></div><button type="button" onClick={handleSelectAll} disabled={selectablePlayers.length === 0} className="min-h-11 shrink-0 rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold hover:bg-blue-500 disabled:opacity-50 sm:px-5">{selectedPlayers.length === selectablePlayers.length ? "Unselect All" : "Select All"}</button></header>
          <DesktopPlayers players={filteredPlayers} existingIds={existingPlayerIds} selectedIds={selectedPlayers} allSelected={allSelected} onSelect={handleSelectPlayer} onSelectAll={handleSelectAll} />
          <div className="space-y-3 p-3 md:hidden">{filteredPlayers.map((player) => <MobilePlayer key={player._id} player={player} registered={existingPlayerIds.includes(player._id)} selected={selectedPlayers.includes(player._id)} onSelect={handleSelectPlayer} />)}</div>
        </>}
      </section>

      {selectedTournament && <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6"><div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div className="min-w-0"><h2 className="text-xl font-semibold">4. Review Selection</h2><p className="mt-1 text-sm text-slate-400">{selectedPlayers.length} selected · {existingPlayerIds.length} already registered · {filteredPlayers.length} eligible</p></div><button type="button" onClick={handleCreateEntry} disabled={loading || selectedPlayers.length === 0} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto lg:min-w-64">{loading ? <><Loader2 className="animate-spin" size={20} />Creating Entries...</> : <><UserCheck size={20} />Create {selectedPlayers.length} Entr{selectedPlayers.length === 1 ? "y" : "ies"}</>}</button></div></section>}

      {selectedTournament && <ExistingEntries tournament={selectedTournament} entries={existingEntries} visibleEntries={visibleExistingEntries} gender={entryGender} search={search} loading={loadingEntries} exporting={exporting} setGender={setEntryGender} setSearch={setSearch} onExport={handleExport} />}

      {loading && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" role="status" aria-live="polite"><div className="flex w-full max-w-sm flex-col items-center rounded-2xl border border-slate-700 bg-slate-900 p-6 text-center shadow-2xl"><Loader2 size={48} className="animate-spin text-blue-500" /><h2 className="mt-5 text-xl font-semibold">Creating Tournament Entries</h2><p className="mt-2 text-sm text-slate-400">Please wait while player entries are being created...</p></div></div>}
    </main>
  );
};

const EmptyState = ({ icon, title, message }) => <div className="flex flex-col items-center px-4 py-14 text-center sm:py-20">{createElement(icon, { size: 52, className: "mb-4 text-slate-700" })}<h2 className="text-xl font-semibold">{title}</h2><p className="mt-2 max-w-md text-sm text-slate-500">{message}</p></div>;

const DesktopPlayers = ({ players, existingIds, selectedIds, allSelected, onSelect, onSelectAll }) => <div className="hidden max-h-[650px] overflow-auto md:block"><table className="w-full min-w-[850px] text-sm"><thead className="sticky top-0 z-20 border-b border-slate-800 bg-slate-900"><tr><th className="px-5 py-4 text-left"><input type="checkbox" aria-label="Select all available filtered players" checked={allSelected} onChange={onSelectAll} /></th>{["Player", "Gender", "Event", "Age", "Status", "FAI ID", "MFA ID"].map((heading) => <th key={heading} className="px-5 py-4 text-left">{heading}</th>)}</tr></thead><tbody>{players.map((player) => { const registered = existingIds.includes(player._id); return <tr key={player._id} className={`border-b border-slate-800 ${registered ? "opacity-60" : "hover:bg-slate-800/60"}`}><td className="px-5 py-4"><input type="checkbox" aria-label={`${registered ? "Already registered: " : "Select "}${player.fullName}`} disabled={registered} checked={selectedIds.includes(player._id)} onChange={() => onSelect(player._id)} /></td><td className="max-w-64 px-5 py-4"><p className="break-words font-medium">{player.fullName}</p><p className="break-all text-xs text-slate-500">{player.email}</p></td><td className="px-5 py-4">{player.gender}</td><td className="px-5 py-4 text-purple-300">{player.event}</td><td className="px-5 py-4">{calculateAge(player.dob)}</td><td className="px-5 py-4"><span className={registered ? "text-red-300" : "text-green-300"}>{registered ? "Registered" : "Available"}</span></td><td className="px-5 py-4 font-mono text-cyan-300">{player.faiId}</td><td className="px-5 py-4 font-mono text-amber-300">{player.mfaId}</td></tr>; })}</tbody></table></div>;

const MobilePlayer = ({ player, registered, selected, onSelect }) => <article className={`min-w-0 rounded-xl border p-4 ${registered ? "border-slate-700 bg-slate-950/60 opacity-75" : selected ? "border-blue-400 bg-blue-500/10 ring-1 ring-blue-400/40" : "border-slate-700 bg-slate-950/40"}`}><label className={`flex min-w-0 items-start gap-3 ${registered ? "cursor-not-allowed" : "cursor-pointer"}`}><input type="checkbox" aria-label={`${registered ? "Already registered: " : "Select "}${player.fullName}`} disabled={registered} checked={selected} onChange={() => onSelect(player._id)} className="mt-1 h-5 w-5 shrink-0 accent-blue-500" /><span className="min-w-0 flex-1"><span className="block break-words font-semibold leading-snug">{player.fullName}</span><span className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${registered ? "bg-red-500/20 text-red-300" : selected ? "bg-blue-500/20 text-blue-200" : "bg-green-500/20 text-green-300"}`}>{selected && !registered && <Check size={13} />}{registered ? "Already Registered" : selected ? "Selected" : "Available"}</span></span></label><dl className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-800 pt-3 text-sm">{[["Event", player.event], ["Gender", player.gender], ["Age", calculateAge(player.dob)], ["DOB", formatDate(player.dob)], ["FAI ID", player.faiId || "—"], ["MFA ID", player.mfaId || "—"]].map(([label, value]) => <div key={label} className="min-w-0"><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-0.5 break-all text-slate-200">{value}</dd></div>)}</dl></article>;

const ExistingEntries = ({ tournament, entries, visibleEntries, gender, search, loading, exporting, setGender, setSearch, onExport }) => <section className="mt-6 min-w-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"><header className="border-b border-slate-800 px-4 py-4 sm:px-6"><h2 className="break-words text-xl font-semibold">5. Existing Tournament Entries</h2><div className="mt-2 grid gap-1 text-sm text-slate-400 sm:grid-cols-2"><p className="break-words"><span className="font-medium text-slate-300">Tournament:</span> {tournament.title}</p><p><span className="font-medium text-slate-300">Total {gender === "Male" ? "boys" : "girls"} entries:</span> {entries.filter((entry) => entry.playerId.gender === gender).length}</p></div></header><div className="grid grid-cols-1 gap-3 border-b border-slate-800 p-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-end sm:px-6"><div><label htmlFor="entry-gender" className="mb-1.5 block text-sm text-slate-300">Entry group</label><select id="entry-gender" value={gender} onChange={(e) => setGender(e.target.value)} className="min-h-11 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 sm:w-auto"><option value="Male">Boys</option><option value="Female">Girls</option></select></div><div className="min-w-0"><label htmlFor="registered-search" className="mb-1.5 block text-sm text-slate-300">Search registered player</label><div className="relative"><Search size={18} className="absolute left-3 top-3 text-slate-500" /><input id="registered-search" type="search" placeholder="Search registered player..." value={search} onChange={(e) => setSearch(e.target.value)} className="min-h-11 w-full rounded-lg border border-slate-700 bg-slate-800 py-2.5 pl-10 pr-3" /></div></div><button type="button" onClick={onExport} disabled={exporting} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold hover:bg-emerald-500 disabled:opacity-60 sm:w-auto">{exporting && <Loader2 size={18} className="animate-spin" />}{exporting ? "Generating..." : "Export Excel"}</button></div>{loading ? <div className="flex items-center justify-center py-16"><Loader2 size={34} className="animate-spin text-blue-500" /><span className="sr-only">Loading existing entries</span></div> : <><div className="hidden max-h-[650px] overflow-auto md:block"><table className="w-full min-w-[760px] text-sm"><thead className="sticky top-0 z-20 bg-slate-950"><tr>{["Sr", "Player Name", "Event", "DOB", "Phone", "Institute"].map((h) => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr></thead><tbody>{visibleEntries.map((entry, index) => { const player = entry.playerId; return <tr key={entry._id} className="border-b border-slate-800 hover:bg-slate-800/40"><td className="px-4 py-2.5">{index + 1}</td><td className="max-w-64 break-words px-4 py-2.5">{player.fullName}</td><td className="px-4 py-2.5 text-purple-300">{player.event}</td><td className="px-4 py-2.5">{formatDate(player.dob)}</td><td className="px-4 py-2.5">{player.phone}</td><td className="max-w-72 break-words px-4 py-2.5">{player.institute}</td></tr>; })}{visibleEntries.length === 0 && <tr><td colSpan={6} className="py-12 text-center text-slate-500">No {gender === "Male" ? "boys" : "girls"} entries found.</td></tr>}</tbody></table></div><div className="space-y-3 p-3 md:hidden">{visibleEntries.map((entry, index) => { const player = entry.playerId; return <article key={entry._id} className="min-w-0 rounded-xl border border-slate-700 bg-slate-950/40 p-4"><div className="flex min-w-0 items-start justify-between gap-3"><div className="min-w-0"><p className="text-xs text-slate-500">Entry {index + 1}</p><h3 className="mt-1 break-words font-semibold">{player.fullName}</h3></div><span className="shrink-0 rounded-full bg-purple-500/20 px-2.5 py-1 text-xs text-purple-300">{player.event}</span></div><dl className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-800 pt-3 text-sm"><div><dt className="text-xs text-slate-500">DOB</dt><dd>{formatDate(player.dob)}</dd></div><div><dt className="text-xs text-slate-500">Phone</dt><dd className="break-all">{player.phone || "—"}</dd></div><div className="col-span-2"><dt className="text-xs text-slate-500">Institute</dt><dd className="break-words">{player.institute || "—"}</dd></div></dl></article>; })}{visibleEntries.length === 0 && <div className="px-4 py-10 text-center text-sm text-slate-500">No {gender === "Male" ? "boys" : "girls"} entries found.</div>}</div></>}</section>;

export default TournamentEntry;
