import { motion } from "framer-motion";
import { BadgeCheck, Eye, Shield } from "lucide-react";

const MobileIdentity = ({ player, setShowAadhar }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="rounded-3xl bg-white shadow-lg overflow-hidden"
    >
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/20 p-3">
            <Shield size={24} />
          </div>

          <div>
            <h2 className="text-lg font-bold">
              Identity Verification
            </h2>

            <p className="text-sm text-purple-100">
              Registered player verification
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between rounded-2xl bg-green-50 border border-green-100 p-4">
          <div className="flex items-center gap-3">
            <BadgeCheck
              className="text-green-600"
              size={24}
            />

            <div>
              <h3 className="font-semibold text-gray-800">
                Aadhaar Verified
              </h3>

              <p className="text-sm text-gray-500">
                Identity document uploaded successfully.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAadhar(true)}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-600 py-3.5 font-semibold text-white transition hover:bg-purple-700"
        >
          <Eye size={20} />

          Preview Aadhaar
        </button>
      </div>
    </motion.section>
  );
};

export default MobileIdentity;