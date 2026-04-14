import { useState, useMemo } from "react";
import axios from "axios";

const EditTournamentModal = ({ tournament, onClose, refresh }) => {
  // 🔹 Get token
  const adminToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("adminToken="))
    ?.split("=")[1];

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
      alert("No changes made");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5050/tournament/${tournament._id}`,
        updatedData,
        {
          headers: {
            authorization: `Bearer ${adminToken}`,
          },
        }
      );

      refresh();
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-slate-800 p-6 rounded-xl w-[400px] text-white">
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
              className="bg-gray-500 px-3 py-1 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!hasChanges}
              className={`px-3 py-1 rounded ${
                hasChanges
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gray-500 cursor-not-allowed"
              }`}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTournamentModal;