import { MonitorSmartphone, House } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDesktopOnly = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">

        <div className="flex justify-center mb-6">
          <MonitorSmartphone className="w-16 h-16 text-blue-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800">
          Desktop Required
        </h1>

        <p className="mt-4 text-gray-600 leading-relaxed">
          The Admin Dashboard is optimized for desktop devices to provide the
          best experience while managing players, tournaments, results, and
          certificates.
        </p>

        <p className="mt-3 text-gray-500 text-sm">
          Please sign in from a laptop or desktop computer to continue.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
        >
          <House size={18} />
          Go to Home
        </Link>

      </div>
    </div>
  );
};

export default AdminDesktopOnly;