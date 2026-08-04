import React from 'react'
import MeritCertificates from "../../components/Certificate/MeritCertificates.jsx";
import ResultsSection from "../../components/Player/ResultsSection.jsx";
import AadhaarPreview from './AadhaarPreview.jsx';
import {FileBadge2,Eye} from 'lucide-react'

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
      <div className="min-h-screen bg-gray-100 px-4 pt-8 pb-6 sm:px-6">

        <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">

          {/* HEADER */}

          <div className="bg-gradient-to-r from-indigo-700 via-violet-700 to-purple-700 text-white p-4 sm:p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold uppercase break-words">
                {player.fullName}

              </h1>

              <p className="mt-1 text-xs uppercase tracking-[4px] text-purple-200">
                Player Profile
                
              </p>
              
<pre
  className="
    mt-2 inline-flex items-center
    rounded-full
    border border-slate-300
    bg-gradient-to-r
    from-[#FF9933]
    via-white
    to-[#138808]
    px-4 py-1
    font-mono
    text-[11px]
    font-bold
    uppercase
    tracking-[0.3em]
    text-[#0A3D91]
    shadow-md
  "
>
  {player.faiId}
</pre> <br />
       

            </div>

            <div className="flex items-center sm:justify-end">
              
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap
                ${player.requestStatus === "Accepted"
                    ? "bg-green-600 text-white"
                    : player.requestStatus === "Rejected"
                      ? "bg-red-500 text-white"
                      : "bg-yellow-500 text-black"
                  }`}
              >
                {player.requestStatus}
              </span>
              <br />

            </div>

          </div>

          {/* REJECTION REASON */}

          {player.requestStatus === "Rejected" &&
            player.rejectionReason && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-4 sm:mx-6 mt-6 rounded">

                <p className="font-bold">
                  Registration Rejected
                </p>

                <p className="break-words">
                  {player.rejectionReason}
                </p>

              </div>
            )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 sm:p-6">

            {/* LEFT SECTION */}

            <div className="space-y-4">

              <img
                src={player.photoURL}
                alt="Player"
                className="w-full aspect-[4/5] object-cover rounded-xl shadow-md"
              />

              <div className="bg-purple-100 p-4 rounded-lg text-center">

                <h3 className="font-bold text-purple-700">

                  Event

                </h3>

                <p className="text-lg font-semibold">

                  {player.event}

                </p>

              </div>

              <div className="bg-purple-100 p-4 rounded-lg text-center">

                <h3 className="font-bold text-purple-700">

                  Total Tournaments Played

                </h3>

                <p className="text-2xl font-bold text-purple-800">

                  {totalTournamentsPlayed}

                </p>

              </div>

              {/* Upcoming tournaments */}

              <div className="bg-gray-50 p-4 rounded-lg shadow">

                <h2 className="text-lg font-bold text-purple-700 mb-3">

                  Upcoming Tournaments

                </h2>

                <ul className="space-y-2">

                  {upcomingTournaments.map((tournament) => (

                    <li
                      key={tournament.id}
                      className="p-3 bg-white shadow rounded-md flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
                    >

                      <span className="font-medium">

                        {tournament.title}

                      </span>

                      <span className="text-sm text-gray-500 whitespace-nowrap">

                        {tournament.date}

                      </span>

                    </li>

                  ))}

                </ul>

              </div>

              {/* Logout */}

              <div className="flex justify-center pt-6 sm:pt-10">

                <button
                  onClick={HandleLogout}
                  className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-8 rounded inline-flex items-center justify-center gap-2 transition"
                >

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#007aff"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                    <path d="M9 12h12l-3 -3" />
                    <path d="M18 15l3 -3" />
                  </svg>

                  <span>

                    Logout

                  </span>

                </button>

              </div>

            </div>
            {/* RIGHT SECTION */}

            <div className="md:col-span-2 space-y-6">

              {/* Personal Info */}

              <div className="bg-purple-600 text-white p-4 sm:p-6 rounded-lg">

                <h2 className="text-xl sm:text-2xl font-bold mb-4">

                  Personal Information

                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm sm:text-base">

                  <div className="space-y-2">

                    <p className="break-words">
                      <span className="font-semibold">
                        Gender:
                      </span>{" "}
                      {player.gender}
                    </p>

                    <p className="break-words">
                      <span className="font-semibold">
                        DOB:
                      </span>{" "}
                      {new Date(
                        player.dob
                      ).toLocaleDateString()}
                    </p>

                    <p className="break-words">
                      <span className="font-semibold">
                        Phone:
                      </span>{" "}
                      {player.phone}
                    </p>

                    <p className="break-words">
                      <span className="font-semibold">
                        Address:
                      </span>{" "}
                      {player.address.addressLine1}
                    </p>

                  </div>

                  <div className="space-y-2">

                    <p className="break-all">
                      <span className="font-semibold">
                        Email:
                      </span>{" "}
                      {player.email}
                    </p>

                    <p className="break-words">
                      <span className="font-semibold">
                        Institute:
                      </span>{" "}
                      {player.institute}
                    </p>

                    <p className="break-words">
                      <span className="font-semibold">
                        Pincode:
                      </span>{" "}
                      {player.address.pincode}
                    </p>
                    <p className="break-words">
                      <span className="font-semibold">
                        MFA Id :
                      </span>{" "}
                      {player.mfaId}
                    </p>

                  </div>

                </div>

              </div>

              {/* Aadhaar */}

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">

  <div className="flex items-center justify-between">

    <div className="flex items-center gap-4">

      <div className="h-11 w-11 rounded-xl bg-violet-100 flex items-center justify-center">

        <FileBadge2
          size={20}
          className="text-violet-700"
        />

      </div>

      <div>

        <h2 className="text-xl font-bold text-slate-900">
          Aadhaar Card
        </h2>

        <p className="text-sm text-slate-500">
          Identity verification document
        </p>

      </div>

    </div>

    <button
      onClick={() => setShowAadhar(true)}
      className="flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 transition px-5 py-2.5 text-sm font-medium text-white"
    >

      <Eye size={18} />

      Preview

    </button>

  </div>

</div>

              {
                player.requestStatus !== "Rejected" ? (
                  <>

                    <ResultsSection
                      title="Individual Results"
                      description="View and download certificates earned in individual events."
                      results={individualResults}
                      color="purple"
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

                  <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-red-100 text-center">

                    <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-3">

                      Profile Requires Correction

                    </h2>

                    <p className="text-gray-600 mb-6 leading-7">

                      Your registration was rejected. Update the required
                      information and submit your profile again.

                    </p>

                    <button
                      onClick={() =>
                        navigate(`/player/edit/${player._id}`)
                      }
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                    >

                      Edit Profile

                    </button>

                  </div>

                )
              }

            </div>

          </div>

        </div>

        {showCertificate && (
          <div
            onClick={() => setShowCertificate(false)}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex justify-center items-start pt-28 px-4 pb-6"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-6xl h-[82vh] rounded-2xl overflow-hidden bg-white shadow-[0_25px_60px_rgba(0,0,0,0.45)] border border-gray-200 flex flex-col"
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
  )
}

export default DesktopProfile
