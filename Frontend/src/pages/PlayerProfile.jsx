import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

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
    { id: 2, title: "State Level Epee Tournament", date: "10 May 2026" },
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

  useEffect(() => {
    async function fetchProfile() {
      const response = await axios.get("http://localhost:5050/player/profile", {
        withCredentials: true,
      });
      console.log("Profile response: ", response.data.player);
      setPlayer(response.data.player);
    }
    fetchProfile();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
          {/* HEADER */}
          <div className="bg-purple-700 text-white p-6 flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold uppercase">
              {player?.fullName}
            </h1>

            <span className="px-4 py-1 rounded-full text-sm font-semibold bg-yellow-400 text-black">
              {player?.requestStatus}
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-6 p-6">
            {/* LEFT SIDE */}
            <div className="space-y-4">
              <img
                src={player?.photoURL}
                alt="Player"
                className="w-full rounded-lg shadow-md object-cover"
              />

              <div className="bg-purple-100 p-4 rounded-lg text-center">
                <h3 className="font-bold text-purple-700">Event</h3>
                <p className="text-lg font-semibold">{player?.event}</p>
              </div>

              <div className="bg-purple-100 p-4 rounded-lg text-center">
                <h3 className="font-bold text-purple-700">
                  Total Tournaments Played
                </h3>
                <p className="text-2xl font-bold text-purple-800">
                  {totalTournamentsPlayed}
                </p>
              </div>

              {/* UPCOMING TOURNAMENTS */}
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
              
            </div>

            {/* RIGHT SIDE */}
            <div className="md:col-span-2 space-y-6">
              {/* PERSONAL INFO */}
              <div className="bg-purple-600 text-white p-4 rounded-lg">
                <h2 className="text-xl font-bold mb-3">Personal Information</h2>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p>
                      <span className="font-semibold">Gender:</span>{" "}
                      {player?.gender}
                    </p>
                    <p>
                      <span className="font-semibold">DOB:</span>{" "}
                      {new Date(player?.dob).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-semibold">Phone:</span>{" "}
                      {player?.phone}
                    </p>
                  </div>

                  <div>
                    <p>
                      <span className="font-semibold">Email:</span>{" "}
                      {player?.email}
                    </p>
                    <p>
                      <span className="font-semibold">Institute:</span>{" "}
                      {player?.institute}
                    </p>
                    <p>
                      <span className="font-semibold">Aadhar:</span>{" "}
                      {player?.aadharCard}
                    </p>
                  </div>
                </div>
              </div>

              {/* ================= AADHAAR CARD SECTION ================= */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mt-10">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Aadhaar Card
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Identity verification document
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAadhar(true)}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-semibold shadow hover:bg-indigo-700 hover:shadow-md transition duration-300"
                  >
                    Preview Aadhaar
                  </button>
                </div>
              </div>

              

              {/* ================= MERIT CERTIFICATES ================= */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                {/* Section Header */}
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

                {/* Table Container */}
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-left">
                    {/* Table Head */}
                    <thead className="bg-gradient-to-r from-purple-600 to-purple-500 text-white sticky top-0 z-10">
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
                      {meritCertificates.map((cert) => (
                        <tr
                          key={cert.id}
                          className="hover:bg-purple-50 transition duration-300 ease-in-out"
                        >
                          <td className="px-6 py-5 text-gray-800 font-medium text-sm">
                            {cert.tournament}
                          </td>

                          <td className="px-6 py-5">
                            <a
                              href={cert.link}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm hover:bg-purple-700 hover:shadow-md transition-all duration-300"
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
            </div>
          </div>
        </div>
        {/* ================= AADHAAR MODAL ================= */}
        {showAadhar && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={() => setShowAadhar(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowAadhar(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl font-bold"
              >
                ✕
              </button>

              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Aadhaar Card Preview
              </h3>

              <div className="flex justify-center">
                <img
                  src={player.aadharCardURL}
                  alt="Aadhaar Card"
                  className="rounded-xl shadow-md max-h-[70vh] object-contain"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PlayerProfile;
