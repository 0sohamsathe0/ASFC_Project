import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 flex items-center justify-center px-6 py-10">
      <div className="max-w-2xl w-full text-center">
        {/* 404 */}
        <h1 className="text-7xl sm:text-8xl md:text-9xl font-extrabold text-blue-600 tracking-tight">
          404
        </h1>

        {/* Icon */}
        <div className="text-5xl mt-2">⚔️</div>

        {/* Heading */}
        <h2 className="mt-5 text-3xl sm:text-4xl font-bold text-gray-900">
          En Garde! Wrong Direction.
        </h2>

        {/* Description */}
        <p className="mt-5 text-gray-600 text-base sm:text-lg leading-8">
          Looks like you've stepped outside the piste.
          <br />
          The page you're trying to reach doesn't exist or has been moved.
          <br />
          Return to the arena and continue your fencing journey.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg transition-all duration-300 hover:bg-blue-700 hover:-translate-y-1 hover:shadow-xl"
          >
            🏠 Go to Home
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-8 py-3 rounded-xl border border-blue-200 bg-white text-blue-700 font-semibold shadow transition-all duration-300 hover:bg-blue-50 hover:-translate-y-1 hover:shadow-lg"
          >
            ← Go Back
          </button>
        </div>

        {/* Divider */}
        <div className="mt-12 flex items-center justify-center">
          <div className="h-px w-20 bg-gray-300" />
          <span className="mx-4 text-blue-600 font-semibold tracking-wider">
            ALL STAR FENCING CLUB
          </span>
          <div className="h-px w-20 bg-gray-300" />
        </div>

        {/* Footer */}
        <p className="mt-4 text-sm text-gray-500">
          Every great fencer finds the right path. Let's get you back on track.
        </p>
      </div>
    </div>
  );
};

export default NotFound;