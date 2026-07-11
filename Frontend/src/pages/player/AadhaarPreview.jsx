import { AnimatePresence, motion } from "framer-motion";
import { X, ShieldCheck } from "lucide-react";

const AadhaarPreview = ({ open, image, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{
              duration: 0.25,
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            {/* Header */}

            <div className="flex items-center justify-between border-b bg-gradient-to-r from-purple-700 to-indigo-700 px-6 py-5 text-white">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/20 p-2">
                  <ShieldCheck size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    Aadhaar Card
                  </h2>

                  <p className="text-sm text-purple-100">
                    Identity Verification
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="rounded-xl p-2 transition hover:bg-white/20"
              >
                <X size={22} />
              </button>
            </div>

            {/* Image */}

            <div className="bg-gray-100 p-4 sm:p-6">
              <div className="overflow-hidden rounded-2xl bg-white shadow">
                <img
                  src={image}
                  alt="Aadhaar Card"
                  className="max-h-[75vh] w-full object-contain"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AadhaarPreview;