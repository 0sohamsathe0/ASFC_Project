import { motion } from "framer-motion";
import { BadgeCheck, Eye, Shield } from "lucide-react";

const MobileIdentity = ({ player, setShowAadhar }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50"
    >
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#07111F] via-[#0B1D35] to-blue-700 p-5 text-white">

        {/* Background decoration */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-400/20" />

        <div className="pointer-events-none absolute -bottom-16 left-1/3 h-32 w-32 rounded-full bg-blue-300/10 blur-2xl" />

        <div className="relative flex items-center gap-3">

          <div className="rounded-2xl border border-blue-300/20 bg-white/10 p-3 backdrop-blur-sm">
            <Shield size={23} />
          </div>

          <div>

            <h2 className="text-lg font-bold">
              Identity Verification
            </h2>

            <p className="mt-0.5 text-xs text-blue-200">
              Registered player verification
            </p>

          </div>

        </div>

      </div>

      {/* Content */}
      <div className="p-5">

        {/* Verification Status */}
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100">

            <BadgeCheck
              className="text-emerald-600"
              size={22}
            />

          </div>

          <div className="min-w-0">

            <h3 className="font-semibold text-slate-800">
              Aadhaar Verified
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Identity document uploaded successfully.
            </p>

          </div>

        </div>

        {/* Preview */}
        <button
          onClick={() => setShowAadhar(true)}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
        >

          <Eye size={19} />

          Preview Aadhaar

        </button>

      </div>
    </motion.section>
  );
};

export default MobileIdentity;