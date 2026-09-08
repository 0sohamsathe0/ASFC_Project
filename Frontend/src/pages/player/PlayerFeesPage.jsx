import { createElement, useCallback, useEffect, useState } from "react";
import { Banknote, CalendarCheck2, CircleCheckBig, IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { api } from "../../components/api";
import { FeeMonthView, FeePageState, FeeStatusBadge } from "../../components/Fees/FeeShared";
import { formatCurrency, formatFeeMonth, getFeeErrorMessage } from "../../components/Fees/fee-ui";

const PlayerFeesPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFees = useCallback(async () => {
    setError("");
    try {
      const response = await api.get("/player/fees");
      setData(response.data.data);
    } catch (apiError) {
      if ([401, 403].includes(apiError.response?.status)) {
        navigate("/player/login", { replace: true });
      } else {
        setError(getFeeErrorMessage(apiError, apiError.response?.status === 404
          ? "Your fee account has not been set up yet."
          : "Unable to load your fees."));
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadFees();
  }, [loadFees]);

  if (loading) {
    return <div className="p-4 sm:p-6 lg:p-8"><FeePageState title="Loading your fees" message="Getting your latest fee information…" /></div>;
  }
  if (error || !data) {
    return <div className="p-4 sm:p-6 lg:p-8"><FeePageState title="Unable to load" message={error || "Fee information is unavailable."} onRetry={loadFees} /></div>;
  }

  const { account, summary } = data;
  const statusMessage = summary.currentStatus === "closed"
    ? "Your fee account is closed. Previous fee information remains available."
    : summary.currentStatus === "paused"
      ? "Your fee account is currently paused."
      : summary.currentOutstanding > 0
        ? `Fees are pending from ${formatFeeMonth(summary.nextUnpaidPayableMonth)}. Please contact the club to update your fee coverage.`
        : `Your fees are covered through ${formatFeeMonth(account.paidThroughMonth)}.`;
  const coveredMonthCount = summary.coveredMonths?.length || 0;
  const pendingMonthCount = summary.pendingMonths?.length || 0;
  const primaryCards = [
    ["Monthly Fee", formatCurrency(data.currentMonthlyRate), "Per month", IndianRupee, "text-blue-700 bg-blue-50"],
    ["Total Fees Paid", formatCurrency(account.totalPaid), `${coveredMonthCount} ${coveredMonthCount === 1 ? "month" : "months"} paid`, CircleCheckBig, "text-emerald-700 bg-emerald-50"],
    ["Current Outstanding", formatCurrency(summary.currentOutstanding), summary.currentOutstanding > 0 ? "Amount currently due" : "No amount due", Banknote, summary.currentOutstanding > 0 ? "text-rose-700 bg-rose-50" : "text-emerald-700 bg-emerald-50"],
    ["Pending Months", pendingMonthCount, pendingMonthCount === 1 ? "1 month due" : `${pendingMonthCount} months due`, CalendarCheck2, pendingMonthCount > 0 ? "text-rose-700 bg-rose-50" : "text-blue-700 bg-blue-50"],
  ];
  const secondaryCards = [
    ["Fees Started", formatFeeMonth(account.billingStartMonth)],
    ["Paid Until", formatFeeMonth(account.paidThroughMonth, "—")],
    ["Paid in Advance", `${summary.futurePrepaidMonths?.length || 0} months`],
    ["Next Month Due", formatFeeMonth(summary.nextUnpaidPayableMonth, "None")],
  ];

  return <div className="min-h-full bg-slate-100 p-3 sm:p-6 lg:p-8"><div className="mx-auto max-w-6xl space-y-5">
    <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center gap-3"><h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">My Fees</h1><FeeStatusBadge status={summary.currentStatus} /></div>
      <p className={`mt-4 rounded-xl p-4 text-sm font-semibold ${summary.currentOutstanding > 0 ? "bg-amber-50 text-amber-900" : "bg-blue-50 text-blue-900"}`}>{statusMessage}</p>
    </header>

    <section aria-label="My fee summary" className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
      {primaryCards.map(([label, value, supportingText, cardIcon, iconStyle]) => <article key={label} className="min-w-0 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm sm:p-4">
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconStyle}`}>{createElement(cardIcon, { size: 18, "aria-hidden": true })}</span>
        <p className="mt-3 text-xs font-semibold text-slate-500 sm:text-sm">{label}</p>
        <p className="mt-1 break-words text-lg font-bold text-slate-950 sm:text-xl">{value}</p>
        <p className="mt-1 text-xs text-slate-500">{supportingText}</p>
      </article>)}
    </section>

    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="text-xl font-bold text-slate-950">Monthly Fee Coverage</h2>
      <p className="mb-5 mt-1 text-sm text-slate-600">See which months are paid, due, paused, or paid in advance.</p>
      <FeeMonthView months={summary.months} />
    </section>

    <section aria-labelledby="fee-details-heading" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h2 id="fee-details-heading" className="text-base font-bold text-slate-900">More Fee Details</h2>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-4">
        {secondaryCards.map(([label, value]) => <div key={label} className="min-w-0 border-t border-slate-100 pt-3"><dt className="text-xs font-semibold text-slate-500">{label}</dt><dd className="mt-1 break-words text-sm font-bold text-slate-800">{value}</dd></div>)}
      </dl>
    </section>
  </div></div>;
};

export default PlayerFeesPage;
