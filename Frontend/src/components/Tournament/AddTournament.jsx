import { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const AddTournament = () => {

  const [date, setDate] = useState(new Date());
  const [upcomingTournaments, setUpcomingTournaments]=useState([])

  const [formData, setFormData] = useState({
    title: "",
    startingDate: "",
    endDate: "",
    locationState: "",
    locationCity: "",
    level: "",
    ageCategory: ""
  });

  // Static tournaments (temporary)
  useEffect(()=>{
    const fetchUpcomingTournaments = async()=>{
     const adminToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("adminToken="))
        ?.split("=")[1];

    const tournaments = await axios.get("http://localhost:5050/tournament?type=upcoming",{
      headers: {
            authorization: `Bearer ${adminToken}`,
          },
    })
    console.log(tournaments.data)
    setUpcomingTournaments(tournaments.data)
  }
  fetchUpcomingTournaments()
  },[])
  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const categoryToAgeMap = {
        U10: 10,
        U12: 12,
        U14: 14,
        U17: 17,
        U19: 19,
        OPEN: 65
      };
      const mappedAgeCategory = categoryToAgeMap[formData.category];

      const finalData = {
        ...formData,
        ageCategory: mappedAgeCategory
      };

      console.log(finalData);

      const adminToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("adminToken="))
        ?.split("=")[1];

      const responce = await axios.post(
        "http://localhost:5050/tournament",
        finalData,
        {
          headers: {
            authorization: `Bearer ${adminToken}`,
          },
        }
      );

      alert("Tournament Created",responce);

      setFormData({
        title: "",
        startingDate: "",
        endDate: "",
        locationState: "",
        locationCity: "",
        level: "",
        ageCategory: ""
      });

    } catch (error) {
      console.log(error);
    }
  };



  return (

    <div className="min-h-screen bg-blue-500 p-10">

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* LEFT SIDE FORM */}

        <div className="bg-white p-8 rounded-xl shadow-md">

          <h2 className="text-2xl font-semibold mb-6">
            Add Tournament
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <input
              type="text"
              name="title"
              placeholder="Tournament Name"
              value={formData.title}
              onChange={handleChange}
              className="border p-3 rounded-md"
            />

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="border p-3 rounded-md"
            >
              <option value="">Select Category</option>
              <option value="U10">U10</option>
              <option value="U12">U12</option>
              <option value="U14">U14</option>
              <option value="U17">U17</option>
              <option value="U19">U19</option>
              <option value="Open">OPEN</option>
            </select>

            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="border p-3 rounded-md"
            >
              <option value="">Level</option>
              <option value="District">District</option>
              <option value="State">State</option>
              <option value="National">National</option>
            </select>

            <input
              type="text"
              name="locationState"
              placeholder="State"
              value={formData.locationState}
              onChange={handleChange}
              className="border p-3 rounded-md"
            />

            <input
              type="text"
              name="locationCity"
              placeholder="City"
              value={formData.locationCity}
              onChange={handleChange}
              className="border p-3 rounded-md"
            />

            <input
              type="date"
              name="startingDate"
              value={formData.startingDate}
              onChange={handleChange}
              className="border p-3 rounded-md"
            />

            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="border p-3 rounded-md"
            />

            <button
              type="submit"
              className="bg-blue-900 text-white p-3 rounded-md hover:bg-blue-800 transition"
            >
              Add Tournament
            </button>

          </form>

        </div>

        {/* RIGHT SIDE CALENDAR */}

        <div className="bg-white p-8 rounded-xl shadow-md">

          <h2 className="text-xl font-semibold mb-6">
            Tournament Calendar
          </h2>

          <Calendar
            onChange={setDate}
            value={date}
          />

          {/* UPCOMING TOURNAMENTS */}

          <h3 className="mt-6 font-semibold">
            Upcoming Tournaments
          </h3>

          <div className="mt-3 space-y-3">

            {upcomingTournaments?.map((tournament) => (

              <div
                key={tournament._id}
                className="border p-3 rounded-md shadow-sm"
              >

                <p className="font-bold">
                  {tournament.title}
                </p>
                <p className="font-medium">Category : U{tournament.ageCategory}</p>

                <p className="text-sm text-gray-500">
                  {tournament.locationCity} <br />{new Date(tournament.startingDate).toLocaleDateString()}
                </p>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
};

export default AddTournament;