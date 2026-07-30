import { CircularProgress } from "@mui/material";

const RejectPlayer = ({ showModal, setShowModal, rejectReason, setRejectReason, handleReject, isLoading }) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">

      <div className="bg-white p-6 rounded-lg w-96">

        <h2 className="text-xl font-semibold mb-4">
          Reject Player
        </h2>

        <textarea
          placeholder="Write rejection reason..."
          className="w-full border p-2 rounded mb-4"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />

        <div className="flex justify-end gap-3">

          <button
            onClick={() => setShowModal(false)}
            disabled={isLoading}
            className="px-4 py-1 border rounded disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleReject}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-4 py-1 rounded flex items-center justify-center min-w-[140px]"
          >
            {isLoading ? (
              <>
                <CircularProgress
                  size={18}
                  sx={{
                    color: "white",
                    mr: 1,
                  }}
                />
                Rejecting...
              </>
            ) : (
              "Reject Player"
            )}
          </button>

        </div>

      </div>
    </div>
  );
};

export default RejectPlayer;