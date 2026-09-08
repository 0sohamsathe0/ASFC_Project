import { createElement, useCallback, useEffect, useState } from "react";
import {
  AlertCircle, Building2, CalendarDays, Eye, FileBadge2, Mail,
  MapPin, Pencil, Phone, RefreshCw, Swords, UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { api } from "../components/api.js";
import AadhaarPreview from "./player/AadhaarPreview.jsx";

const statusStyles = {
  Accepted: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Pending: "border-amber-200 bg-amber-50 text-amber-800",
  Rejected: "border-rose-200 bg-rose-50 text-rose-700",
};

const displayValue = (value) => value || "Not provided";

const formatDate = (value) => value
  ? new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
  : "Not provided";

const InformationField = ({ label, value, icon: Icon }) => (
  <div className="flex min-w-0 items-start gap-3 py-3">
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
      {createElement(Icon, { size: 17, "aria-hidden": true })}
    </span>
    <div className="min-w-0">
      <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</dt>
      <dd className="mt-1 break-words text-sm font-semibold leading-5 text-slate-800">{displayValue(value)}</dd>
    </div>
  </div>
);

const ProfileSection = ({ title, description, children }) => (
  <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <header className="border-b border-slate-200 px-4 py-3.5 sm:px-5">
      <h2 className="font-bold text-slate-900">{title}</h2>
      {description && <p className="mt-0.5 text-xs leading-5 text-slate-500">{description}</p>}
    </header>
    <div className="px-4 sm:px-5">{children}</div>
  </section>
);

const PlayerProfile = () => {
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [showAadhaar, setShowAadhaar] = useState(false);
  const [aadhaarAccessUrl, setAadhaarAccessUrl] = useState("");
  const [aadhaarFormat, setAadhaarFormat] = useState("");
  const [aadhaarLoading, setAadhaarLoading] = useState(false);
  const [aadhaarError, setAadhaarError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    api.get("/player/profile", { signal: controller.signal })
      .then((response) => {
        const profile = response.data.player;
        setPlayer(profile);
        setLoading(false);
      })
      .catch((apiError) => {
        if (apiError.code === "ERR_CANCELED") return;
        if ([401, 403].includes(apiError.response?.status)) {
          navigate("/player/login", { replace: true });
          return;
        }
        setError(apiError.response?.data?.message || "Unable to load your profile. Please try again.");
        setLoading(false);
      });
    return () => controller.abort();
  }, [attempt, navigate]);

  const retry = useCallback(() => {
    setError("");
    setLoading(true);
    setAttempt((value) => value + 1);
  }, []);

  const openAadhaarDocument = async () => {
    if (aadhaarLoading) return;
    setAadhaarLoading(true);
    setAadhaarError("");
    try {
      const response = await api.get("/player/profile/aadhaar-document");
      setAadhaarAccessUrl(response.data.data.url);
      setAadhaarFormat(response.data.data.format || "");
      setShowAadhaar(true);
    } catch (apiError) {
      setAadhaarError(apiError.response?.data?.message || "Unable to open your identity document.");
    } finally {
      setAadhaarLoading(false);
    }
  };

  if (loading) {
    return <div className="px-3 py-4 min-[360px]:px-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto max-w-6xl animate-pulse space-y-4" aria-label="Loading profile">
        <div className="h-32 rounded-2xl bg-white" />
        <div className="grid gap-4 lg:grid-cols-2"><div className="h-64 rounded-2xl bg-white" /><div className="h-64 rounded-2xl bg-white" /></div>
      </div>
    </div>;
  }

  if (error || !player) {
    return <div className="px-4 py-10"><div className="mx-auto max-w-lg rounded-2xl border border-rose-200 bg-white p-6 text-center shadow-sm">
      <AlertCircle className="mx-auto text-rose-600" aria-hidden="true" />
      <h1 className="mt-3 text-xl font-bold text-slate-900">Profile unavailable</h1>
      <p className="mt-2 text-sm text-slate-600">{error}</p>
      <button type="button" onClick={retry} className="mx-auto mt-5 flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
        <RefreshCw size={16} aria-hidden="true" /> Try again
      </button>
    </div></div>;
  }

  const address = [player.address?.addressLine1, player.address?.addressLine2].filter(Boolean).join(", ");
  const isRejected = player.requestStatus === "Rejected";

  return <div className="px-3 py-4 min-[360px]:px-4 sm:px-6 sm:py-6 lg:px-8">
    <div className="mx-auto max-w-6xl space-y-4 sm:space-y-5">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">Account</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">My Profile</h1>
        <p className="mt-1 text-sm text-slate-500">Your identity, membership and registration information.</p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <img src={player.photoURL} alt={`${player.fullName}'s profile`} className="h-24 w-24 shrink-0 rounded-2xl border border-slate-200 object-cover sm:h-28 sm:w-28" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="min-w-0 break-words text-xl font-bold text-slate-950 sm:text-2xl">{player.fullName}</h2>
              <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${statusStyles[player.requestStatus] || statusStyles.Pending}`}>
                Registration: {player.requestStatus || "Pending"}
              </span>
            </div>
            <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-blue-700"><Swords size={16} aria-hidden="true" /> {displayValue(player.event)}</p>
            <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <div><dt className="text-xs text-slate-500">FAI ID</dt><dd className="font-semibold text-slate-800">{displayValue(player.faiId)}</dd></div>
              <div><dt className="text-xs text-slate-500">MFA ID</dt><dd className="font-semibold text-slate-800">{displayValue(player.mfaId)}</dd></div>
            </dl>
          </div>
        </div>
      </section>

      {player.requestStatus === "Pending" && <section className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"><p className="font-semibold">Your club registration is being reviewed.</p></section>}

      {isRejected && <section className="rounded-xl border border-rose-200 bg-rose-50 p-4" aria-labelledby="profile-correction-title">
        <div className="flex items-start gap-3"><AlertCircle className="mt-0.5 shrink-0 text-rose-600" size={20} aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <h2 id="profile-correction-title" className="font-bold text-rose-900">Profile correction required</h2>
            <p className="mt-1 break-words text-sm leading-6 text-rose-800">{player.rejectionReason || "Please review and correct your registration details."}</p>
            <Link to="/player/profile/edit" className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"><Pencil size={16} aria-hidden="true" /> Correct profile</Link>
          </div>
        </div>
      </section>}

      <div className="grid items-start gap-4 lg:grid-cols-2 lg:gap-5">
        <ProfileSection title="Personal information" description="Your registered contact and personal details.">
          <dl className="grid divide-y divide-slate-100 sm:grid-cols-2 sm:divide-y-0 sm:gap-x-5">
            <InformationField label="Date of birth" value={formatDate(player.dob)} icon={CalendarDays} />
            <InformationField label="Gender" value={player.gender} icon={UserRound} />
            <InformationField label="Email" value={player.email} icon={Mail} />
            <InformationField label="Phone" value={player.phone} icon={Phone} />
          </dl>
        </ProfileSection>

        <div className="space-y-4 sm:space-y-5">
          <ProfileSection title="Club & institute" description="Your fencing and institute records.">
            <dl className="grid divide-y divide-slate-100 sm:grid-cols-2 sm:divide-y-0 sm:gap-x-5">
              <InformationField label="Institute" value={player.institute} icon={Building2} />
              <InformationField label="Weapon" value={player.event} icon={Swords} />
            </dl>
          </ProfileSection>
          <ProfileSection title="Address">
            <dl className="grid divide-y divide-slate-100 sm:grid-cols-2 sm:divide-y-0 sm:gap-x-5">
              <InformationField label="Address" value={address} icon={MapPin} />
              <InformationField label="Pincode" value={player.address?.pincode} icon={MapPin} />
            </dl>
          </ProfileSection>
        </div>
      </div>

      <ProfileSection title="Registration & verification" description="Sensitive identity information stays limited to this account page.">
        <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><FileBadge2 size={19} aria-hidden="true" /></span>
            <div><p className="font-semibold text-slate-900">Identity document</p><p className="mt-0.5 text-sm text-slate-500">{player.hasAadhaarDocument ? "Document on file for registration verification." : "No document is available."}</p></div>
          </div>
          {player.hasAadhaarDocument && <button type="button" disabled={aadhaarLoading} onClick={openAadhaarDocument} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60"><Eye size={17} aria-hidden="true" /> {aadhaarLoading ? "Opening…" : "View document"}</button>}
        </div>
        {aadhaarError && <p role="alert" className="pb-4 text-sm font-medium text-rose-700">{aadhaarError}</p>}
      </ProfileSection>

    </div>

    <AadhaarPreview open={showAadhaar} image={aadhaarAccessUrl} format={aadhaarFormat} onClose={() => { setShowAadhaar(false); setAadhaarAccessUrl(""); setAadhaarFormat(""); }} />
  </div>;
};

export default PlayerProfile;
