import { useState } from "react";
import axios from "axios";

const AddTournament = () => {

  const [formData, setFormData] = useState({
    tournamentName: "",
    category: "",
    weapon: "",
    level: "",
    location: "",
    startDate: "",
    endDate: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await axios.post(
        "http://localhost:5050/admin/tournament",
        formData,
        { withCredentials: true }
      );

      alert("Tournament added successfully");

      setFormData({
        tournamentName: "",
        category: "",
        weapon: "",
        level: "",
        location: "",
        startDate: "",
        endDate: ""
      });

    } catch (error) {
      console.log(error);
      alert("Error creating tournament");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-xl">

      <h2 className="text-2xl font-semibold mb-4">
        Add Tournament
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="tournamentName"
          placeholder="Tournament Name"
          value={formData.tournamentName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="weapon"
          placeholder="Weapon"
          value={formData.weapon}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="level"
          placeholder="Level (District / State / National)"
          value={formData.level}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          className="bg-slate-900 text-white px-4 py-2 rounded w-full hover:bg-slate-800"
        >
          Add Tournament
        </button>

      </form>

    </div>
  );
};

export default AddTournament;