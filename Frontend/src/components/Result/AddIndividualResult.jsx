import { Fragment, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Check, ChevronRight, ClipboardList, Loader2, Medal, Trophy, X } from "lucide-react";
import { api } from "../api";

const PLACES = ["First", "Second", "Third"];
const MEDAL_LABELS = { First: "Gold — First", Second: "Silver — Second", Third: "Bronze — Third" };

const AddIndividualResult = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState("");
  const [entries, setEntries] = useState([]);
  const [existingResults, setExistingResults] = useState([]);
  const [selectedResults, setSelectedResults] = useState({});
  const [expandedRows, setExpandedRows] = useState({});
  const [loadingTournaments, setLoadingTournaments] = useState(true);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [savingRow, setSavingRow] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, severity: "success", message: "" });

  const fetchCompletedTournaments = async () => {
    try {
      setLoadingTournaments(true);
      const res = await api.get("/tournament?type=completed");
      setTournaments(res.data.data || []);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, severity: "error", message: "Unable to load tournaments." });
    } finally { setLoadingTournaments(false); }
  };

  useEffect(() => {
    // Initial remote data load; state updates occur after the request resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCompletedTournaments();
  }, []);

  const handleTournamentChange = async (tournamentId) => {
    setSelectedTournament(tournamentId);
    if (!tournamentId) {
      setEntries([]); setExistingResults([]); setSelectedResults({}); setExpandedRows({});
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
          place: result.place, category: result.category, submitted: true,
        };
      });
      setSelectedResults(existingMap);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, severity: "error", message: "Unable to load tournament data." });
    } finally { setLoadingEntries(false); }
  };

  const groupedEntries = useMemo(() => {
    const grouped = {};
    entries.forEach((entry) => {
      if (!entry.playerId) return;
      const player = entry.playerId;
      const category = `${player.gender}_${player.event}`;
      if (!grouped[category]) grouped[category] = [];
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
  const categories = useMemo(() => Object.keys(groupedEntries).sort(), [groupedEntries]);
  const selectedTournamentData = useMemo(
    () => tournaments.find((tournament) => tournament._id === selectedTournament),
    [tournaments, selectedTournament],
  );

  const toggleRow = (entryId) => setExpandedRows((prev) => ({ ...prev, [entryId]: !prev[entryId] }));
  const handlePlaceChange = (entryId, place) => setSelectedResults((prev) => ({
    ...prev, [entryId]: { ...(prev[entryId] || {}), place, submitted: false },
  }));

  const handleSave = async (player) => {
    const selectedPlace = selectedResults[player.entryId]?.place;
    if (!selectedPlace) {
      setSnackbar({ open: true, severity: "warning", message: "Please select a medal position." });
      return;
    }
    const category = `${player.gender}_${player.event}`;
    const duplicate = entries.find((entry) => {
      if (entry._id === player.entryId) return false;
      if (entry.playerId.gender !== player.gender || entry.playerId.event !== player.event) return false;
      const assigned = selectedResults[entry._id];
      if (!assigned) return false;
      return assigned.place === selectedPlace;
    });
    if (duplicate) {
      setSnackbar({ open: true, severity: "warning", message: `${selectedPlace} has already been assigned in this category.` });
      return;
    }
    try {
      setSavingRow(player.entryId);
      await api.post("/result/individual", [{
        tournamentId: selectedTournament,
        tournamentEntryId: player.entryId,
        playerId: player.playerId,
        category,
        place: selectedPlace,
      }]);
      const openedRows = { ...expandedRows };
      await handleTournamentChange(selectedTournament);
      setExpandedRows(openedRows);
      setSnackbar({ open: true, severity: "success", message: `${player.name}'s result saved successfully.` });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, severity: "error", message: err.response?.data?.message || "Failed to save individual result." });
    } finally { setSavingRow(""); }
  };

  const closeSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));
  const isPlaceTaken = (currentPlayer, place) => entries.some((entry) => {
    if (entry._id === currentPlayer.entryId) return false;
    if (entry.playerId.gender !== currentPlayer.gender || entry.playerId.event !== currentPlayer.event) return false;
    return selectedResults[entry._id]?.place === place;
  });

  const editorProps = { selectedResults, savingRow, places: PLACES, onPlaceChange: handlePlaceChange, onSave: handleSave, isPlaceTaken };

  return (
    <main className="min-h-screen min-w-0 bg-slate-950 px-3 py-4 text-white sm:px-5 sm:py-6 lg:p-8">
      <div className="mx-auto min-w-0 max-w-6xl">
        <header className="mb-6 flex min-w-0 items-start gap-3 sm:mb-8 sm:items-center">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 sm:h-14 sm:w-14"><Medal size={28} /></span>
          <div className="min-w-0"><h1 className="break-words text-2xl font-bold sm:text-3xl">Individual Results</h1><p className="mt-1 text-sm text-slate-400 sm:text-base">Declare results only for players who participated in the selected tournament.</p></div>
        </header>

        <section className="mb-6 min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:mb-8 sm:p-6">
          <label htmlFor="completed-tournament" className="mb-2 block text-sm font-medium text-slate-300">Completed Tournament</label>
          <select id="completed-tournament" value={selectedTournament} disabled={loadingTournaments} onChange={(event) => handleTournamentChange(event.target.value)} className="min-h-12 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 disabled:opacity-60 md:max-w-[500px]"><option value="">{loadingTournaments ? "Loading tournaments..." : "Select Tournament"}</option>{tournaments.map((tournament) => <option key={tournament._id} value={tournament._id}>{tournament.title}</option>)}</select>
          {!loadingTournaments && tournaments.length === 0 && <p className="mt-3 text-sm text-slate-400">No completed tournaments are available.</p>}
          {selectedTournamentData && <div className="mt-4 min-w-0 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3"><p className="text-xs font-semibold uppercase tracking-wide text-blue-300">Selected tournament</p><p className="mt-1 break-words font-semibold text-slate-100">{selectedTournamentData.title}</p></div>}
        </section>

        {!selectedTournament && !loadingTournaments && <EmptyState icon={<Trophy size={48} />} title={tournaments.length === 0 ? "No Completed Tournaments" : "Select a Tournament"} message={tournaments.length === 0 ? "Completed tournaments will appear here when available." : "Tournament entries will appear here once a completed tournament is selected."} />}
        {selectedTournament && loadingEntries && <LoadingGroups />}
        {selectedTournament && !loadingEntries && categories.length === 0 && <EmptyState icon={<ClipboardList size={48} />} title="No Tournament Entries" message="No players have registered for this tournament." />}

        {selectedTournament && !loadingEntries && categories.length > 0 && <div className="space-y-5">{categories.map((category) => {
          const categoryPlayers = groupedEntries[category];
          const [gender, event] = category.split("_");
          const submittedCount = categoryPlayers.filter((player) => player.submitted).length;
          return <section key={category} className="min-w-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <header className="flex min-w-0 items-start justify-between gap-3 border-b border-slate-800 px-4 py-4 sm:items-center sm:px-6"><div className="min-w-0"><h2 className="break-words text-lg font-semibold text-blue-300 sm:text-xl">{event} {gender}</h2><p className="mt-1 text-sm text-slate-400">{categoryPlayers.length} Participant{categoryPlayers.length !== 1 ? "s" : ""} · {submittedCount} Submitted</p></div><span className="shrink-0 rounded-full border border-blue-700 bg-blue-600/20 px-3 py-1 text-xs font-semibold text-blue-300">{categoryPlayers.length}</span></header>
            <DesktopCategory players={categoryPlayers} expandedRows={expandedRows} onToggle={toggleRow} editorProps={editorProps} />
            <MobileCategory players={categoryPlayers} expandedRows={expandedRows} onToggle={toggleRow} editorProps={editorProps} />
          </section>;
        })}</div>}
      </div>

      <Snackbar snackbar={snackbar} onClose={closeSnackbar} />
      <span className="sr-only">{existingResults.length} existing individual results loaded</span>
    </main>
  );
};

const EmptyState = ({ icon, title, message }) => <section className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 px-4 py-12 text-center sm:p-14"><span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-slate-500">{icon}</span><h2 className="text-xl font-semibold sm:text-2xl">{title}</h2><p className="mx-auto mt-2 max-w-lg text-sm text-slate-400 sm:text-base">{message}</p></section>;
const LoadingGroups = () => <div className="space-y-4" role="status" aria-label="Loading tournament entries">{[1, 2, 3].map((item) => <div key={item} className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6"><div className="mb-5 h-5 w-2/3 max-w-60 rounded bg-slate-700" /><div className="space-y-3"><div className="h-12 rounded bg-slate-800" /><div className="h-12 rounded bg-slate-800" /><div className="h-12 rounded bg-slate-800" /></div></div>)}</div>;

const ResultEditor = ({ player, selectedResults, savingRow, places, onPlaceChange, onSave, isPlaceTaken }) => <div className="min-w-0"><div className="min-w-0"><h3 className="break-words font-semibold">Assign medal to {player.name}</h3><p className="mt-1 text-sm text-slate-400">Select the medal position and save the result.</p></div><div className="mt-4 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"><div className="min-w-0"><label htmlFor={`place-${player.entryId}`} className="mb-1.5 block text-sm font-medium text-slate-300">Medal position</label><select id={`place-${player.entryId}`} value={selectedResults[player.entryId]?.place || ""} disabled={savingRow === player.entryId} onChange={(event) => onPlaceChange(player.entryId, event.target.value)} className="min-h-11 w-full min-w-0 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 outline-none focus:border-blue-500 disabled:opacity-50"><option value="">Select Medal</option>{places.map((place) => { const disabled = isPlaceTaken(player, place) && selectedResults[player.entryId]?.place !== place; return <option key={place} value={place} disabled={disabled}>{MEDAL_LABELS[place]}{disabled ? " (Assigned)" : ""}</option>; })}</select></div><button type="button" onClick={() => onSave(player)} disabled={savingRow === player.entryId || !selectedResults[player.entryId]?.place} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-36">{savingRow === player.entryId ? <><Loader2 size={17} className="animate-spin" />Saving...</> : "Save Result"}</button></div></div>;

const StatusBadge = ({ submitted, place }) => submitted ? <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-700 bg-emerald-600/20 px-3 py-1 text-xs font-semibold text-emerald-300"><Check size={14} />Submitted{place ? ` · ${place}` : ""}</span> : <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-700 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300"><AlertTriangle size={14} />Pending</span>;

const DesktopCategory = ({ players, expandedRows, onToggle, editorProps }) => <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[680px]"><thead className="bg-slate-800/60"><tr><th className="w-20 px-6 py-4"><span className="sr-only">Expand</span></th><th className="px-6 py-4 text-left font-medium text-slate-300">Player</th><th className="px-6 py-4 text-left font-medium text-slate-300">Status</th><th className="px-6 py-4 text-right font-medium text-slate-300">Action</th></tr></thead><tbody>{players.map((player) => { const expanded = expandedRows[player.entryId]; return <Fragment key={player.entryId}><tr className="border-t border-slate-800 transition-colors hover:bg-slate-800/40"><td className="px-6 py-4"><button type="button" aria-label={`${expanded ? "Collapse" : "Expand"} result editor for ${player.name}`} aria-expanded={!!expanded} onClick={() => onToggle(player.entryId)} className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700"><ChevronRight className={`transition-transform ${expanded ? "rotate-90" : ""}`} size={18} /></button></td><td className="max-w-80 px-6 py-4"><p className="break-words font-medium">{player.name}</p><p className="mt-1 break-all text-xs text-slate-500">Entry: {player.entryId.slice(-8)}</p></td><td className="px-6 py-4"><StatusBadge submitted={player.submitted} place={player.place} /></td><td className="px-6 py-4 text-right"><button type="button" disabled={player.submitted} onClick={() => onToggle(player.entryId)} className="min-h-10 rounded-lg bg-blue-600 px-5 py-2 font-medium hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400">{player.submitted ? "Locked" : "Declare"}</button></td></tr>{expanded && !player.submitted && <tr className="border-t border-slate-800 bg-slate-950"><td colSpan={4} className="px-6 py-6"><ResultEditor player={player} {...editorProps} /></td></tr>}</Fragment>; })}</tbody></table></div>;

const MobileCategory = ({ players, expandedRows, onToggle, editorProps }) => <div className="space-y-3 p-3 md:hidden">{players.map((player) => { const expanded = expandedRows[player.entryId]; return <article key={player.entryId} className="min-w-0 rounded-xl border border-slate-700 bg-slate-950/40 p-4"><div className="flex min-w-0 items-start justify-between gap-3"><div className="min-w-0"><h3 className="break-words font-semibold leading-snug">{player.name}</h3><p className="mt-1 break-all text-xs text-slate-500">Entry: {player.entryId.slice(-8)}</p></div><StatusBadge submitted={player.submitted} place={player.place} /></div>{player.submitted ? <p className="mt-4 rounded-lg bg-slate-800 px-3 py-2 text-center text-sm font-medium text-slate-400">Result saved · Editing locked</p> : <button type="button" aria-expanded={!!expanded} onClick={() => onToggle(player.entryId)} className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold hover:bg-blue-500"><ChevronRight className={`transition-transform ${expanded ? "rotate-90" : ""}`} size={18} />{expanded ? "Close Result Editor" : "Declare Result"}</button>}{expanded && !player.submitted && <div className="mt-4 border-t border-slate-800 pt-4"><ResultEditor player={player} {...editorProps} /></div>}</article>; })}</div>;

const Snackbar = ({ snackbar, onClose }) => <div aria-live="polite" aria-atomic="true" className={`pointer-events-none fixed inset-x-3 top-4 z-[80] flex justify-end transition-all duration-300 sm:inset-x-auto sm:right-6 sm:top-6 ${snackbar.open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}`}><div className={`pointer-events-auto flex w-full max-w-md min-w-0 items-start gap-3 rounded-xl border px-4 py-4 shadow-2xl ${snackbar.severity === "success" ? "border-emerald-700 bg-emerald-950 text-emerald-300" : snackbar.severity === "warning" ? "border-amber-700 bg-amber-950 text-amber-300" : "border-red-700 bg-red-950 text-red-300"}`}>{snackbar.severity === "success" ? <Check className="mt-0.5 shrink-0" size={20} /> : snackbar.severity === "warning" ? <AlertTriangle className="mt-0.5 shrink-0" size={20} /> : <X className="mt-0.5 shrink-0" size={20} />}<p className="min-w-0 flex-1 break-words font-medium">{snackbar.message}</p><button type="button" onClick={onClose} aria-label="Dismiss notification" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg hover:bg-white/10"><X size={18} /></button></div></div>;

export default AddIndividualResult;
