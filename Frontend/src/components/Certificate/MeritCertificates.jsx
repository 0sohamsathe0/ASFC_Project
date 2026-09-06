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

      <div className="sticky top-0 z-20 flex flex-col gap-3 border-b border-gray-200 bg-slate-900 px-4 py-3 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">

        <div>
          <h2 className="text-lg font-semibold sm:text-xl">
            Certificate Preview
          </h2>

          <p className="text-sm text-slate-300">
            Preview before downloading
          </p>
        </div>

        <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-3">

          <button
            type="button"
            onClick={handleExport}
            className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 sm:flex-none sm:px-5"
          >
            <Download size={18} />

            Export PDF
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close certificate preview"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-500 transition hover:border-red-500 hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <X size={20} />
          </button>

        </div>

      </div>

      {/* Viewer */}

      <div className="flex-1 overflow-auto bg-slate-200 p-2 sm:p-6">
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
