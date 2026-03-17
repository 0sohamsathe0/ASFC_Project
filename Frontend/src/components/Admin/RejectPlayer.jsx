const RejectPlayer = ({ showModal, setShowModal, rejectReason, setRejectReason, handleReject }) => {
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
            className="px-4 py-1 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleReject}
            className="bg-red-500 text-white px-4 py-1 rounded"
          >
            Reject Player
          </button>

        </div>

      </div>
    </div>
  );
};

export default RejectPlayer;