import React, { useState, useEffect } from "react";
import axios from "axios";

function PlayerRequestQueue() {
  const [players, setPlayers] = useState([]);

  const fetchRequests = async () => {
    try {
      const adminToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("adminToken="))
        ?.split("=")[1];

      console.log(adminToken);

      const res = await axios.get(
        "http://localhost:5050/admin/getPendingPlayers",
        {
          headers: {
            authorization: `Bearer ${adminToken}`,
          },
        },
      );

      setPlayers(res.data.data);
      console.log(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-6">
          Player Registration Requests
        </h1>
        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
          Pending: {players?.length}
        </span>
        <br />
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-gray-50 text-left">
              <th className="p-4">Photo</th>
              <th className="p-4">Name</th>
              <th className="p-4">Aadhaar Number</th>
              <th className="p-4">Aadhaar Card</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {players.map((player) => (
              <tr
                key={player?._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-4 flex items-center gap-3">
                  <a href={player?.photoURL} target="_blank" rel="noopener noreferrer">
                    <img
                      src={player?.photoURL}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </a>
                </td>
                <td className="p-4 font-medium">{player?.fullName}</td>

                <td className="p-4 text-gray-600">{player?.aadharCard}</td>

                <td className="p-4">
                  <a
                    href={player?.aadharCardURL}
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    View Document
                  </a>
                </td>

                <td className="p-4 flex gap-3">
                  <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md text-sm">
                    Approve
                  </button>

                  <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md text-sm">
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PlayerRequestQueue;
