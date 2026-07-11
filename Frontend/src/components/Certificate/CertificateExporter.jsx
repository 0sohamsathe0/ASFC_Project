import { useRef } from "react";
import ClassicCertificate from "./layout/ClassicCertificate";
import exportCertificate from "../../utils/exportCertificate.js";

const CertificateExporter = ({
  certificateData,
  children,
}) => {
  const certificateRef = useRef(null);

  const handleDownload = async () => {
    if (!certificateData) return;

    await exportCertificate(
      certificateRef.current,
      `${certificateData.player.fullName}_${certificateData.tournament.title}.pdf`
    );
  };

  return (
    <>
      {/* Hidden Certificate */}

      <div
        className="fixed -left-[9999px] top-0"
        ref={certificateRef}
      >
        <ClassicCertificate
          certificateData={certificateData}
        />
      </div>

      {children(handleDownload)}
    </>
  );
};

export default CertificateExporter;