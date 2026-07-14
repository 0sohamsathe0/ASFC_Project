import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {api} from '../components/api.js'
const Login = () => {
  const [aadharCard, setAadharCard] = useState("");
  const [dob, setDob] = useState("");
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const inputDob = new Date(dob).toISOString().split("T")[0];

    try {
      const response = await api.post("/player/login", {
        aadharCard,
        dob: inputDob,
      });

      login(response.data.user);
      alert("Login successful");
      navigate("/player/profile");
    } catch (error) {
      console.log("Full Error:", error);

      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);
        alert(error.response.data.message);
      } else if (error.request) {
        console.log("Request made but no response:", error.request);
        alert("No response from server");
      } else {
        console.log("Error:", error.message);
        alert(error.message);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-110px)] bg-gray-100 px-4 py-8">

      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 sm:p-8"
      >

        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">

          Player Login

        </h2>

        <input
          type="text"
          placeholder="Aadhar Card"
          value={aadharCard}
          onChange={(e) => setAadharCard(e.target.value)}
          className="w-full mb-4 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
          required
        />

        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="w-full mb-6 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-medium"
        >

          Login

        </button>

        <p className="text-center mt-5 text-sm text-gray-600 leading-6">

          Are you an admin?{" "}

          <Link
            to="/admin/login"
            className="text-blue-600 font-semibold hover:underline"
          >

            Login as Admin

          </Link>

        </p>

      </form>

    </div>
  );
};

export default Login;