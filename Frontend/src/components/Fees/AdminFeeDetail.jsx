import { createElement, useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle, ArrowLeft, CalendarCheck2, Check, CirclePause, Clock3,
  IndianRupee, LockKeyhole, PencilLine, PlayCircle, Plus,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { api } from "../api";
import { FeeDialog, FeePageState, FeeStatusBadge } from "./FeeShared";
import {
  addFeeMonths, formatCurrency, formatFeeMonth, getCurrentIndiaMonth,
  getFeeErrorMessage, getFinancialYearStart, isFeeConflict,
} from "./fee-ui";

const yearLabel = (year) => `${year}–${String(Number(year) + 1).slice(-2)}`;

const registerState = (entry) => {
  if (!entry) return ["Not applicable", Clock3, "border-slate-200 bg-slate-50 text-slate-500"];
  if (entry.status === "closed") return ["Closed", LockKeyhole, "border-slate-300 bg-slate-100 text-slate-700"];
  if (entry.status === "paused") return ["Paused", CirclePause, "border-amber-200 bg-amber-50 text-amber-800"];
  if (entry.coverageState === "futurePrepaid") return ["Paid in Advance", Check, "border-blue-200 bg-blue-50 text-blue-800"];
  if (entry.coverageState === "covered") return ["Paid", Check, "border-emerald-200 bg-emerald-50 text-emerald-800"];
  if (entry.coverageState === "pending") return ["Due", AlertCircle, "border-rose-200 bg-rose-50 text-rose-800"];
  return ["Upcoming", Clock3, "border-slate-200 bg-white text-slate-600"];
};

const Headline = ({ label, value, icon, due = false }) => (
  <article className={`min-w-0 rounded-xl border p-3 sm:p-4 ${due ? "border-rose-200 bg-rose-50" : "border-slate-200 bg-white"}`}>
    <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">{createElement(icon, { size: 15, "aria-hidden": true })}{label}</p>
    <p className={`mt-2 break-words text-lg font-bold sm:text-xl ${due ? "text-rose-800" : "text-slate-950"}`}>{value}</p>
  </article>
);

const SettingButton = ({ icon, label, help, danger = false, onClick }) => (
  <button type="button" onClick={onClick} className={`min-h-20 rounded-xl border p-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${danger ? "border-rose-200 text-rose-800 hover:bg-rose-50" : "border-slate-200 text-slate-800 hover:bg-blue-50"}`}>
    <span className="flex items-center gap-2 font-bold">{createElement(icon, { size: 18, "aria-hidden": true })}{label}</span>
    <span className="mt-1 block text-xs font-normal text-slate-500">{help}</span>
  </button>
);

const MonthField = ({ id, label, min, max, value, onChange }) => <>
  <label htmlFor={id} className="block text-sm font-bold text-slate-800">{label}</label>
  <input id={id} type="month" min={min} max={max} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
</>;

const ConfirmActions = ({ busy, confirmed, setConfirmed, label, action, danger = false, onCancel, onSubmit }) => <>
  <label className="mt-5 flex min-h-12 items-start gap-3 rounded-xl border border-slate-200 p-3 text-sm"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} className="mt-0.5 h-5 w-5 shrink-0" /><span>{label}</span></label>
  <div className="mt-5 grid grid-cols-2 gap-3"><button type="button" disabled={busy} onClick={onCancel} className="min-h-11 rounded-xl border border-slate-300 font-semibold">Cancel</button><button type="button" disabled={busy || !confirmed} onClick={onSubmit} className={`min-h-11 rounded-xl font-semibold text-white disabled:opacity-50 ${danger ? "bg-rose-700" : "bg-blue-600"}`}>{busy ? "Saving…" : action}</button></div>
</>;

const AdminFeeDetail = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const currentMonth = useMemo(() => getCurrentIndiaMonth(), []);
  const currentYear = useMemo(() => getFinancialYearStart(currentMonth), [currentMonth]);
  const [data, setData] = useState(null);
  const [registerData, setRegisterData] = useState(null);
  const [coverageEntries, setCoverageEntries] = useState([]);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [loading, setLoading] = useState(true);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState(null);
  const [saving, setSaving] = useState(false);
  const [numberOfMonths, setNumberOfMonths] = useState(1);
  const [preview, setPreview] = useState(null);
  const [monthValue, setMonthValue] = useState(currentMonth);
  const [correctedMonth, setCorrectedMonth] = useState("");
  const [correctedTotal, setCorrectedTotal] = useState(0);
  const [confirmed, setConfirmed] = useState(false);

  const handleAuth = useCallback((errorValue) => {
    if ([401, 403].includes(errorValue.response?.status)) {
      navigate("/admin/login", { replace: true });
      return true;
    }
    return false;
  }, [navigate]);

  const loadRegister = useCallback(async (year = selectedYear) => {
    setRegisterLoading(true);
    try {
      const response = await api.get(`/admin/fees/accounts/${playerId}`, { params: { financialYearStart: year } });
      setRegisterData(response.data.data);
      setSelectedYear(year);
      return response.data.data;
    } catch (errorValue) {
      if (!handleAuth(errorValue)) toast.error(getFeeErrorMessage(errorValue, "Unable to load the fee register."));
      return null;
    } finally { setRegisterLoading(false); }
  }, [handleAuth, playerId, selectedYear]);

  const loadDetail = useCallback(async () => {
    setError("");
    try {
      const [detail, register] = await Promise.all([
        api.get(`/admin/fees/accounts/${playerId}`),
        api.get(`/admin/fees/accounts/${playerId}`, { params: { financialYearStart: selectedYear } }),
      ]);
      setData(detail.data.data);
      setRegisterData(register.data.data);
    } catch (errorValue) {
      if (!handleAuth(errorValue)) setError(getFeeErrorMessage(errorValue, "Unable to load this fee account."));
    } finally { setLoading(false); }
  }, [handleAuth, playerId, selectedYear]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDetail();
  }, [loadDetail]);

  const account = data?.account;
  const summary = data?.summary;
  const openPause = data?.pauses?.find((pause) => pause.endMonth === null);
  const expected = account ? { expectedPaidThroughMonth: account.paidThroughMonth, expectedVersion: account.__v } : null;

  const years = useMemo(() => {
    if (!account) return [currentYear];
    const first = getFinancialYearStart(account.billingStartMonth);
    const months = [currentMonth, account.paidThroughMonth, account.closedFromMonth, ...(data?.pauses || []).flatMap((pause) => [pause.startMonth, pause.endMonth])].filter(Boolean);
    const last = Math.max(currentYear, ...months.map(getFinancialYearStart));
    return Array.from({ length: last - first + 1 }, (_, index) => last - index);
  }, [account, currentMonth, currentYear, data?.pauses]);

  const registerMonths = useMemo(() => {
    const entries = new Map((registerData?.summary?.months || []).map((entry) => [entry.month, entry]));
    return Array.from({ length: 12 }, (_, index) => {
      const month = addFeeMonths(`${selectedYear}-06`, index);
      return { month, entry: entries.get(month) || null };
    });
  }, [registerData, selectedYear]);

  const choices = useMemo(() => {
    if (!summary?.nextUnpaidPayableMonth) return [];
    return coverageEntries.filter((entry) =>
      entry.month >= summary.nextUnpaidPayableMonth && entry.status === "active" && ["pending", "futureUnpaid"].includes(entry.coverageState)
    ).slice(0, 12);
  }, [coverageEntries, summary?.nextUnpaidPayableMonth]);

  const coverageRows = useMemo(() => {
    if (!summary?.nextUnpaidPayableMonth) return [];
    const rows = [];
    let payableCount = 0;
    for (const entry of coverageEntries) {
      if (entry.month < summary.nextUnpaidPayableMonth) continue;
      rows.push(entry);
      if (entry.status === "active" && ["pending", "futureUnpaid"].includes(entry.coverageState)) payableCount += 1;
      if (payableCount >= 12 || entry.status === "closed") break;
    }
    return rows;
  }, [coverageEntries, summary?.nextUnpaidPayableMonth]);

  const resetDialog = () => { if (!saving) { setMode(null); setPreview(null); setConfirmed(false); } };
  const openMode = (nextMode) => {
    setMode(nextMode); setPreview(null); setConfirmed(false); setNumberOfMonths(1);
    setCorrectedMonth(account.paidThroughMonth || ""); setCorrectedTotal(account.totalPaid);
    if (nextMode === "pause") setMonthValue(account.paidThroughMonth >= currentMonth ? addFeeMonths(account.paidThroughMonth, 1) : currentMonth);
    if (nextMode === "reactivate") setMonthValue(addFeeMonths(openPause.startMonth, 1));
    if (nextMode === "close") setMonthValue(addFeeMonths(account.paidThroughMonth || account.billingStartMonth, 1));
  };

  const openFeesPaid = async () => {
    const nextPayableMonth = summary.nextUnpaidPayableMonth;
    const targetYear = getFinancialYearStart(nextPayableMonth);
    const boundedPauseHorizons = data.pauses
      .filter((pause) => pause.endMonth && pause.endMonth >= nextPayableMonth)
      .map((pause) => addFeeMonths(pause.endMonth, 12));
    const horizonMonth = [addFeeMonths(nextPayableMonth, 11), ...boundedPauseHorizons]
      .sort()
      .at(-1);
    const lastCoverageYear = getFinancialYearStart(horizonMonth);
    const coverageYears = Array.from(
      { length: lastCoverageYear - targetYear + 1 },
      (_, index) => targetYear + index
    );
    setRegisterLoading(true);
    try {
      const responses = await Promise.all(coverageYears.map((financialYearStart) =>
        api.get(`/admin/fees/accounts/${playerId}`, { params: { financialYearStart } })
      ));
      setSelectedYear(targetYear);
      setRegisterData(responses[0].data.data);
      setCoverageEntries(responses.flatMap((response) => response.data.data.summary?.months || []));
      setNumberOfMonths(1); setPreview(null); setMode("coverage");
    } catch (errorValue) {
      if (!handleAuth(errorValue)) toast.error(getFeeErrorMessage(errorValue, "Unable to prepare the payable months."));
    } finally { setRegisterLoading(false); }
  };

  const refreshConflict = async (errorValue) => {
    if (!isFeeConflict(errorValue)) return false;
    toast.error(getFeeErrorMessage(errorValue));
    setMode(null); setPreview(null); setConfirmed(false);
    await loadDetail();
    return true;
  };

  const requestPreview = async () => {
    setSaving(true);
    try {
      const response = await api.post(`/admin/fees/accounts/${playerId}/coverage/preview`, { ...expected, numberOfMonths });
      setPreview(response.data.data);
    } catch (errorValue) {
      if (!(await refreshConflict(errorValue)) && !handleAuth(errorValue)) toast.error(getFeeErrorMessage(errorValue, "Unable to preview fees paid."));
    } finally { setSaving(false); }
  };

  const recordFees = async () => {
    setSaving(true);
    try {
      await api.post(`/admin/fees/accounts/${playerId}/coverage`, { ...expected, numberOfMonths });
      toast.success("Fees paid have been recorded."); setMode(null); setPreview(null); await loadDetail();
    } catch (errorValue) {
      if (!(await refreshConflict(errorValue)) && !handleAuth(errorValue)) toast.error(getFeeErrorMessage(errorValue, "Unable to record fees paid."));
    } finally { setSaving(false); }
  };

  const submitLifecycle = async () => {
    setSaving(true);
    try {
      if (mode === "pause") await api.post(`/admin/fees/accounts/${playerId}/pause`, { ...expected, startMonth: monthValue });
      if (mode === "reactivate") await api.post(`/admin/fees/accounts/${playerId}/reactivate`, { reactivationMonth: monthValue, expectedVersion: account.__v, expectedPauseVersion: openPause.__v });
      if (mode === "close") await api.post(`/admin/fees/accounts/${playerId}/close`, { ...expected, closedFromMonth: monthValue, confirmed: true });
      if (mode === "correct") await api.patch(`/admin/fees/accounts/${playerId}/correction`, { ...expected, correctedPaidThroughMonth: correctedMonth || null, correctedTotalPaid: Number(correctedTotal), confirmed: true });
      toast.success(mode === "pause" ? "Fees paused." : mode === "reactivate" ? "Fees resumed." : mode === "close" ? "Fee account closed." : "Fee details corrected.");
      setMode(null); setConfirmed(false); await loadDetail();
    } catch (errorValue) {
      if (!(await refreshConflict(errorValue)) && !handleAuth(errorValue)) toast.error(getFeeErrorMessage(errorValue));
    } finally { setSaving(false); }
  };

  if (loading) return <div className="p-4 sm:p-6 lg:p-8"><FeePageState title="Loading player fees" message="Retrieving the latest fee information…" /></div>;
  if (error || !data) return <div className="p-4 sm:p-6 lg:p-8"><FeePageState title="Unable to load" message={error || "Fee account not found."} onRetry={loadDetail} /></div>;

  const paidCount = registerMonths.filter(({ entry }) => ["covered", "futurePrepaid"].includes(entry?.coverageState)).length;
  const dueCount = registerMonths.filter(({ entry }) => entry?.coverageState === "pending").length;

  return <div className="min-h-full bg-slate-100 p-3 sm:p-6 lg:p-8"><div className="mx-auto max-w-7xl space-y-5">
    <Link to="/admin/dashboard/fees" className="inline-flex min-h-10 items-center gap-2 font-semibold text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"><ArrowLeft size={18} />Back to Fees Overview</Link>
    <header className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex min-w-0 items-center gap-4"><img src={data.player.photoURL} alt="" className="h-16 w-16 shrink-0 rounded-2xl bg-slate-100 object-cover sm:h-20 sm:w-20" /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h1 className="break-words text-2xl font-bold text-slate-950 sm:text-3xl">{data.player.fullName}</h1><FeeStatusBadge status={summary.currentStatus} /></div><p className="mt-1 text-sm font-medium text-slate-600">{data.player.event}</p></div></div>
      <div className="mt-5 grid grid-cols-1 gap-2.5 min-[360px]:grid-cols-3"><Headline label="Monthly Fee" value={formatCurrency(data.currentMonthlyRate)} icon={IndianRupee} /><Headline label="Paid Until" value={formatFeeMonth(account.paidThroughMonth, "Not yet paid")} icon={CalendarCheck2} /><Headline label="Amount Due" value={formatCurrency(summary.currentOutstanding)} icon={AlertCircle} due={summary.currentOutstanding > 0} /></div>
      <button type="button" disabled={!summary.nextUnpaidPayableMonth || registerLoading} onClick={openFeesPaid} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 font-bold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-slate-400 sm:w-auto"><Plus size={20} />Fees Paid</button>
      {!summary.nextUnpaidPayableMonth && <p className="mt-2 text-sm text-slate-500">{summary.coverageBlockedReason === "OPEN_PAUSE" ? "Resume fees before recording more paid months." : "No further payable month is available."}</p>}
    </header>

    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Fees History</p><h2 className="mt-1 text-xl font-bold text-slate-950">Fees for {yearLabel(selectedYear)}</h2><p className="mt-1 text-sm text-slate-600">{paidCount} {paidCount === 1 ? "month" : "months"} paid · {dueCount} {dueCount === 1 ? "month" : "months"} due</p></div>{years.length > 1 && <label className="text-sm font-semibold text-slate-700">Financial year<select value={selectedYear} disabled={registerLoading} onChange={(event) => loadRegister(Number(event.target.value))} className="ml-2 min-h-10 rounded-lg border border-slate-300 bg-white px-3 focus:ring-2 focus:ring-blue-100">{years.map((year) => <option key={year} value={year}>{yearLabel(year)}</option>)}</select></label>}</div>
      {registerLoading ? <p role="status" className="py-10 text-center text-sm text-slate-500">Loading fee register…</p> : <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">{registerMonths.map(({ month, entry }) => { const [label, Icon, style] = registerState(entry); return <article key={month} className={`min-w-0 rounded-xl border p-3 ${style}`}><p className="text-sm font-bold">{formatFeeMonth(month).split(" ")[0]}</p><p className="mt-2 flex items-center gap-1.5 text-xs font-bold"><Icon size={14} />{label}</p><p className="mt-1 truncate text-xs font-semibold">{entry?.scheduledRate == null ? "—" : formatCurrency(entry.scheduledRate)}</p></article>; })}</div>}
    </section>

    <details className="rounded-2xl border border-slate-200 bg-white shadow-sm"><summary className="cursor-pointer px-4 py-4 font-semibold text-slate-800 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500">More fee details</summary><dl className="grid gap-3 border-t border-slate-100 p-4 text-sm sm:grid-cols-4"><div><dt className="text-slate-500">Total recorded paid (जमा)</dt><dd className="font-bold">{formatCurrency(account.totalPaid)}</dd></div><div><dt className="text-slate-500">Fees started</dt><dd className="font-bold">{formatFeeMonth(account.billingStartMonth)}</dd></div><div><dt className="text-slate-500">Next month due</dt><dd className="font-bold">{formatFeeMonth(summary.nextUnpaidPayableMonth, "None")}</dd></div><div><dt className="text-slate-500">Paid in advance</dt><dd className="font-bold">{summary.futurePrepaidMonths.length} months</dd></div></dl></details>

    {(data.pauses.length > 0 || account.closedFromMonth) && <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><h2 className="font-bold text-slate-950">Scheduled changes</h2><div className="mt-3 grid gap-2 sm:grid-cols-2">{data.pauses.map((pause) => <p key={pause._id || pause.startMonth} className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900"><strong>Fees paused:</strong> {formatFeeMonth(pause.startMonth)} through {pause.endMonth ? formatFeeMonth(pause.endMonth) : "until resumed"}</p>)}{account.closedFromMonth && <p className="rounded-xl bg-slate-100 p-3 text-sm"><strong>Account closed:</strong> from {formatFeeMonth(account.closedFromMonth)}</p>}</div></section>}

    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><h2 className="text-lg font-bold text-slate-950">Account Settings</h2><p className="mt-1 text-sm text-slate-500">Use these only when the fee arrangement changes or a record needs correction.</p><div className="mt-4 grid gap-3 sm:grid-cols-3">{!account.closedFromMonth && !openPause && <SettingButton icon={CirclePause} label="Pause Fees" help="Temporarily stop monthly fees." onClick={() => openMode("pause")} />}{openPause && <SettingButton icon={PlayCircle} label="Resume Fees" help="End the current fee pause." onClick={() => openMode("reactivate")} />}<SettingButton icon={PencilLine} label="Edit Fee Details" help="Use only to correct an incorrect fee record." onClick={() => openMode("correct")} />{!account.closedFromMonth && <SettingButton icon={LockKeyhole} label="Close Account" help="Permanent in Fees V1." danger onClick={() => openMode("close")} />}</div></section>
  </div>

    {mode === "coverage" && <FeeDialog title={preview ? "Confirm Fees Paid" : "Record Fees Paid"} description={preview ? "Review the months and total before confirming." : "Select the months for which fees were received."} onClose={resetDialog} busy={saving}>{!preview ? <><fieldset><legend className="sr-only">Months paid</legend><div className="space-y-2">{coverageRows.map((entry) => { const index = choices.findIndex((choice) => choice.month === entry.month); const selectable = index >= 0; const checked = selectable && index < numberOfMonths; const [, , stateStyle] = registerState(entry); return <label key={entry.month} className={`flex min-h-12 items-center gap-3 rounded-xl border px-3 py-2.5 ${selectable ? "cursor-pointer border-slate-200 hover:bg-slate-50" : `${stateStyle} cursor-not-allowed opacity-75`}`}><input type="checkbox" disabled={!selectable} checked={checked} onChange={() => setNumberOfMonths(checked ? Math.max(1, index) : index + 1)} className="h-5 w-5 shrink-0 accent-blue-600" /><span className="min-w-0 flex-1 text-sm font-semibold">{formatFeeMonth(entry.month)}{!selectable && <small className="mt-0.5 block font-medium">{registerState(entry)[0]} — unavailable</small>}</span><strong className="shrink-0 text-sm">{entry.scheduledRate == null ? "—" : formatCurrency(entry.scheduledRate)}</strong></label>; })}</div></fieldset>{!choices.length && <p className="mt-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">No payable months are available.</p>}<div className="mt-4 rounded-xl bg-blue-50 p-4 text-sm">Selected: <strong>{numberOfMonths} {numberOfMonths === 1 ? "month" : "months"}</strong></div><button type="button" disabled={saving || !choices.length} onClick={requestPreview} className="mt-5 min-h-12 w-full rounded-xl bg-blue-600 font-bold text-white disabled:opacity-50">{saving ? "Checking…" : "Continue"}</button></> : <><div className="space-y-2">{preview.monthAmounts.map((entry) => <div key={entry.month} className="flex justify-between rounded-xl border border-slate-200 p-3 text-sm"><strong>{formatFeeMonth(entry.month)}</strong><strong>{formatCurrency(entry.amount)}</strong></div>)}</div>{preview.skippedPausedMonths.length > 0 && <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900"><strong>Paused months skipped:</strong> {preview.skippedPausedMonths.map((month) => formatFeeMonth(month)).join(", ")}</p>}<div className="mt-4 rounded-xl bg-blue-50 p-4"><div className="flex justify-between"><span>Total</span><strong className="text-lg">{formatCurrency(preview.calculatedAmount)}</strong></div><div className="mt-3 flex justify-between border-t border-blue-100 pt-3 text-sm"><span>Fees will be paid until</span><strong>{formatFeeMonth(preview.projectedPaidThroughMonth)}</strong></div>{preview.resultingFuturePrepaidCount > 0 && <p className="mt-2 text-xs">Paid in advance: {preview.resultingFuturePrepaidCount} of {preview.maximumFuturePrepaidMonths} months.</p>}</div><div className="mt-5 grid grid-cols-2 gap-3"><button type="button" disabled={saving} onClick={() => setPreview(null)} className="min-h-11 rounded-xl border font-semibold">Back</button><button type="button" disabled={saving} onClick={recordFees} className="min-h-11 rounded-xl bg-blue-600 font-bold text-white">{saving ? "Saving…" : "Confirm Fees Paid"}</button></div></>}</FeeDialog>}

    {mode === "pause" && <FeeDialog title="Pause Fees" description="Paused months are not charged. An open pause blocks later fee entries." onClose={resetDialog} busy={saving}><MonthField id="pause-month" label="Pause from" min={account.paidThroughMonth >= currentMonth ? addFeeMonths(account.paidThroughMonth, 1) : currentMonth} value={monthValue} onChange={setMonthValue} /><ConfirmActions busy={saving} confirmed={confirmed} setConfirmed={setConfirmed} label="I confirm this fee pause." action="Pause Fees" onCancel={resetDialog} onSubmit={submitLifecycle} /></FeeDialog>}
    {mode === "reactivate" && <FeeDialog title="Resume Fees" description={`The pause will end after ${formatFeeMonth(addFeeMonths(monthValue, -1))}.`} onClose={resetDialog} busy={saving}><MonthField id="resume-month" label="Resume from" min={addFeeMonths(openPause.startMonth, 1)} max={account.closedFromMonth ? addFeeMonths(account.closedFromMonth, -1) : undefined} value={monthValue} onChange={setMonthValue} /><ConfirmActions busy={saving} confirmed={confirmed} setConfirmed={setConfirmed} label="I confirm this resume month." action="Resume Fees" onCancel={resetDialog} onSubmit={submitLifecycle} /></FeeDialog>}
    {mode === "close" && <FeeDialog title="Close Account" description="Closing this fee account is permanent in V1. Use Pause Fees if the player may return." onClose={resetDialog} busy={saving} destructive><MonthField id="close-month" label="Close from" min={addFeeMonths(account.paidThroughMonth || account.billingStartMonth, 1)} value={monthValue} onChange={setMonthValue} /><ConfirmActions busy={saving} confirmed={confirmed} setConfirmed={setConfirmed} label="I understand this account cannot be reopened in V1." action="Permanently Close" danger onCancel={resetDialog} onSubmit={submitLifecycle} /></FeeDialog>}
    {mode === "correct" && <FeeDialog title="Edit Fee Details" description="Use only to correct an incorrect fee record. Detailed payment history is not retained." onClose={resetDialog} busy={saving} destructive><div className="rounded-xl bg-slate-50 p-4 text-sm">Current: paid until {formatFeeMonth(account.paidThroughMonth)} · {formatCurrency(account.totalPaid)} recorded</div><label htmlFor="corrected-month" className="mt-4 block text-sm font-bold">Corrected paid-until month</label><input id="corrected-month" type="month" min={account.billingStartMonth} value={correctedMonth} onChange={(event) => setCorrectedMonth(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border px-3" /><label htmlFor="corrected-total" className="mt-4 block text-sm font-bold">Corrected total recorded paid</label><input id="corrected-total" type="number" min="0" step="1" value={correctedTotal} onChange={(event) => setCorrectedTotal(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border px-3" /><p className="mt-3 text-sm">New: paid until {formatFeeMonth(correctedMonth)} · {formatCurrency(correctedTotal)}</p><ConfirmActions busy={saving} confirmed={confirmed} setConfirmed={setConfirmed} label="I confirm this trusted administrative correction." action="Save Correction" danger onCancel={resetDialog} onSubmit={submitLifecycle} /></FeeDialog>}
  </div>;
};

export default AdminFeeDetail;
