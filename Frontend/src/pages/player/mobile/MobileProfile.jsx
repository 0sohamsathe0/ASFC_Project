import { motion } from "framer-motion";

import MobileProfileHeader from "./MobileProfileHeader";
import MobileStats from "./MobileStats";
import MobilePersonalInfo from "./MobilePersonalInfo";
import MobileUpcoming from "./MobileUpcoming";
import MobileIdentity from "./MobileIdentity";
import MobileResults from "./MobileResults";
import MobileLogout from "./MobileLogout";
import AadhaarPreview from "../AadhaarPreview";

const MobileProfile = ({
  player,
  showAadhar,
  setShowAadhar,
  individualResults,
  teamResults,
  selectedCertificate,
  setSelectedCertificate,
  showCertificate,
  setShowCertificate,
  HandleLogout,
  totalTournamentsPlayed,
  upcomingTournaments,
  navigate,
}) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-md mx-auto"
      >
        <MobileProfileHeader player={player} />

        <div className="px-4 py-5 space-y-6">
          <MobileStats
            player={player}
            totalTournamentsPlayed={totalTournamentsPlayed}
            individualResults={individualResults}
            teamResults={teamResults}
          />

          <MobilePersonalInfo player={player} />

          <MobileUpcoming upcomingTournaments={upcomingTournaments} />

          <MobileIdentity
            player={player}
            setShowAadhar={setShowAadhar}
          />

          {player.requestStatus !== "Rejected" ? (
            <MobileResults
              individualResults={individualResults}
              teamResults={teamResults}
              setSelectedCertificate={setSelectedCertificate}
              setShowCertificate={setShowCertificate}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-3xl shadow-lg p-6"
            >
              <h2 className="text-lg font-bold text-red-600">
                Profile Requires Correction
              </h2>

              <p className="text-sm text-gray-600 mt-3 leading-6">
                Your registration was rejected. Please update the required
                information and submit your profile again.
              </p>

              <button
                onClick={() => navigate(`/player/edit/${player._id}`)}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
              >
                Edit Profile
              </button>
            </motion.div>
          )}

          <MobileLogout HandleLogout={HandleLogout} />
        </div>
      </motion.div>
    </div>
  );
};

export default MobileProfile;