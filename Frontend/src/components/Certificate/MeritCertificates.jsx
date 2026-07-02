import { useRef } from "react";
import ClassicCertificate from "./layout/ClassicCertificate";
import exportCertificate from "../../utils/exportCertificate";

export default function MeritCertificates({
  certificateData,
  onClose,
}) {
  const certificateRef = useRef(null);

  if (!certificateData) return null;

  const handleExport = () => {
    exportCertificate(
      certificateRef.current,
      `${certificateData.player.fullName}_${certificateData.tournament.title}.pdf`
    );
  };

  return (
    <>
      {/* Certificate Preview */}
      <div ref={certificateRef}>
        <ClassicCertificate
          certificateData={certificateData}
        />
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={onClose}
          className="rounded-lg bg-gray-500 px-6 py-2 text-white hover:bg-gray-600 transition"
        >
          Close
        </button>

        <button
          onClick={handleExport}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 transition"
        >
          Export PDF
        </button>
      </div>
    </>
  );
}