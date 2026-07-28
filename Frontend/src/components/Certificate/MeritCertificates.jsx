import { useRef } from "react";
import { Download, X } from "lucide-react";

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
    <div className="flex h-full flex-col">

      {/* Header */}

      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-slate-900 px-6 py-4 text-white">

        <div>
          <h2 className="text-xl font-semibold">
            Certificate Preview
          </h2>

          <p className="text-sm text-slate-300">
            Preview before downloading
          </p>
        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
          >
            <Download size={18} />

            Export PDF
          </button>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-500 transition hover:border-red-500 hover:bg-red-500"
          >
            <X size={20} />
          </button>

        </div>

      </div>

      {/* Viewer */}

      <div className="flex-1 overflow-auto bg-slate-200 p-6">
        <div className="flex justify-center">
          <div className="origin-top scale-90 xl:scale-95 2xl:scale-100 transition-transform">
            <ClassicCertificate
              certificateData={certificateData}
              certificateRef={certificateRef}
            />
          </div>
        </div>
      </div>

    </div>
  );
}