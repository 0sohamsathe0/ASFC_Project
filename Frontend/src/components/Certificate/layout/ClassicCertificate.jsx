import BaseCertificate from "../shared/BaseCertificate";
import CertificateTitle from "../shared/CertificateTitle";
import PlayerName from "../shared/PlayerName";
import Achievement from "../shared/Achievement";
import TournamentDetails from "../shared/TournamentDetails";
import Footer from "../shared/Footer";

const ClassicCertificate = ({ certificateData, certificateRef }) => {
  const {
    player,
    tournament,
    result,
  } = certificateData;

  return (
    <BaseCertificate certificateRef={certificateRef}>
      <CertificateTitle tournament={tournament} />

      <PlayerName
        name={player.fullName}
      />

      <Achievement
        place={result.place}
        category={result.category}
        event={player.event}
        certificateType={result.certificateType}
      />

      <TournamentDetails
        tournament={tournament}
      />

      <div className="grow" />

      <Footer />
    </BaseCertificate>
  );
};

export default ClassicCertificate;