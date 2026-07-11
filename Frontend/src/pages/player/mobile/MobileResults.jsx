import { motion } from "framer-motion";
import MobileResultsSection from "./MobileResultsSection";

const MobileResults = ({
  individualResults,
  teamResults,
  setSelectedCertificate,
  setShowCertificate,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-8"
    >
      <MobileResultsSection
        title="Individual Results"
        results={individualResults}        
      />

      <MobileResultsSection
        title="Team Results"
        results={teamResults}
      />
    </motion.div>
  );
};

export default MobileResults;