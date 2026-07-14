import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../components/api";

const AdminLogin = () => {

  const { login } = useAuth();

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
      const res = await api.post("/admin/login", formData);

      login(res.data.user);
      alert("Admin Login Successful");

      navigate("/admin/dashboard");

    } catch (error) {
  console.error("Admin Login Error:", error);

  if (error.response) {
    alert(error.response.data.message);
  } else if (error.request) {
    alert("No response from server");
  } else {
    alert(error.message);
  }
}
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-110px)] bg-gray-100 px-4 py-8">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">

        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">

          Admin Login

        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            name="username"
            placeholder="Admin Username"
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 text-sm sm:text-base"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 text-sm sm:text-base"
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-3 rounded-lg hover:bg-slate-800 transition duration-300 font-medium"
          >

            Login

          </button>

        </form>

        <p className="text-center text-sm text-gray-600 mt-5 leading-6">

          Not an admin?{" "}

          <Link
            to="/player/login"
            className="text-blue-600 font-semibold hover:underline"
          >

            Player Login

          </Link>

        </p>

      </div>

    </div>
  );
};

export default AdminLogin;