import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: ""
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

      const res = await axios.post(
        "http://localhost:5050/admin/login",
        formData,
        { withCredentials: true }
      );

      const token = res.data.token;
// to do-------
// store token in cookie/localStorage

      document.cookie = `adminToken=${token};`;
      alert("Admin Login Successful");

      navigate("/admin/dashboard");

    } catch (error) {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">

      <div className="bg-white p-8 rounded-lg shadow-lg w-96">

        <h2 className="text-2xl font-bold text-center mb-6">
          Admin Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="name"
            name="username"
            placeholder="Admin username"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />

          <button
            className="w-full bg-slate-900 text-white py-2 rounded hover:bg-slate-800"
          >
            Login
          </button>

        </form>

        <p className="text-center text-sm mt-4 text-gray-600">
          Not an admin?{" "}
          <a
            href="/player/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Player Login
          </a>
        </p>

      </div>

    </div>
  );
};

export default AdminLogin;