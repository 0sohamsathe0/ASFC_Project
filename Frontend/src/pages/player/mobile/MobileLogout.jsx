import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

const MobileLogout = ({ HandleLogout }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="pb-8"
    >
      <button
        onClick={HandleLogout}
        className="flex w-full items-center justify-center gap-3 rounded-3xl bg-red-500 py-4 text-base font-semibold text-white shadow-lg transition active:scale-[0.98]"
      >
        <LogOut size={22} />

        Logout
      </button>
    </motion.div>
  );
};

export default MobileLogout;