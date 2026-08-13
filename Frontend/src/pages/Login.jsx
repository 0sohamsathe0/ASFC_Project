import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../components/api.js";
import logo from "../assets/ASFC_Logo.png";

const Login = () => {
  const [aadharCard, setAadharCard] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");

    if (aadharCard.length !== 12) {
      setErrorMessage("Please enter a valid 12-digit Aadhaar number.");
      return;
    }

    if (!dob) {
      setErrorMessage("Please select your date of birth.");
      return;
    }

    const inputDob = new Date(dob).toISOString().split("T")[0];

    setLoading(true);

    try {
      const response = await api.post("/player/login", {
        aadharCard,
        dob: inputDob,
      });

      login(response.data.user);
      navigate("/player/profile");
    } catch (error) {
      if (error.response) {
        setErrorMessage(
          error.response.data.message || "Unable to login. Please try again."
        );
      } else if (error.request) {
        setErrorMessage(
          "Unable to connect to the server. Please check your connection."
        );
      } else {
        setErrorMessage(error.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="relative flex min-h-[calc(105vh-110px)] items-center justify-center overflow-hidden bg-[#07111F] px-4 py-4 sm:px-6">

    {/* Background atmosphere */}
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl" />

      <div className="absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/5 blur-3xl" />

      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/5" />
    </div>

    <div className="relative w-full max-w-md">

      {/* Login Card */}
      <div className="rounded-3xl border border-blue-400/10 bg-[#0D1A2B]/95 px-5 py-5 shadow-2xl shadow-black/50 backdrop-blur-xl sm:px-7 sm:py-6">

        {/* Header */}
        <div className="mb-5 text-center">

          {/* Club Logo */}
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20">
            <img
              src={logo}
              alt="All Star Fencing Club Logo"
              className="h-full w-full object-contain drop-shadow-[0_0_18px_rgba(59,130,246,0.25)]"
            />
          </div>

          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-blue-400">
            All Star Fencing Club
          </p>

          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Player Portal
          </h1>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Sign in to access your player profile.
          </p>

        </div>

        {/* Error Message */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-4 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2.5 text-xs text-red-300"
          >
            <svg
              className="mt-0.5 h-4 w-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="9" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>

            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          {/* Aadhaar */}
          <div className="mb-4">

            <label
              htmlFor="aadharCard"
              className="mb-1.5 block text-xs font-medium text-slate-200"
            >
              Aadhaar Number
            </label>

            <div className="relative">

              <input
                id="aadharCard"
                name="aadharCard"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="XXXX XXXX XXXX"
                value={aadharCard.replace(
                  /(\d{4})(?=\d)/g,
                  "$1 "
                )}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 12);

                  setAadharCard(value);
                  setErrorMessage("");
                }}
                maxLength={14}
                required
                aria-describedby="aadhar-help"
                className="w-full rounded-xl border border-blue-400/10 bg-[#07111F]/70 px-4 py-3 text-sm tracking-wider text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/70 focus:bg-[#07111F] focus:ring-4 focus:ring-blue-500/10"
              />

              {aadharCard.length === 12 && (
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                  <svg
                    className="h-4 w-4 text-emerald-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
              )}

            </div>

            <p
              id="aadhar-help"
              className="mt-1 text-[10px] leading-4 text-slate-500"
            >
              Enter the 12-digit Aadhaar number registered with the club.
            </p>

          </div>

          {/* Date of Birth */}
          <div className="mb-4">

            <label
              htmlFor="dob"
              className="mb-1.5 block text-xs font-medium text-slate-200"
            >
              Date of Birth
            </label>

            <input
              id="dob"
              name="dob"
              type="date"
              value={dob}
              onChange={(e) => {
                setDob(e.target.value);
                setErrorMessage("");
              }}
              autoComplete="bday"
              required
              className="w-full rounded-xl border border-blue-400/10 bg-[#07111F]/70 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500/70 focus:bg-[#07111F] focus:ring-4 focus:ring-blue-500/10 [color-scheme:dark]"
            />

          </div>

          {/* Privacy Note */}
          <div className="mb-4 flex gap-2.5 rounded-xl border border-blue-400/10 bg-blue-500/5 px-3 py-2.5">

            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-blue-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect
                x="5"
                y="10"
                width="14"
                height="10"
                rx="2"
              />

              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>

            <p className="text-[10px] leading-4 text-slate-400">
              Your information is used only to securely authenticate your
              player account.
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

                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </>
            )}

          </button>

        </form>

        {/* Divider */}
        <div className="my-4 flex items-center gap-3">

          <div className="h-px flex-1 bg-blue-400/10" />

          <span className="text-[10px] uppercase tracking-widest text-slate-600">
            or
          </span>

          <div className="h-px flex-1 bg-blue-400/10" />

        </div>

        {/* Admin Login */}
        <div className="text-center">

          <p className="text-xs text-slate-500">

            Are you an admin?{" "}

            <Link
              to="/admin/login"
              className="font-semibold text-blue-400 transition-colors hover:text-blue-300 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              Login as Admin
            </Link>

          </p>

        </div>

      </div>

      {/* Bottom branding */}
      <p className="mt-3 text-center text-[10px] tracking-wide text-slate-600">
        Train • Compete • Fence
      </p>

    </div>
  </div>
);
};

export default Login;