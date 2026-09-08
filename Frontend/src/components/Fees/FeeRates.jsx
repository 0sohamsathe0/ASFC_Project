import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarPlus, History, IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { api } from "../api";
import { FeeDialog, FeePageState } from "./FeeShared";
import { addFeeMonths, formatCurrency, formatFeeMonth, getCurrentIndiaMonth, getFeeErrorMessage } from "./fee-ui";

const FeeRates = () => {
  const navigate = useNavigate();
  const currentMonth = useMemo(() => getCurrentIndiaMonth(), []);
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [effectiveFromMonth, setEffectiveFromMonth] = useState(addFeeMonths(currentMonth, 1));
  const [confirmed, setConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadRates = useCallback(async () => {
    setError("");
    try { const response = await api.get("/admin/fees/rates"); setRates(response.data.data || []); }
    catch (apiError) {
      if ([401, 403].includes(apiError.response?.status)) navigate("/admin/login", { replace: true });
      else setError(getFeeErrorMessage(apiError, "Unable to load fee rates."));
    } finally { setLoading(false); }
  }, [navigate]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRates();
  }, [loadRates]);

  const addRate = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await api.post("/admin/fees/rates", { amount: Number(amount), effectiveFromMonth });
      toast.success("Future fee rate added.");
      setDialogOpen(false); setAmount(""); setConfirmed(false); await loadRates();
    } catch (apiError) {
      if ([401, 403].includes(apiError.response?.status)) navigate("/admin/login", { replace: true });
      else toast.error(getFeeErrorMessage(apiError, "Unable to add the fee rate."));
    }
    finally { setSaving(false); }
  };

  const currentRateStart = [...rates]
    .filter((rate) => rate.effectiveFromMonth <= currentMonth)
    .sort((first, second) => second.effectiveFromMonth.localeCompare(first.effectiveFromMonth))[0]
    ?.effectiveFromMonth;
  const labelFor = (month) => month === currentRateStart ? "Current" : month < currentMonth ? "Historical" : "Future";
  return <div className="min-h-full bg-slate-100 p-3 sm:p-6 lg:p-8"><div className="mx-auto max-w-5xl space-y-5"><header className="flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Fees Management</p><h1 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">Fee Rates</h1><p className="mt-2 text-sm text-slate-600">Append-only monthly rate timeline. Existing covered months remain unchanged.</p></div><button type="button" onClick={() => setDialogOpen(true)} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 font-semibold text-white"><CalendarPlus size={18} />Add future rate</button></header>
    {loading ? <FeePageState title="Loading fee rates" message="Retrieving the fee-rate timeline…" /> : error ? <FeePageState title="Unable to load" message={error} onRetry={loadRates} /> : !rates.length ? <FeePageState title="No fee rates" message="A fee rate must exist before coverage can be calculated." /> : <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="divide-y divide-slate-100">{rates.map((rate) => <article key={rate._id || rate.effectiveFromMonth} className="flex flex-wrap items-center gap-4 p-4 sm:p-5"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><IndianRupee size={20} /></span><div className="min-w-0 flex-1"><h2 className="text-lg font-bold text-slate-950">{formatCurrency(rate.amount)} per month</h2><p className="text-sm text-slate-600">Effective from {formatFeeMonth(rate.effectiveFromMonth)}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700"><History className="mr-1 inline" size={13} />{labelFor(rate.effectiveFromMonth)}</span></article>)}</div><p className="border-t bg-slate-50 p-4 text-sm text-slate-600">Rates cannot be edited or deleted. Adding a rate never recalculates total recorded paid.</p></section>}
  </div>{dialogOpen && <FeeDialog title="Add future fee rate" description="The new rate applies to future uncovered months only." onClose={() => !saving && setDialogOpen(false)} busy={saving}><label htmlFor="fee-rate-amount" className="block text-sm font-bold">Monthly amount in rupees</label><input id="fee-rate-amount" type="number" min="1" step="1" value={amount} onChange={(event) => setAmount(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border px-3" /><label htmlFor="fee-rate-month" className="mt-4 block text-sm font-bold">Effective-from month</label><input id="fee-rate-month" type="month" min={addFeeMonths(currentMonth, 1)} value={effectiveFromMonth} onChange={(event) => setEffectiveFromMonth(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border px-3" /><label className="mt-5 flex items-start gap-3 rounded-xl bg-blue-50 p-3 text-sm"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} className="mt-0.5 h-5 w-5" /><span>I understand existing covered months are unaffected and this rate cannot be edited or deleted.</span></label><div className="mt-5 grid grid-cols-2 gap-3"><button type="button" onClick={() => setDialogOpen(false)} disabled={saving} className="min-h-11 rounded-xl border font-semibold">Cancel</button><button type="button" onClick={addRate} disabled={saving || !confirmed || !Number.isSafeInteger(Number(amount)) || Number(amount) <= 0} className="min-h-11 rounded-xl bg-blue-600 font-semibold text-white disabled:opacity-50">{saving ? "Adding…" : "Add rate"}</button></div></FeeDialog>}</div>;
};

export default FeeRates;
