import { createElement, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Banknote,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CirclePause,
  CircleX,
  IndianRupee,
  Search,
  UserPlus,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { api } from "../api";
import { FeeDialog, FeePageState } from "./FeeShared";
import {
  formatCurrency,
  formatFeeMonth,
  formatFinancialYear,
  getCurrentIndiaMonth,
  getFeeErrorMessage,
  getFinancialYearStart,
} from "./fee-ui";

const PRIMARY_FILTERS = [
  ["all", "All"],
  ["pending", "Fees Due"],
  ["up-to-date", "Up to Date"],
];

const SECONDARY_FILTERS = [
  ["active", "Active"],
  ["paused", "Paused"],
  ["closed", "Closed"],
  ["uninitialized", "Needs Setup"],
];

const statusPresentation = (entry) => {
  if (!entry.initialized) {
    return { label: "Needs setup", detail: "Choose a starting month", Icon: UserPlus, style: "text-violet-700 bg-violet-50" };
  }

  const monthsDue = entry.pendingPayableMonthCount || 0;
  if (entry.currentStatus === "paused") {
    return { label: "Paused", detail: monthsDue ? `${monthsDue} ${monthsDue === 1 ? "month" : "months"} due` : "No current fees", Icon: CirclePause, style: "text-amber-700 bg-amber-50" };
  }
  if (entry.currentStatus === "closed") {
    return { label: "Closed", detail: monthsDue ? `${monthsDue} ${monthsDue === 1 ? "month" : "months"} due` : "No fees due", Icon: CircleX, style: "text-slate-700 bg-slate-100" };
  }
  if (monthsDue > 0) {
    return { label: `${monthsDue} ${monthsDue === 1 ? "month" : "months"} due`, Icon: AlertCircle, style: "text-rose-700 bg-rose-50" };
  }
  if (entry.futurePrepaidPayableMonthCount > 0) {
    return { label: "Paid in advance", Icon: CheckCircle2, style: "text-blue-700 bg-blue-50" };
  }
  return { label: "Up to date", Icon: CheckCircle2, style: "text-emerald-700 bg-emerald-50" };
};

const FeeState = ({ entry, compact = false }) => {
  const { label, detail, Icon, style } = statusPresentation(entry);
  return <div className="flex min-w-0 items-center gap-2">
    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style}`}><Icon size={16} aria-hidden="true" /></span>
    <span className="min-w-0">
      <span className="block text-sm font-semibold text-slate-800">{label}</span>
      {!compact && detail && <span className="block text-xs text-slate-500">{detail}</span>}
    </span>
  </div>;
};

const AdminFeesOverview = () => {
  const navigate = useNavigate();
  const currentMonth = useMemo(() => getCurrentIndiaMonth(), []);
  const financialYearStart = useMemo(() => getFinancialYearStart(currentMonth), [currentMonth]);
  const [overview, setOverview] = useState(null);
  const [list, setList] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [feeState, setFeeState] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [initializing, setInitializing] = useState(null);
  const [billingStartMonth, setBillingStartMonth] = useState(currentMonth);
  const [saving, setSaving] = useState(false);
  const requestId = useRef(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const handleAuth = useCallback((apiError) => {
    if ([401, 403].includes(apiError.response?.status)) {
      navigate("/admin/login", { replace: true });
      return true;
    }
    return false;
  }, [navigate]);

  const loadData = useCallback(async ({ background = false } = {}) => {
    const currentRequest = ++requestId.current;
    if (background) setRefreshing(true); else setLoading(true);
    setError("");
    try {
      const [overviewResponse, listResponse] = await Promise.all([
        api.get("/admin/fees/overview", { params: { financialYearStart } }),
        api.get("/admin/fees/accounts", { params: { page, limit: 20, search, feeState } }),
      ]);
      if (currentRequest !== requestId.current) return;
      setOverview(overviewResponse.data.data);
      setList(listResponse.data.data);
    } catch (apiError) {
      if (currentRequest !== requestId.current || apiError.code === "ERR_CANCELED") return;
      if (handleAuth(apiError)) return;
      setError(getFeeErrorMessage(apiError, "Unable to load fee accounts."));
    } finally {
      if (currentRequest === requestId.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [feeState, financialYearStart, handleAuth, page, search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const chooseFilter = (value) => {
    setFeeState(value);
    setPage(1);
  };

  const openSetup = (entry) => {
    setBillingStartMonth(currentMonth);
    setInitializing(entry);
  };

  const initializeAccount = async () => {
    if (!initializing || saving) return;
    setSaving(true);
    try {
      await api.post("/admin/fees/accounts", {
        playerId: initializing.player._id,
        billingStartMonth,
      });
      toast.success("Player fees set up successfully.");
      setInitializing(null);
      await loadData({ background: true });
    } catch (apiError) {
      if (!handleAuth(apiError)) toast.error(getFeeErrorMessage(apiError, "Unable to set up player fees."));
    } finally {
      setSaving(false);
    }
  };

  const totals = overview?.totals;
  const financialYearLabel = overview?.financialYear
    ? `${formatFeeMonth(overview.financialYear.startMonth)} – ${formatFeeMonth(overview.financialYear.endMonth)}`
    : formatFinancialYear(financialYearStart);
  const cards = totals ? [
    ["Fees Collected", formatCurrency(totals.totalRecordedPaid), IndianRupee, "text-emerald-700 bg-emerald-50"],
    ["Fees Due", formatCurrency(totals.totalCurrentOutstanding), Banknote, "text-rose-700 bg-rose-50"],
    ["Players with Dues", totals.pendingAccountCount, Users, "text-rose-700 bg-rose-50"],
    ["Up to Date", totals.upToDateAccountCount, CheckCircle2, "text-blue-700 bg-blue-50"],
  ] : [];
  const secondaryFilterActive = SECONDARY_FILTERS.some(([value]) => value === feeState);
  const emptyTitle = feeState === "pending"
    ? "No players currently have fees due"
    : feeState === "up-to-date"
      ? "No up-to-date fee accounts found"
      : feeState === "uninitialized"
        ? "No players need fee setup"
        : "No players found";
  const emptyMessage = search ? "Try another player name or filter." : feeState === "pending"
    ? "All matching player fee accounts are up to date."
    : "There are no players in this view.";

  return <div className="min-h-full bg-slate-100 p-3 sm:p-6 lg:p-8">
    <div className="mx-auto max-w-[90rem] space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:px-6">
        <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">Fees Management</h1>
        <p className="mt-1 text-sm font-semibold text-blue-700">{financialYearLabel}</p>
      </header>

      {loading ? <FeePageState title="Loading fee accounts" message="Getting the latest fee information…" /> : error ? <FeePageState title="Unable to load fees" message={error} onRetry={() => loadData()} /> : <>
        <section aria-label="Fee overview" className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          {cards.map(([label, value, cardIcon, style]) => <article key={label} className="min-w-0 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm sm:flex sm:items-center sm:gap-3 sm:p-4">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${style}`}>{createElement(cardIcon, { size: 18, "aria-hidden": true })}</span>
            <div className="mt-2 min-w-0 sm:mt-0"><p className="text-xs font-semibold text-slate-500 sm:text-sm">{label}</p><p className="mt-0.5 break-words text-lg font-bold text-slate-950 sm:text-xl">{value}</p></div>
          </article>)}
        </section>

        {totals?.uninitializedAcceptedPlayerCount > 0 && <section className="flex flex-col gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between" aria-label="Players needing fee setup">
          <div className="flex min-w-0 items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-700"><UserPlus size={18} aria-hidden="true" /></span><div><p className="font-bold text-slate-900">{totals.uninitializedAcceptedPlayerCount} {totals.uninitializedAcceptedPlayerCount === 1 ? "player needs" : "players need"} fee setup</p><p className="text-sm text-slate-600">Set the starting month before recording fees.</p></div></div>
          <button type="button" onClick={() => chooseFilter("uninitialized")} className="min-h-10 shrink-0 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">Set Up</button>
        </section>}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-4 sm:p-5">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <label className="relative block w-full xl:max-w-sm"><span className="sr-only">Search players</span><Search className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={18} aria-hidden="true" /><input value={searchInput} maxLength={100} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search players" className="min-h-11 w-full rounded-xl border border-slate-300 py-2 pl-10 pr-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></label>
              <div className="flex flex-wrap items-center gap-2" aria-label="Fee account filters">
                {PRIMARY_FILTERS.map(([value, label]) => <button key={value} type="button" aria-pressed={feeState === value} onClick={() => chooseFilter(value)} className={`min-h-10 rounded-full px-3.5 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${feeState === value ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>{label}</button>)}
                <details className="group relative">
                  <summary className={`flex min-h-10 cursor-pointer list-none items-center gap-1 rounded-full px-3.5 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 [&::-webkit-details-marker]:hidden ${secondaryFilterActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>More <ChevronDown size={15} className="transition-transform group-open:rotate-180" aria-hidden="true" /></summary>
                  <div className="absolute right-0 z-20 mt-2 min-w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                    {SECONDARY_FILTERS.map(([value, label]) => <button key={value} type="button" aria-pressed={feeState === value} onClick={(event) => { chooseFilter(value); event.currentTarget.closest("details")?.removeAttribute("open"); }} className={`flex min-h-10 w-full items-center rounded-lg px-3 text-left text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${feeState === value ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"}`}>{label}</button>)}
                  </div>
                </details>
              </div>
            </div>
            {refreshing && <p role="status" className="mt-2 text-xs text-blue-600">Refreshing fee information…</p>}
          </div>

          {!list?.accounts?.length ? <div className="p-8 sm:p-10"><FeePageState title={emptyTitle} message={emptyMessage} /></div> : <>
            <div className="hidden lg:block">
              <table className="w-full table-fixed text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="w-[34%] px-5 py-3">Player</th><th className="w-[23%] px-4 py-3">Fee Status</th><th className="w-[18%] px-4 py-3">Paid Until</th><th className="w-[15%] px-4 py-3">Amount Due</th><th className="w-[10%] px-4 py-3 text-right">Action</th></tr></thead>
                <tbody>{list.accounts.map((entry) => <tr key={entry.player._id} className="border-t border-slate-100 transition-colors hover:bg-slate-50">
                  <td className="px-5 py-3"><div className="flex min-w-0 items-center gap-3"><img src={entry.player.photoURL} alt="" className="h-10 w-10 shrink-0 rounded-xl bg-slate-100 object-cover" /><div className="min-w-0"><p className="truncate font-bold text-slate-900" title={entry.player.fullName}>{entry.player.fullName}</p><p className="text-xs text-slate-500">{entry.player.event}</p></div></div></td>
                  <td className="px-4 py-3"><FeeState entry={entry} /></td>
                  <td className="px-4 py-3 font-medium text-slate-700">{entry.initialized && entry.paidThroughMonth ? formatFeeMonth(entry.paidThroughMonth) : "—"}</td>
                  <td className={`px-4 py-3 font-bold ${entry.currentOutstanding > 0 ? "text-rose-700" : "text-slate-400"}`}>{entry.currentOutstanding > 0 ? formatCurrency(entry.currentOutstanding) : "—"}</td>
                  <td className="px-4 py-3 text-right">{entry.initialized ? <Link to={`/admin/dashboard/fees/player/${entry.player._id}`} aria-label={`View fees for ${entry.player.fullName}`} className="inline-flex min-h-10 items-center gap-1 rounded-lg px-2 font-bold text-blue-700 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">View <ChevronRight size={17} aria-hidden="true" /></Link> : <button type="button" onClick={() => openSetup(entry)} className="min-h-10 rounded-lg px-2 font-bold text-violet-700 hover:bg-violet-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500">Set Up</button>}</td>
                </tr>)}</tbody>
              </table>
            </div>

            <div className="grid gap-3 p-3 sm:grid-cols-2 lg:hidden">{list.accounts.map((entry) => <article key={entry.player._id} className="min-w-0 rounded-xl border border-slate-200 p-4">
              <div className="flex min-w-0 items-center gap-3"><img src={entry.player.photoURL} alt="" className="h-11 w-11 shrink-0 rounded-xl bg-slate-100 object-cover" /><div className="min-w-0"><h2 className="truncate font-bold text-slate-900" title={entry.player.fullName}>{entry.player.fullName}</h2><p className="text-sm text-slate-500">{entry.player.event}</p></div></div>
              <div className="mt-3"><FeeState entry={entry} compact /></div>
              <dl className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-sm"><div><dt className="text-xs font-medium text-slate-500">Paid Until</dt><dd className="mt-0.5 font-semibold text-slate-800">{entry.initialized && entry.paidThroughMonth ? formatFeeMonth(entry.paidThroughMonth) : "—"}</dd></div><div><dt className="text-xs font-medium text-slate-500">Amount Due</dt><dd className={`mt-0.5 font-bold ${entry.currentOutstanding > 0 ? "text-rose-700" : "text-slate-400"}`}>{entry.currentOutstanding > 0 ? formatCurrency(entry.currentOutstanding) : "—"}</dd></div></dl>
              {entry.initialized ? <Link to={`/admin/dashboard/fees/player/${entry.player._id}`} className="mt-4 flex min-h-10 items-center justify-center gap-1 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">View <ChevronRight size={17} aria-hidden="true" /></Link> : <button type="button" onClick={() => openSetup(entry)} className="mt-4 min-h-10 w-full rounded-lg bg-violet-600 px-4 text-sm font-semibold text-white hover:bg-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2">Set Up Player Fees</button>}
            </article>)}</div>

            <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3"><button type="button" disabled={page <= 1 || refreshing} onClick={() => setPage((value) => value - 1)} className="min-h-10 rounded-lg border border-slate-300 px-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40">Previous</button><span className="text-sm text-slate-600">Page {list.page} of {Math.max(1, list.totalPages)}</span><button type="button" disabled={page >= list.totalPages || refreshing} onClick={() => setPage((value) => value + 1)} className="min-h-10 rounded-lg border border-slate-300 px-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40">Next</button></div>
          </>}
        </section>
      </>}
    </div>

    {initializing && <FeeDialog title={`Set Up Fees for ${initializing.player.fullName}`} description="Choose the first month this player should pay fees for." onClose={() => !saving && setInitializing(null)} busy={saving}>
      <label htmlFor="legacy-billing-month" className="text-sm font-bold text-slate-800">Starting month</label>
      <input id="legacy-billing-month" type="month" min="2026-06" max={currentMonth} value={billingStartMonth} onChange={(event) => setBillingStartMonth(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
      <p className="mt-2 text-xs text-slate-500">Choose a month from June 2026 through {formatFeeMonth(currentMonth)}.</p>
      <div className="mt-6 flex justify-end gap-3"><button type="button" disabled={saving} onClick={() => setInitializing(null)} className="min-h-11 rounded-xl border border-slate-300 px-4 font-semibold">Cancel</button><button type="button" disabled={saving || !billingStartMonth} onClick={initializeAccount} className="min-h-11 rounded-xl bg-blue-600 px-4 font-semibold text-white disabled:opacity-50">{saving ? "Setting up…" : "Confirm Setup"}</button></div>
    </FeeDialog>}
  </div>;
};

export default AdminFeesOverview;
