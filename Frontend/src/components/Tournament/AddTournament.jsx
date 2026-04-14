import { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";

const AddTournament = () => {
  const [date, setDate] = useState(new Date());
  const [upcomingTournaments, setUpcomingTournaments] = useState([]);
  const [hovered, setHovered] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    startingDate: "",
    endDate: "",
    locationState: "",
    locationCity: "",
    level: "",
    ageCategory: "",
  });

  // ✅ Fetch tournaments
  useEffect(() => {
    const fetchUpcomingTournaments = async () => {
      try {
        const adminToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("adminToken="))
          ?.split("=")[1];

        const res = await axios.get(
          "http://localhost:5050/tournament?type=upcoming",
          {
            headers: {
              authorization: `Bearer ${adminToken}`,
            },
          }
        );

        setUpcomingTournaments(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUpcomingTournaments();
  }, []);

  // ✅ Handle form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const categoryToAgeMap = {
        U10: 10,
        U12: 12,
        U14: 14,
        U17: 17,
        U19: 19,
        OPEN: 65,
      };

      const finalData = {
        ...formData,
        ageCategory: categoryToAgeMap[formData.ageCategory],
      };

      const adminToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("adminToken="))
        ?.split("=")[1];

      await axios.post("http://localhost:5050/tournament", finalData, {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      });

      alert("Tournament Created");

      setFormData({
        title: "",
        startingDate: "",
        endDate: "",
        locationState: "",
        locationCity: "",
        level: "",
        ageCategory: "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Range logic
  const getTileClass = (date) => {
    for (let t of upcomingTournaments) {
      const d = new Date(date).setHours(0, 0, 0, 0);
      const start = new Date(t.startingDate).setHours(0, 0, 0, 0);
      const end = new Date(t.endDate).setHours(0, 0, 0, 0);

      if (d === start) return "range-start";
      if (d === end) return "range-end";
      if (d > start && d < end) return "range-middle";
    }
  };

  return (
    <div className="min-h-screen bg-blue-500 p-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* LEFT FORM */}
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
              name="ageCategory"
              value={formData.ageCategory}
              onChange={handleChange}
              className="border p-3 rounded-md"
            >
              <option value="">Select Category</option>
              <option value="U10">U10</option>
              <option value="U12">U12</option>
              <option value="U14">U14</option>
              <option value="U17">U17</option>
              <option value="U19">U19</option>
              <option value="OPEN">OPEN</option>
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

            <button className="bg-blue-900 text-white p-3 rounded-md">
              Add Tournament
            </button>
          </form>
        </div>

        {/* RIGHT CALENDAR */}
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-6">
            Tournament Calendar
          </h2>

          <Calendar
            onChange={setDate}
            value={date}
            tileClassName={({ date, view }) =>
              view === "month" ? getTileClass(date) : null
            }
            tileContent={({ date, view }) => {
              if (view === "month") {
                const matches = upcomingTournaments.filter((t) => {
                  const d = new Date(date).setHours(0, 0, 0, 0);
                  const s = new Date(t.startingDate).setHours(0, 0, 0, 0);
                  const e = new Date(t.endDate).setHours(0, 0, 0, 0);
                  return d >= s && d <= e;
                });

                if (matches.length > 0) {
                  return (
                    <div
                      onMouseEnter={() =>
                        setHovered({ date, matches })
                      }
                      onMouseLeave={() => setHovered(null)}
                      className="h-2 w-2 bg-red-500 rounded-full mx-auto mt-1 cursor-pointer"
                    ></div>
                  );
                }
              }
            }}
          />

          {/* TOOLTIP */}
          {hovered && (
            <div className="mt-4 p-3 bg-gray-100 rounded shadow">
              <p className="font-semibold">
                {new Date(hovered.date).toDateString()}
              </p>
              {hovered.matches.map((t) => (
                <p key={t._id}>• {t.title}</p>
              ))}
            </div>
          )}

          {/* LIST */}
          <h3 className="mt-6 font-semibold">
            Upcoming Tournaments
          </h3>

          <div className="mt-3 space-y-3">
            {upcomingTournaments.map((t) => (
              <div key={t._id} className="border p-3 rounded-md">
                <p className="font-bold">{t.title}</p>
                <p>U{t.ageCategory}</p>
                <p className="text-sm text-gray-500">
                  {new Date(t.startingDate).toDateString()}
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