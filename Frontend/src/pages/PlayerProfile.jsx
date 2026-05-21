import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlayerProfile = () => {
  const [player, setPlayer] = useState(null);
  const [showAadhar, setShowAadhar] = useState(false);

  const navigate = useNavigate();

  const totalTournamentsPlayed = 12;

  const upcomingTournaments = [
    {
      id: 1,
      title: "District Fencing Championship 2026",
      date: "15 April 2026",
    },
    {
      id: 2,
      title: "State Level Epee Tournament",
      date: "10 May 2026",
    },
  ];

  const meritCertificates = [
    {
      id: 1,
      tournament: "Inter-School Championship 2025",
      link: "#",
    },
    {
      id: 2,
      tournament: "District Gold Medal Event",
      link: "#",
    },
  ];

  const participationCertificates = [
    {
      id: 1,
      tournament: "State Level Fencing Cup 2025",
      link: "#",
    },
    {
      id: 2,
      tournament: "National Open Championship",
      link: "#",
    },
  ];

  const HandleLogout = () => {
    document.cookie =
      "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    alert("Logged out successfully");
    navigate("/player/login");
  };

  useEffect(() => {
    async function fetchProfile() {
      try {
        const cookies = document.cookie.split("; ");

        let token = cookies.find((cookie) =>
          cookie.startsWith("token=")
        );

        token = token ? token.split("=")[1] : null;

        if (!token) {
          alert("Please login first");
          navigate("/player/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:5050/player/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPlayer(response.data.player);
      } catch (err) {
        console.log("Profile Error:", err);
      }
    }

    fetchProfile();
  }, []);

  if (!player) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">

          {/* HEADER */}
          <div className="bg-purple-700 text-white p-6 flex justify-between items-center">

            <h1 className="text-2xl md:text-3xl font-bold uppercase">
              {player.fullName}
            </h1>

            <div className="flex items-center gap-3">

              <span
                className={`px-4 py-1 rounded-full text-sm font-semibold
                ${player.requestStatus === "Accepted"
                    ? "bg-green-400 text-black"
                    : player.requestStatus === "Rejected"
                      ? "bg-red-400 text-black"
                      : "bg-yellow-400 text-black"
                  }
              `}
              >
                {player.requestStatus}
              </span>

            </div>
          </div>

          {/* REJECTION REASON */}
          {player.requestStatus === "Rejected" &&
            player.rejectionReason && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-6 mt-6 rounded">
                <p className="font-bold">
                  Registration Rejected
                </p>

                <p>{player.rejectionReason}</p>
              </div>
            )}

          <div className="grid md:grid-cols-3 gap-6 p-6">

            {/* LEFT SECTION */}
            <div className="space-y-4">

              <img
                src={player.photoURL}
                alt="Player"
                className="w-full rounded-lg shadow-md object-cover"
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
                      className="p-3 bg-white shadow rounded-md flex justify-between"
                    >
                      <span>{tournament.title}</span>

                      <span className="text-sm text-gray-500">
                        {tournament.date}
                      </span>
                    </li>
                  ))}
                </ul>

              </div>

              {/* Logout */}

              <div className="flex justify-center pt-10">

                <button
                  onClick={HandleLogout}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-8 rounded inline-flex items-center"
                >

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
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

                  <span>Logout</span>

                </button>

              </div>
            </div>

            {/* RIGHT SECTION */}

            <div className="md:col-span-2 space-y-6">

              {/* Personal Info */}

              <div className="bg-purple-600 text-white p-4 rounded-lg">

                <h2 className="text-xl font-bold mb-3">
                  Personal Information
                </h2>

                <div className="grid md:grid-cols-2 gap-4 text-sm">

                  <div>

                    <p>
                      <span className="font-semibold">
                        Gender:
                      </span>{" "}
                      {player.gender}
                    </p>

                    <p>
                      <span className="font-semibold">
                        DOB:
                      </span>{" "}
                      {new Date(
                        player.dob
                      ).toLocaleDateString()}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Phone:
                      </span>{" "}
                      {player.phone}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Address:
                      </span>{" "}
                      {player.address.addressLine1}
                    </p>

                  </div>

                  <div>

                    <p>
                      <span className="font-semibold">
                        Email:
                      </span>{" "}
                      {player.email}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Institute:
                      </span>{" "}
                      {player.institute}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Pincode:
                      </span>{" "}
                      {player.address.pincode}
                    </p>

                  </div>

                </div>

              </div>

              {/* Aadhaar */}

              <div className="bg-white p-8 rounded-2xl shadow-lg">

                <div className="flex justify-between items-center">

                  <div>

                    <h2 className="text-2xl font-bold">
                      Aadhaar Card
                    </h2>

                    <p className="text-sm text-gray-500">
                      Identity verification
                    </p>

                  </div>

                  <button
                    onClick={() => setShowAadhar(true)}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
                  >
                    Preview Aadhaar
                  </button>

                </div>

              </div>

              {
                player.requestStatus !== "Rejected" ? (
                  <>
                    {/* ================= MERIT CERTIFICATES ================= */}

                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">

                      <div className="flex justify-between items-center mb-8">

                        <div>
                          <h2 className="text-2xl font-bold text-gray-800">
                            Merit Certificates
                          </h2>

                          <p className="text-sm text-gray-500 mt-1">
                            Certificates awarded based on performance & rankings
                          </p>
                        </div>

                        <div className="bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-semibold">
                          {meritCertificates.length} Records
                        </div>

                      </div>

                      <div className="overflow-x-auto rounded-xl border border-gray-200">

                        <table className="w-full text-left">

                          <thead className="bg-gradient-to-r from-purple-600 to-purple-500 text-white">
                            <tr>
                              <th className="px-6 py-4">Tournament Title</th>
                              <th className="px-6 py-4">Certificate</th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-gray-100">

                            {meritCertificates.map((cert) => (
                              <tr key={cert.id} className="hover:bg-purple-50">
                                <td className="px-6 py-5">
                                  {cert.tournament}
                                </td>

                                <td className="px-6 py-5">
                                  <a
                                    href={cert.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg"
                                  >
                                    View Certificate
                                  </a>
                                </td>
                              </tr>
                            ))}

                          </tbody>

                        </table>

                      </div>

                    </div>


                    {/* ================= PARTICIPATION CERTIFICATES ================= */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mt-10">
                      {/* Section Header */}
                      <div className="flex justify-between items-center mb-8">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-800">
                            Participation Certificates
                          </h2>
                          <p className="text-sm text-gray-500 mt-1">
                            Certificates received for tournament participation
                          </p>
                        </div>

                        <div className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold">
                          {participationCertificates.length} Records
                        </div>
                      </div>

                      {/* Table Container */}
                      <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="w-full text-left">
                          {/* Table Head */}
                          <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white sticky top-0 z-10">
                            <tr>
                              <th className="px-6 py-4 text-sm uppercase tracking-wider font-semibold">
                                Tournament Title
                              </th>
                              <th className="px-6 py-4 text-sm uppercase tracking-wider font-semibold">
                                Certificate
                              </th>
                            </tr>
                          </thead>

                          {/* Table Body */}
                          <tbody className="divide-y divide-gray-100 bg-white">
                            {participationCertificates.map((cert) => (
                              <tr
                                key={cert.id}
                                className="hover:bg-blue-50 transition duration-300 ease-in-out"
                              >
                                <td className="px-6 py-5 text-gray-800 font-medium text-sm">
                                  {cert.tournament}
                                </td>

                                <td className="px-6 py-5">
                                  <a
                                    href={cert.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm hover:bg-blue-700 hover:shadow-md transition-all duration-300"
                                  >
                                    View Certificate
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100 text-center">

                    <h2 className="text-2xl font-bold text-red-600 mb-3">
                      Profile Requires Correction
                    </h2>

                    <p className="text-gray-600 mb-6">
                      Your registration was rejected. Update the required information and submit your profile again.
                    </p>

                    {
                      (
                        <button
                          onClick={() =>
                            navigate(`/player/edit/${player._id}`)
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
                        >
                          Edit Profile
                        </button>
                      )
                    }

                  </div>
                )
              }

            </div>

          </div>
        </div>

        {/* Aadhaar Modal */}

        {showAadhar && (
          <div
            onClick={() => setShowAadhar(false)}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-3xl w-full relative"
            >

              <button
                onClick={() => setShowAadhar(false)}
                className="absolute top-4 right-4"
              >
                ✕
              </button>

              <img
                src={player.aadharCardURL}
                alt="Aadhaar"
                className="rounded-xl shadow-md max-h-[70vh] object-contain"
              />

            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default PlayerProfile;