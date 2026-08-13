import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, ArrowRight, LockKeyhole } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { api } from "../../components/api";

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");

    if (!formData.username.trim()) {
      setErrorMessage("Please enter your admin username.");
      return;
    }

    if (!formData.password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/admin/login", formData);

      login(res.data.user);

      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Admin Login Error:", error);

      if (error.response) {
        setErrorMessage(
          error.response.data.message ||
            "Invalid username or password."
        );
      } else if (error.request) {
        setErrorMessage(
          "Unable to connect to the server. Please check your connection."
        );
      } else {
        setErrorMessage(
          error.message || "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(105vh-110px)] items-center justify-center overflow-hidden bg-[#07111F] px-4 py-4 sm:px-6">

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Top left glow */}
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />

        {/* Bottom right glow */}
        <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-blue-500/15 blur-3xl" />

        {/* Center glow */}
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/5 blur-3xl" />

        {/* Decorative ring */}
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/5" />

      </div>

      {/* =====================================================
          LOGIN CARD
      ====================================================== */}

      <div className="relative w-full max-w-md">

        <div className="rounded-3xl border border-blue-400/10 bg-[#0D1A2B]/95 px-5 py-6 shadow-2xl shadow-black/50 backdrop-blur-xl sm:px-7 sm:py-7">

          {/* =================================================
              HEADER
          ================================================== */}

          <div className="mb-6 text-center">

            {/* Security Icon */}

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 shadow-lg shadow-blue-950/20">

              <ShieldCheck
                size={32}
                className="text-blue-400"
              />

            </div>

            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-blue-400">
              All Star Fencing Club
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Admin Portal
            </h1>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Secure access to club administration.
            </p>

          </div>

          {/* =================================================
              ERROR
          ================================================== */}

          {errorMessage && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-3 text-xs text-red-300"
            >

              <svg
                className="mt-0.5 h-4 w-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                />

                <line
                  x1="12"
                  y1="8"
                  x2="12"
                  y2="12"
                />

                <line
                  x1="12"
                  y1="16"
                  x2="12.01"
                  y2="16"
                />
              </svg>

              <span>{errorMessage}</span>

            </div>
          )}

          {/* =================================================
              FORM
          ================================================== */}

          <form
            onSubmit={handleSubmit}
            noValidate
          >

            {/* Username */}

            <div className="mb-4">

              <label
                htmlFor="username"
                className="mb-1.5 block text-xs font-medium text-slate-200"
              >
                Admin Username
              </label>

              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                placeholder="Enter your username"
                autoComplete="username"
                required
                onChange={handleChange}
                className="w-full rounded-xl border border-blue-400/10 bg-[#07111F]/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/70 focus:bg-[#07111F] focus:ring-4 focus:ring-blue-500/10"
              />

            </div>

            {/* Password */}

            <div className="mb-5">

              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-medium text-slate-200"
              >
                Password
              </label>

              <div className="relative">

                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  onChange={handleChange}
                  className="w-full rounded-xl border border-blue-400/10 bg-[#07111F]/70 px-4 py-3 pr-11 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/70 focus:bg-[#07111F] focus:ring-4 focus:ring-blue-500/10"
                />

                <LockKeyhole
                  size={17}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-600"
                />

              </div>

            </div>

            {/* Security Note */}

            <div className="mb-5 flex gap-2.5 rounded-xl border border-blue-400/10 bg-blue-500/5 px-3 py-2.5">

              <ShieldCheck
                size={17}
                className="mt-0.5 shrink-0 text-blue-400"
              />

              <p className="text-[10px] leading-4 text-slate-400">
                This area is restricted to authorized All Star Fencing
                Club administrators.
              </p>

            </div>

            {/* Login Button */}

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:bg-blue-500 hover:shadow-blue-500/30 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-30"
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="3"
                    />

                    <path
                      d="M21 12a9 9 0 0 0-9-9"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>

                  Signing In...
                </>
              ) : (
                <>
                  Sign In

                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </>
              )}

            </button>

          </form>

          {/* =================================================
              DIVIDER
          ================================================== */}

          <div className="my-5 flex items-center gap-3">

            <div className="h-px flex-1 bg-blue-400/10" />

            <span className="text-[10px] uppercase tracking-widest text-slate-600">
              or
            </span>

            <div className="h-px flex-1 bg-blue-400/10" />

          </div>

          {/* Player Login */}

          <p className="text-center text-xs text-slate-500">

            Not an admin?{" "}

            <Link
              to="/player/login"
              className="font-semibold text-blue-400 transition-colors hover:text-blue-300 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              Player Login
            </Link>

          </p>

        </div>

        {/* Bottom branding */}

        <p className="mt-3 text-center text-[10px] tracking-wide text-slate-600">
          All Star Fencing Club • Administration
        </p>

      </div>

    </div>
  );
};

export default AdminLogin;