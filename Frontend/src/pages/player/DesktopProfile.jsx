import React from "react";
import MeritCertificates from "../../components/Certificate/MeritCertificates.jsx";
import ResultsSection from "../../components/Player/ResultsSection.jsx";
import { FileBadge2, Eye, LogOut, CalendarDays, Trophy, ShieldCheck } from "lucide-react";
import PlayerAttendance from "../../components/Attendance/PlayerAttendance.jsx";

const DesktopProfile = ({
  player,
  showAadhar,
  setShowAadhar,
  individualResults,
  teamResults,
  selectedCertificate,
  setSelectedCertificate,
  showCertificate,
  setShowCertificate,
  HandleLogout,
  totalTournamentsPlayed,
  upcomingTournaments,
  navigate,
}) => {
  return (
    <>
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">

          {/* =====================================================
              HEADER
          ====================================================== */}

          <div className="relative overflow-hidden bg-gradient-to-br from-[#07111F] via-[#0B1D35] to-blue-900 px-5 py-6 text-white sm:px-8 sm:py-8">

            {/* Background decoration */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              {/* Player identity */}
              <div className="min-w-0">

                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10">
                    <ShieldCheck
                      size={24}
                      className="text-blue-400"
                    />
                  </div>

                  <div className="min-w-0">

                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-blue-300">
                      Player Profile
                    </p>

                    <h1 className="mt-1 break-words text-2xl font-bold tracking-tight sm:text-3xl">
                      {player.fullName}
                    </h1>

                  </div>

                </div>

                {/* FAI ID */}
                <div className="mt-4 inline-flex items-center rounded-full border border-blue-300/20 bg-white/5 px-4 py-1.5 backdrop-blur-sm">

                  <span className="mr-2 text-[9px] font-medium uppercase tracking-widest text-blue-300">
                    FAI ID
                  </span>

                  <span className="font-mono text-xs font-bold tracking-wider text-white">
                    {player.faiId}
                  </span>

                </div>

              </div>

              {/* Status */}
              <div className="flex items-center sm:justify-end">

                <span
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold shadow-lg ${
                    player.requestStatus === "Accepted"
                      ? "bg-emerald-500 text-white shadow-emerald-900/20"
                      : player.requestStatus === "Rejected"
                        ? "bg-red-500 text-white shadow-red-900/20"
                        : "bg-amber-400 text-slate-900 shadow-amber-900/20"
                  }`}
                >

                  <span
                    className={`h-2 w-2 rounded-full ${
                      player.requestStatus === "Accepted"
                        ? "bg-emerald-200"
                        : player.requestStatus === "Rejected"
                          ? "bg-red-200"
                          : "bg-amber-700"
                    }`}
                  />

                  {player.requestStatus}

                </span>

              </div>

            </div>

          </div>

          {/* =====================================================
              REJECTION MESSAGE
          ====================================================== */}

          {player.requestStatus === "Rejected" &&
            player.rejectionReason && (
              <div className="mx-4 mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 sm:mx-6">

                <div className="flex gap-3">

                  <div className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-red-500" />

                  <div className="min-w-0">

                    <p className="font-bold text-red-700">
                      Registration Rejected
                    </p>

                    <p className="mt-1 break-words text-sm leading-6 text-red-600">
                      {player.rejectionReason}
                    </p>

                  </div>

                </div>

              </div>
            )}

          {/* =====================================================
              MAIN CONTENT
          ====================================================== */}

          <div className="grid grid-cols-1 gap-6 p-4 sm:p-6 md:grid-cols-3 lg:p-8">

            {/* =================================================
                LEFT SIDEBAR
            ================================================== */}

            <div className="space-y-5">

              {/* Player Photo */}

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <img
                  src={player.photoURL}
                  alt={`Player ${player.fullName}`}
                  className="aspect-[4/5] w-full object-cover"
                />

              </div>

              {/* Event */}

              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                    <Trophy size={19} />
                  </div>

                  <div className="min-w-0">

                    <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-500">
                      Event
                    </p>

                    <p className="mt-0.5 break-words font-bold text-slate-900">
                      {player.event}
                    </p>

                  </div>

                </div>

              </div>

              {/* Total Tournaments */}

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs font-medium text-slate-500">
                      Tournaments Played
                    </p>

                    <p className="mt-1 text-3xl font-bold text-blue-600">
                      {totalTournamentsPlayed}
                    </p>

                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                    <Trophy
                      size={21}
                      className="text-blue-600"
                    />
                  </div>

                </div>

              </div>

              {/* Upcoming Tournaments */}

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                <div className="mb-4 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                    <CalendarDays
                      size={19}
                      className="text-blue-600"
                    />
                  </div>

                  <div>

                    <h2 className="font-bold text-slate-900">
                      Upcoming
                    </h2>

                    <p className="text-xs text-slate-500">
                      Tournaments
                    </p>

                  </div>

                </div>

                {upcomingTournaments.length > 0 ? (

                  <ul className="space-y-2">

                    {upcomingTournaments.map((tournament) => (

                      <li
                        key={tournament.id}
                        className="rounded-xl border border-slate-100 bg-slate-50 p-3 transition hover:border-blue-100 hover:bg-blue-50"
                      >

                        <p className="break-words text-sm font-semibold text-slate-800">
                          {tournament.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {tournament.date}
                        </p>

                      </li>

                    ))}

                  </ul>

                ) : (

                  <div className="rounded-xl bg-slate-50 p-4 text-center">

                    <p className="text-sm text-slate-500">
                      No upcoming tournaments.
                    </p>

                  </div>

                )}

              </div>

              {/* Logout */}

              <div className="pt-1">

                <button
                  onClick={HandleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-4 focus:ring-red-500/10"
                >

                  <LogOut size={18} />

                  Logout

                </button>

              </div>

            </div>

            {/* =================================================
                RIGHT CONTENT
            ================================================== */}

            <div className="space-y-6 md:col-span-2">

              {/* Personal Information */}

              <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">

                {/* Section Header */}

                <div className="border-b border-blue-100 bg-blue-50 px-5 py-4 sm:px-6">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                      <ShieldCheck size={19} />
                    </div>

                    <div>

                      <h2 className="text-lg font-bold text-slate-900">
                        Personal Information
                      </h2>

                      <p className="text-xs text-slate-500">
                        Your registered player details
                      </p>

                    </div>

                  </div>

                </div>

                {/* Information */}

                <div className="grid grid-cols-1 gap-x-8 gap-y-5 p-5 sm:grid-cols-2 sm:p-6">

                  <div className="space-y-5">

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Gender
                      </p>

                      <p className="mt-1 break-words text-sm font-medium text-slate-800">
                        {player.gender}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Date of Birth
                      </p>

                      <p className="mt-1 break-words text-sm font-medium text-slate-800">
                        {new Date(player.dob).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Phone
                      </p>

                      <p className="mt-1 break-words text-sm font-medium text-slate-800">
                        {player.phone}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Address
                      </p>

                      <p className="mt-1 break-words text-sm font-medium text-slate-800">
                        {player.address.addressLine1}
                      </p>
                    </div>

                  </div>

                  <div className="space-y-5">

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Email
                      </p>

                      <p className="mt-1 break-all text-sm font-medium text-slate-800">
                        {player.email}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Institute
                      </p>

                      <p className="mt-1 break-words text-sm font-medium text-slate-800">
                        {player.institute}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Pincode
                      </p>

                      <p className="mt-1 break-words text-sm font-medium text-slate-800">
                        {player.address.pincode}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        MFA ID
                      </p>

                      <p className="mt-1 break-all text-sm font-medium text-slate-800">
                        {player.mfaId}
                      </p>
                    </div>

                  </div>

                </div>

              </div>

              {/* =================================================
                  AADHAAR
              ================================================== */}

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-center gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">

                      <FileBadge2
                        size={21}
                        className="text-blue-600"
                      />

                    </div>

                    <div>

                      <h2 className="text-lg font-bold text-slate-900">
                        Aadhaar Card
                      </h2>

                      <p className="text-xs text-slate-500">
                        Identity verification document
                      </p>

                    </div>

                  </div>

                  <button
                    onClick={() => setShowAadhar(true)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                  >

                    <Eye size={17} />

                    Preview

                  </button>

                </div>

              </div>

              {/* =================================================
                  ATTENDANCE
              ================================================== */}

              <PlayerAttendance />

              {/* =================================================
                  RESULTS
              ================================================== */}

              {player.requestStatus !== "Rejected" ? (
                <>

                  <ResultsSection
                    title="Individual Results"
                    description="View and download certificates earned in individual events."
                    results={individualResults}
                    color="blue"
                    icon="🏅"
                    setSelectedCertificate={setSelectedCertificate}
                    setShowCertificate={setShowCertificate}
                  />

                  <ResultsSection
                    title="Team Results"
                    description="View and download certificates earned in team events."
                    results={teamResults}
                    color="blue"
                    icon="👥"
                    setSelectedCertificate={setSelectedCertificate}
                    setShowCertificate={setShowCertificate}
                  />

                </>
              ) : (

                /* =================================================
                   REJECTED PROFILE
                ================================================== */

                <div className="rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm sm:p-8">

                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">

                    <svg
                      className="h-6 w-6 text-red-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                      />

                      <path d="M12 8v4" />

                      <path d="M12 16h.01" />

                    </svg>

                  </div>

                  <h2 className="text-xl font-bold text-red-600 sm:text-2xl">
                    Profile Requires Correction
                  </h2>

                  <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                    Your registration was rejected. Update the required
                    information and submit your profile again.
                  </p>

                  <button
                    onClick={() =>
                      navigate(`/player/edit/${player._id}`)
                    }
                    className="mt-5 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                  >
                    Edit Profile
                  </button>

                </div>

              )}

            </div>

          </div>

        </div>

        {/* =====================================================
            CERTIFICATE MODAL
        ====================================================== */}

        {showCertificate && (
          <div
            onClick={() => setShowCertificate(false)}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 px-4 pb-6 pt-20 backdrop-blur-md sm:pt-24"
          >

            <div
              onClick={(e) => e.stopPropagation()}
              className="flex h-[82vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_25px_60px_rgba(0,0,0,0.45)]"
            >

              <MeritCertificates
                certificateData={selectedCertificate}
                onClose={() => setShowCertificate(false)}
              />

            </div>

          </div>
        )}

      </div>
    </>
  );
};

export default DesktopProfile;
