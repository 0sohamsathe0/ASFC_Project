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

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-xl bg-white p-6 rounded shadow">

      <h2 className="text-2xl font-semibold mb-4">
        Add Tournament
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="tournamentName"
          placeholder="Tournament Name"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <input
          type="text"
          name="weapon"
          placeholder="Weapon"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <input
          type="text"
          name="level"
          placeholder="Level"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <input
          type="date"
          name="startDate"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <input
          type="date"
          name="endDate"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Add Tournament
        </button>

      </form>

    </div>
  );
};

export default AddTournament;