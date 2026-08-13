import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import RejectPlayer from "../Admin/RejectPlayer.jsx";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

function PlayerRequestQueue() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [loadingPlayerId, setLoadingPlayerId] = useState(null);
  const [loadingAction, setLoadingAction] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleApprove = (playerId) => async () => {
    try {
      setLoadingPlayerId(playerId);
      setLoadingAction("approve");

      const res = await api.patch(
        `/admin/acceptPlayer/${playerId}`
      );

      // Remove immediately from pending list
      setPlayers((prev) =>
        prev.filter((player) => player._id !== playerId)
      );

      setSnackbar({
        open: true,
        severity: res.data.emailSent ? "success" : "warning",
        message:
          res.data.message ||
          (res.data.emailSent
            ? "Player accepted and confirmation email sent."
            : "Player accepted, but confirmation email could not be sent."),
      });

    } catch (err) {
      setSnackbar({
        open: true,
        severity: "error",
        message:
          err.response?.data?.message ||
          "Unable to approve player.",
      });
    } finally {
      setLoadingPlayerId(null);
      setLoadingAction("");
    }
  };

  const handleReject = async () => {
    if (!selectedPlayer) return;

    try {
      setLoadingPlayerId(selectedPlayer._id);
      setLoadingAction("reject");

      const res = await api.patch(
        "/admin/rejectPlayer",
        {
          playerId: selectedPlayer._id,
          reason: rejectReason,
        }
      );

      // Remove immediately from pending list
      setPlayers((prev) =>
        prev.filter(
          (player) => player._id !== selectedPlayer._id
        )
      );

      setSnackbar({
        open: true,
        severity: res.data.emailSent ? "success" : "warning",
        message:
          res.data.message ||
          (res.data.emailSent
            ? "Player rejected and notification email sent."
            : "Player rejected, but notification email could not be sent."),
      });

      setShowModal(false);
      setRejectReason("");
      setSelectedPlayer(null);

    } catch (err) {
      setSnackbar({
        open: true,
        severity: "error",
        message:
          err.response?.data?.message ||
          "Unable to reject player.",
      });
    } finally {
      setLoadingPlayerId(null);
      setLoadingAction("");
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await api.get("/admin/getPendingPlayers");

      setPlayers(res.data.data);
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
                  <a
                    href={player?.photoURL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
                  <button
                    disabled={loadingPlayerId === player._id}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-1 rounded-md text-sm flex items-center justify-center min-w-[110px]"
                    onClick={handleApprove(player._id)}
                  >
                    {loadingPlayerId === player._id &&
                      loadingAction === "approve" ? (
                      <>
                        <CircularProgress
                          size={16}
                          sx={{ color: "white", mr: 1 }}
                        />
                        Approving...
                      </>
                    ) : (
                      "Approve"
                    )}
                  </button>

                  <button
                    disabled={loadingPlayerId === player._id}
                    className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-1 rounded-md text-sm flex items-center justify-center min-w-[110px]"
                    onClick={() => {
                      setSelectedPlayer(player);
                      setShowModal(true);
                    }}
                  >
                    {loadingPlayerId === player._id &&
                      loadingAction === "reject" ? (
                      <>
                        <CircularProgress
                          size={16}
                          sx={{ color: "white", mr: 1 }}
                        />
                        Rejecting...
                      </>
                    ) : (
                      "Reject"
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <RejectPlayer
        showModal={showModal}
        setShowModal={setShowModal}
        rejectReason={rejectReason}
        setRejectReason={setRejectReason}
        handleReject={handleReject}
        isLoading={
          loadingPlayerId === selectedPlayer?._id &&
          loadingAction === "reject"
        }
      />
    </div>
  );
}

export default PlayerRequestQueue;
