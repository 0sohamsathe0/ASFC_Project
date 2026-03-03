import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [aadharCard, setAadharCard] = useState("");
  const [dob, setDob] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Aadhar Card:", aadharCard);
    const inputDob = new Date(dob).toISOString().split("T")[0];
    console.log("Date of Birth:", inputDob);


    try {
      const response = await axios.post("http://localhost:5050/player/login", {
        aadharCard,
        dob: inputDob,
      },{
        withCredentials: true,
      });

      // If backend returns player data
      if (response.data) {
        console.log(response.data.data);
        alert("Login Successful");

        document.cookie = `_id=${response.data.data}; path=/; max-age=${7 * 24 * 60 * 60}`;
        
        // Save player data in localStorage
        //localStorage.setItem("player", JSON.stringify(response.data));

        // Redirect to profile page
       navigate("/profile");
      }
    } catch (error) {
      alert("Invalid Credentials");
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Player Login
        </h2>

        <input
          type="text"
          placeholder="Aadhar Card"
          value={aadharCard}
          onChange={(e) => setAadharCard(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="w-full mb-6 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;