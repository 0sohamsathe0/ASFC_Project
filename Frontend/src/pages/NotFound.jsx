import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PublicButton } from "../components/public/PublicUI";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <main
      id="public-content"
      className="public-site public-section public-utility"
    >
      <div className="public-container">
        <p className="public-eyebrow">404 / Outside the piste</p>
        <h1 className="public-display">
          Let's find
          <br />
          your way back.
        </h1>
        <p className="public-copy mt-6">
          This page doesn't exist or has moved. Return to All Star Fencing Club
          and pick up your journey.
        </p>
        <div className="public-actions">
          <PublicButton to="/">
            Back to Home <ArrowRight size={16} />
          </PublicButton>
          <PublicButton variant="secondary" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            Go Back
          </PublicButton>
        </div>
      </div>
    </main>
  );
}
