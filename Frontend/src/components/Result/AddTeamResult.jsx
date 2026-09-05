import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Check, ChevronRight, Loader2, Medal, Trophy, UserPlus, Users, X } from "lucide-react";
import { api } from "../api";

const PLACES = ["First", "Second", "Third"];
const PLACE_LABELS = { First: "Gold", Second: "Silver", Third: "Bronze" };
const EVENT_STYLES = { Epee: "text-amber-300", Foil: "text-blue-400", Sabre: "text-red-400" };

const AddTeamResult = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState("");
  const [teamGroups, setTeamGroups] = useState({});
  const [results, setResults] = useState({});
  const [externalPlayers, setExternalPlayers] = useState({});
  const [selectedPlace, setSelectedPlace] = useState({});
  const [expandedRow, setExpandedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savingRow, setSavingRow] = useState(null);
  const [rowErrors, setRowErrors] = useState({});
  const [rowSuccess, setRowSuccess] = useState({});

  const fetchTournaments = async () => {
    try {
      const res = await api.get("/tournament?type=completed");
      setTournaments(res.data.data);
    } catch (err) { console.error("Tournament Fetch Error:", err); }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleTournamentChange = async (tournamentId) => {
    if (!tournamentId) return;
    setSelectedTournament(tournamentId);
    setExpandedRow(null); setSavingRow(null); setExternalPlayers({}); setSelectedPlace({});
    setRowErrors({}); setRowSuccess({}); setTeamGroups({}); setResults({});
    try {
      setLoading(true);
      const entryRes = await api.get(`/tournament/entry/${tournamentId}`);
      const grouped = {};
      entryRes.data.data.forEach((entry) => {
        const player = entry.playerId;
        const category = `${player.gender}_${player.event}`;
        if (!grouped[category]) grouped[category] = [];
        grouped[category].push({
          _id: player._id, entryId: entry._id, name: player.fullName,
          gender: player.gender, event: player.event,
        });
      });
      setTeamGroups(grouped);
      const resultRes = await api.get(`/result/team/${tournamentId}`);
      const formatted = {};
      resultRes.data.data.forEach((result) => {
        if (!formatted[result.category]) formatted[result.category] = {};
        formatted[result.category][result.place] = result;
      });
      setResults(formatted);
    } catch (err) { console.error("Tournament Load Error:", err); }
    finally { setLoading(false); }
  };

  const getTeamSize = (category) => (teamGroups[category] || []).length + (externalPlayers[category] || []).length;
  const addExternalPlayer = (category, name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const alreadyExists = (externalPlayers[category] || []).some(
      (player) => player.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (alreadyExists) {
      setRowErrors((prev) => ({ ...prev, [category]: "Player already added." }));
      return;
    }
    if (getTeamSize(category) >= 4) {
      setRowErrors((prev) => ({ ...prev, [category]: "Maximum 4 players allowed." }));
      return;
    }
    setExternalPlayers((prev) => ({
      ...prev,
      [category]: [...(prev[category] || []), { id: Date.now(), name: trimmed }],
    }));
    setRowErrors((prev) => ({ ...prev, [category]: "" }));
  };
  const removeExternalPlayer = (category, id) => {
    setExternalPlayers((prev) => ({
      ...prev, [category]: (prev[category] || []).filter((player) => player.id !== id),
    }));
    setRowErrors((prev) => ({ ...prev, [category]: "" }));
  };
  const validateTeam = (category) => {
    const total = (teamGroups[category] || []).length + (externalPlayers[category] || []).length;
    if (total < 3) return { valid: false, message: "Minimum 3 players required." };
    if (total > 4) return { valid: false, message: "Maximum 4 players allowed." };
    return { valid: true, message: "Team is ready." };
  };

  const saveResult = async (category) => {
    const validation = validateTeam(category);
    if (!validation.valid) {
      setRowErrors((prev) => ({ ...prev, [category]: validation.message }));
      return;
    }
    if (!selectedPlace[category]) {
      setRowErrors((prev) => ({ ...prev, [category]: "Please select a position." }));
      return;
    }
    const existing = results[category] || {};
    if (existing.First || existing.Second || existing.Third) {
      setRowErrors((prev) => ({ ...prev, [category]: "Result already declared." }));
      return;
    }
    try {
      setSavingRow(category);
      setRowErrors((prev) => ({ ...prev, [category]: "" }));
      const registeredPlayers = (teamGroups[category] || []).map((player) => ({
        playerId: player._id, entryId: player.entryId, name: player.name,
      }));
      const outsidePlayers = (externalPlayers[category] || []).map((player) => ({
        playerId: null, entryId: null, name: player.name,
      }));
      await api.post("/result/team", {
        tournamentId: selectedTournament,
        category,
        place: selectedPlace[category],
        players: [...registeredPlayers, ...outsidePlayers],
      });
      await handleTournamentChange(selectedTournament);
      setExpandedRow(category);
      setRowSuccess((prev) => ({ ...prev, [category]: "Result saved successfully." }));
    } catch (err) {
      console.error(err);
      setRowErrors((prev) => ({
        ...prev, [category]: err.response?.data?.message || "Unable to save result.",
      }));
    } finally { setSavingRow(null); }
  };

  const categories = useMemo(() => Object.keys(teamGroups).sort((a, b) => {
    const [genderA, eventA] = a.split("_");
    const [genderB, eventB] = b.split("_");
    return eventA === eventB ? genderA.localeCompare(genderB) : eventA.localeCompare(eventB);
  }), [teamGroups]);
  const selectedTournamentData = useMemo(
    () => tournaments.find((tournament) => tournament._id === selectedTournament),
    [tournaments, selectedTournament],
  );
  const toggleCategory = (category) => setExpandedRow((current) => current === category ? null : category);
  const sharedEditorProps = {
    teamGroups, results, externalPlayers, selectedPlace, savingRow, rowErrors, rowSuccess,
    getTeamSize, validateTeam, addExternalPlayer, removeExternalPlayer, saveResult, setSelectedPlace,
  };

  return (
    <main className="min-h-screen min-w-0 bg-slate-950 px-3 py-4 text-white sm:px-5 sm:py-6 lg:p-8">
      <div className="mx-auto min-w-0 max-w-7xl">
        <header className="mb-6 flex min-w-0 flex-col gap-5 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex min-w-0 items-start gap-3 sm:items-center"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 sm:h-14 sm:w-14"><Users size={28} /></span><div className="min-w-0"><h1 className="break-words text-2xl font-bold sm:text-3xl">Team Result Management</h1><p className="mt-1 text-sm text-slate-400 sm:text-base">Select a completed tournament and declare team results.</p></div></div>
          <div className="min-w-0 lg:w-96"><label htmlFor="team-tournament" className="mb-1.5 block text-sm font-medium text-slate-300">Completed Tournament</label><select id="team-tournament" value={selectedTournament} onChange={(event) => handleTournamentChange(event.target.value)} className="min-h-12 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"><option value="">Select Tournament</option>{tournaments.map((tournament) => <option key={tournament._id} value={tournament._id}>{tournament.title}</option>)}</select></div>
        </header>

        {selectedTournamentData && <section className="mb-5 min-w-0 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3"><p className="text-xs font-semibold uppercase tracking-wide text-blue-300">Selected tournament</p><p className="mt-1 break-words font-semibold">{selectedTournamentData.title}</p></section>}
        {!selectedTournament && <EmptyState icon={<Trophy size={46} />} title={tournaments.length === 0 ? "No Completed Tournaments" : "No Tournament Selected"} message={tournaments.length === 0 ? "Completed tournaments will appear here when available." : "Select a completed tournament above to view participating teams."} />}
        {selectedTournament && loading && <LoadingState />}
        {selectedTournament && !loading && categories.length === 0 && <EmptyState icon={<Users size={46} />} title="No Team Entries Found" message="No registered team entries are available for this tournament." />}

        {!loading && categories.length > 0 && <>
          <DesktopTeamResults categories={categories} expandedRow={expandedRow} onToggle={toggleCategory} {...sharedEditorProps} />
          <MobileTeamResults categories={categories} expandedRow={expandedRow} onToggle={toggleCategory} {...sharedEditorProps} />
        </>}
      </div>
    </main>
  );
};

const EmptyState = ({ icon, title, message }) => <section className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 px-4 py-12 text-center sm:p-14"><span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-slate-500">{icon}</span><h2 className="text-xl font-semibold">{title}</h2><p className="mx-auto mt-2 max-w-lg text-sm text-slate-400">{message}</p></section>;
const LoadingState = () => <div className="space-y-3" role="status" aria-label="Loading team results">{[1, 2, 3, 4, 5].map((item) => <div key={item} className="h-20 animate-pulse rounded-xl border border-slate-800 bg-slate-900" />)}</div>;
const getSavedResult = (results, category) => {
  const existing = results[category] || {};
  return existing.First || existing.Second || existing.Third || null;
};
const StatusBadge = ({ result }) => result ? <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-700 bg-emerald-600/20 px-3 py-1 text-xs font-semibold text-emerald-300"><Check size={14} />Submitted · {PLACE_LABELS[result.place] || result.place}</span> : <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-700 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300"><AlertTriangle size={14} />Pending</span>;

const TeamEditor = ({ category, teamGroups, results, externalPlayers, selectedPlace, savingRow, rowErrors, rowSuccess, getTeamSize, validateTeam, addExternalPlayer, removeExternalPlayer, saveResult, setSelectedPlace }) => {
  const players = teamGroups[category] || [];
  const outsidePlayers = externalPlayers[category] || [];
  const validation = validateTeam(category);
  const savedResult = getSavedResult(results, category);
  return <div className="min-w-0">
    {rowErrors[category] && <div role="alert" className="mb-4 flex items-start gap-2 rounded-lg border border-red-500 bg-red-600/20 px-4 py-3 text-sm text-red-300"><AlertTriangle size={18} className="mt-0.5 shrink-0" /><span className="break-words">{rowErrors[category]}</span></div>}
    {rowSuccess[category] && <div className="mb-4 flex items-start gap-2 rounded-lg border border-emerald-500 bg-emerald-600/20 px-4 py-3 text-sm text-emerald-300"><Check size={18} className="mt-0.5 shrink-0" /><span className="break-words">{rowSuccess[category]}</span></div>}
    <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
      <div className="min-w-0"><h3 className="text-lg font-semibold text-blue-300">Registered Players</h3><ol className="mt-3 space-y-2">{players.map((player, index) => <li key={player._id} className="flex min-w-0 items-start gap-3 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-xs font-bold text-blue-300">{index + 1}</span><span className="min-w-0 break-words text-sm">{player.name}</span></li>)}</ol>
        <div className="mt-6"><h3 className="text-lg font-semibold text-blue-300">External Players</h3>{outsidePlayers.length === 0 && <p className="mt-2 text-sm text-slate-500">No external players added.</p>}<ul className="mt-3 space-y-2">{outsidePlayers.map((player) => <li key={player.id} className="flex min-w-0 items-center gap-3 rounded-lg border border-blue-500/30 bg-blue-600/10 px-3 py-2.5"><span className="min-w-0 flex-1 break-words text-sm">{player.name}</span><button type="button" disabled={savingRow === category} onClick={() => removeExternalPlayer(category, player.id)} aria-label={`Remove ${player.name}`} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-red-300 hover:bg-red-500/10 disabled:opacity-50"><X size={18} /></button></li>)}</ul>
          <div className="mt-3"><label htmlFor={`external-${category}`} className="mb-1.5 block text-sm font-medium text-slate-300">Add external player</label><input id={`external-${category}`} type="text" disabled={savingRow === category || getTeamSize(category) >= 4} placeholder={getTeamSize(category) >= 4 ? "Maximum team size reached" : "Type player name and press Enter"} onKeyDown={(event) => { if (event.key === "Enter" && event.currentTarget.value.trim()) { addExternalPlayer(category, event.currentTarget.value); event.currentTarget.value = ""; } }} className="min-h-11 w-full min-w-0 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50" /></div>
        </div>
      </div>
      <div className="min-w-0"><section className="rounded-xl border border-slate-700 bg-slate-900 p-4"><h3 className="font-semibold text-blue-300">Team Summary</h3><dl className="mt-4 grid grid-cols-3 gap-2"><Summary label="Registered" value={players.length} /><Summary label="External" value={outsidePlayers.length} /><Summary label="Total" value={getTeamSize(category)} /></dl><p className={`mt-4 flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm ${validation.valid ? "border-emerald-600 bg-emerald-600/10 text-emerald-300" : "border-red-600 bg-red-600/10 text-red-300"}`}>{validation.valid ? <Check size={17} className="mt-0.5 shrink-0" /> : <AlertTriangle size={17} className="mt-0.5 shrink-0" />}<span>{validation.message}</span></p></section>
        <fieldset className="mt-6"><legend className="mb-3 font-semibold text-blue-300">Select Position</legend><div className="grid grid-cols-1 gap-2 sm:grid-cols-3">{PLACES.map((place) => <label key={place} className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 sm:justify-center ${selectedPlace[category] === place ? "border-blue-500 bg-blue-600/20" : "border-slate-700 bg-slate-900 hover:border-blue-500"}`}><input type="radio" name={`place-${category}`} disabled={savingRow === category} checked={selectedPlace[category] === place} onChange={() => setSelectedPlace((prev) => ({ ...prev, [category]: place }))} className="h-4 w-4 accent-blue-500" /><span className="font-medium">{PLACE_LABELS[place]} · {place}</span></label>)}</div></fieldset>
        <div className="mt-6 border-t border-slate-700 pt-5">{savedResult ? <div className="rounded-xl border border-emerald-500 bg-emerald-600/20 p-4"><div className="flex items-start gap-3"><Medal className="shrink-0 text-emerald-300" size={25} /><div className="min-w-0"><h3 className="font-semibold text-emerald-300">Result Already Declared</h3><p className="mt-1 text-sm text-emerald-200">Saved place: {PLACE_LABELS[savedResult.place] || savedResult.place} ({savedResult.place}). Another result cannot be submitted for this category.</p></div></div></div> : <div><p className={`mb-4 text-sm font-medium ${validation.valid ? "text-emerald-300" : "text-red-300"}`}>{validation.valid ? "Team is ready for submission." : validation.message}</p><button type="button" onClick={() => saveResult(category)} disabled={savingRow === category || !validation.valid || !selectedPlace[category]} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400">{savingRow === category ? <><Loader2 size={18} className="animate-spin" />Saving...</> : "Save Team Result"}</button></div>}</div>
      </div>
    </div>
  </div>;
};
const Summary = ({ label, value }) => <div className="min-w-0 rounded-lg bg-slate-800 p-2 text-center sm:p-3"><dt className="break-words text-[10px] uppercase tracking-wide text-slate-400 sm:text-xs">{label}</dt><dd className="mt-1 text-2xl font-bold text-blue-300">{value}</dd></div>;

const DesktopTeamResults = ({ categories, expandedRow, onToggle, teamGroups, results, externalPlayers, selectedPlace, savingRow, rowErrors, rowSuccess, getTeamSize, validateTeam, addExternalPlayer, removeExternalPlayer, saveResult, setSelectedPlace }) => <section className="hidden min-w-0 overflow-hidden rounded-2xl border border-slate-700 md:block"><div className="overflow-x-auto"><div className="min-w-[820px]"><div className="grid grid-cols-12 bg-slate-800 px-6 py-4 text-sm font-semibold uppercase tracking-wide text-blue-300"><div className="col-span-1" /><div className="col-span-3">Category</div><div className="col-span-2">Registered</div><div className="col-span-2">Team Size</div><div className="col-span-2">Status</div><div className="col-span-2 text-right">Action</div></div>{categories.map((category) => { const players = teamGroups[category] || []; const validation = validateTeam(category); const expanded = expandedRow === category; const result = getSavedResult(results, category); const [gender, event] = category.split("_"); return <article key={category} className={`border-t border-slate-700 ${expanded ? "bg-blue-950/20" : "bg-slate-900"}`}><button type="button" aria-expanded={expanded} onClick={() => onToggle(category)} className="grid w-full grid-cols-12 items-center px-6 py-5 text-left hover:bg-slate-800/60"><span className="col-span-1"><ChevronRight className={`transition-transform ${expanded ? "rotate-90" : ""}`} size={19} /></span><span className="col-span-3"><span className={`block text-lg font-semibold ${EVENT_STYLES[event] || "text-blue-300"}`}>{event}</span><span className="text-sm text-slate-400">{gender}</span></span><span className="col-span-2"><span className="rounded-full bg-slate-700 px-3 py-1 text-sm">{players.length} Registered</span></span><span className="col-span-2"><span className={`rounded-full px-3 py-1 text-sm ${validation.valid ? "bg-emerald-600/20 text-emerald-300" : "bg-red-600/20 text-red-300"}`}>{getTeamSize(category)}/4</span></span><span className="col-span-2"><StatusBadge result={result} /></span><span className="col-span-2 text-right"><span className="inline-flex min-h-10 items-center rounded-lg border border-slate-600 px-4 py-2 text-sm">{expanded ? "Collapse" : "Expand"}</span></span></button>{expanded && <div className="border-t border-slate-700 bg-slate-800/40 p-6"><TeamEditor category={category} teamGroups={teamGroups} results={results} externalPlayers={externalPlayers} selectedPlace={selectedPlace} savingRow={savingRow} rowErrors={rowErrors} rowSuccess={rowSuccess} getTeamSize={getTeamSize} validateTeam={validateTeam} addExternalPlayer={addExternalPlayer} removeExternalPlayer={removeExternalPlayer} saveResult={saveResult} setSelectedPlace={setSelectedPlace} /></div>}</article>; })}</div></div></section>;

const MobileTeamResults = ({ categories, expandedRow, onToggle, teamGroups, results, externalPlayers, selectedPlace, savingRow, rowErrors, rowSuccess, getTeamSize, validateTeam, addExternalPlayer, removeExternalPlayer, saveResult, setSelectedPlace }) => <div className="space-y-4 md:hidden">{categories.map((category) => { const players = teamGroups[category] || []; const validation = validateTeam(category); const expanded = expandedRow === category; const result = getSavedResult(results, category); const [gender, event] = category.split("_"); return <article key={category} className={`min-w-0 overflow-hidden rounded-2xl border ${expanded ? "border-blue-700 bg-blue-950/20" : "border-slate-700 bg-slate-900"}`}><div className="p-4"><div className="flex min-w-0 items-start justify-between gap-3"><div className="min-w-0"><p className={`break-words text-lg font-semibold ${EVENT_STYLES[event] || "text-blue-300"}`}>{event} · {gender}</p><p className="mt-1 text-sm text-slate-400">{players.length} registered · Team size {getTeamSize(category)}/4</p></div><StatusBadge result={result} /></div><p className={`mt-3 text-sm ${validation.valid ? "text-emerald-300" : "text-red-300"}`}>{validation.message}</p><button type="button" aria-expanded={expanded} onClick={() => onToggle(category)} className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-2.5 font-semibold text-blue-200"><ChevronRight className={`transition-transform ${expanded ? "rotate-90" : ""}`} size={18} />{expanded ? "Close Team Editor" : "Manage Team Result"}</button></div>{expanded && <div className="border-t border-slate-700 bg-slate-800/30 p-4"><TeamEditor category={category} teamGroups={teamGroups} results={results} externalPlayers={externalPlayers} selectedPlace={selectedPlace} savingRow={savingRow} rowErrors={rowErrors} rowSuccess={rowSuccess} getTeamSize={getTeamSize} validateTeam={validateTeam} addExternalPlayer={addExternalPlayer} removeExternalPlayer={removeExternalPlayer} saveResult={saveResult} setSelectedPlace={setSelectedPlace} /></div>}</article>; })}</div>;

export default AddTeamResult;
