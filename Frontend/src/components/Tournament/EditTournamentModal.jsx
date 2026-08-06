import { useState, useMemo } from "react";
import { api } from "../api";
import toast from "react-hot-toast";

const EditTournamentModal = ({ tournament, onClose, refresh }) => {
  // 🔹 Original Data (for comparison)
  const originalData = useMemo(
    () => ({
      title: tournament.title || "",
      locationState: tournament.locationState || "",
      startingDate: tournament.startingDate?.slice(0, 10) || "",
      endDate: tournament.endDate?.slice(0, 10) || "",
      status: tournament.status || "",
    }),
    [tournament]
  );

  // 🔹 Form State
  const [formData, setFormData] = useState(originalData);
  const [loading, setLoading] = useState(false);
  // 🔹 Handle Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Get only changed fields
  const getChangedFields = () => {
    const updatedFields = {};

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== originalData[key]) {
        updatedFields[key] = formData[key];
      }
    });

    return updatedFields;
  };

  // 🔹 Check if anything changed
  const hasChanges = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  }, [formData, originalData]);

  // 🔹 Submit
  const handleSubmit = async (e) => {
  e.preventDefault();

  const updatedData = getChangedFields();

  if (Object.keys(updatedData).length === 0) {
    toast("No changes made");
    return;
  }

  try {
    setLoading(true);
    const res = await api.put(`/tournament/${tournament._id}`, updatedData);
    toast.success("Tournament updated successfully");

    await refresh();
    onClose();
  } catch (err) {
    console.error("❌ API Error", err);
    toast.error(err.response?.data?.message || "Failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-slate-800 p-6 rounded-xl w-100 text-white">
        <h2 className="text-xl mb-4">Edit Tournament</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Tournament Name */}
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 bg-slate-700 rounded"
            placeholder="Tournament Name"
          />

          {/* Location */}
          <input
            name="locationState"
            value={formData.locationState}
            onChange={handleChange}
            className="w-full p-2 bg-slate-700 rounded"
            placeholder="Location"
          />

          {/* Start Date */}
          <input
            type="date"
            name="startingDate"
            value={formData.startingDate}
            onChange={handleChange}
            className="w-full p-2 bg-slate-700 rounded"
          />

          {/* End Date */}
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full p-2 bg-slate-700 rounded"
          />

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="bg-gray-500 px-3 py-1 rounded disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!hasChanges || loading}
              className={`px-4 py-2 rounded flex items-center justify-center min-w-[110px] transition ${hasChanges && !loading
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gray-500 cursor-not-allowed"
                }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="opacity-25"
                    />
                    <path
                      fill="currentColor"
                      className="opacity-75"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTournamentModal;