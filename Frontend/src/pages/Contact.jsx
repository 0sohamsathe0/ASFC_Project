import { useState } from "react";
import { ArrowRight, Send } from "lucide-react";
import { api } from "../components/api.js";
import { PublicPageIntro, PublicButton } from "../components/public/PublicUI";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};
const fields = [
  ["fullName", "Full name", "text", "name"],
  ["email", "Email address", "email", "email"],
  ["phone", "Phone number", "tel", "tel"],
  ["subject", "Subject", "text", "off"],
];

export default function Contact() {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": "https://all-star-fencing-club.vercel.app/contact#contact",
    url: "https://all-star-fencing-club.vercel.app/contact",
    name: "Contact All Star Fencing Club",
    description:
      "Contact All Star Fencing Club in Solapur, Maharashtra for fencing training, player registration, tournament information, and other club enquiries.",

    mainEntity: {
      "@type": "SportsClub",
      "@id": "https://all-star-fencing-club.vercel.app/#organization",
      name: "All Star Fencing Club",
      url: "https://all-star-fencing-club.vercel.app/",
      sport: "Fencing",

      sameAs: [
        "https://www.facebook.com/p/ALL-STAR-Fencing-CLUB-100064343851939/",
        "https://www.instagram.com/all_star_fencing_club/",
      ],

      address: {
        "@type": "PostalAddress",
        streetAddress: "Chh. Shivaji Night College",
        addressLocality: "Solapur",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },

      telephone: "+91 96379 63777",
      email: "info@allstarfencingclub.com",

      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          opens: "05:00",
          closes: "07:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          opens: "18:00",
          closes: "20:00",
        },
      ],
    },
  };

  const handleChange = (event) =>
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setFeedback(null);
    try {
      const response = await api.post("/contact", formData);
      setFeedback({
        type: "success",
        message:
          response.data.message ||
          "Message sent. Thank you for getting in touch.",
      });
      setFormData(initialForm);
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.response?.data?.message ||
          "We couldn't send your message. Please try again or call the club.",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <main id="public-content" className="public-site">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PublicPageIntro
        label="Contact"
        title={
          <>
            It starts with
            <br />a conversation.
          </>
        }
      >
        <p>
          New to fencing? Planning a visit? Speak to the team at All Star
          Fencing Club in Solapur. We will help you find your next step.
        </p>
      </PublicPageIntro>
      <section className="public-section public-light">
        <div
          className="public-container public-split"
          style={{ alignItems: "start" }}
        >
          <div>
            <p className="public-eyebrow">Come say hello</p>
            <h2 className="public-heading">Let's talk fencing.</h2>
            <dl className="public-contact-list mt-7">
              <div>
                <dt>Visit</dt>
                <dd>
                  Chh. Shivaji Night College
                  <br />
                  Solapur, Maharashtra, India
                </dd>
              </div>
              <div>
                <dt>Call the club</dt>
                <dd>
                  <a href="tel:+919637963777" className="public-inline-link">
                    +91 96379 63777
                  </a>
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a
                    className="public-inline-link break-words"
                    href="mailto:info@allstarfencingclub.com"
                  >
                    info@allstarfencingclub.com
                  </a>
                </dd>
              </div>
              <div>
                <dt>Training hours · Monday–Saturday</dt>
                <dd>
                  Morning / 5:00–7:00 AM
                  <br />
                  Evening / 6:00–8:00 PM
                </dd>
              </div>
            </dl>
            <a
              href="#club-location"
              className="public-button public-button--text"
            >
              Find us on the map <ArrowRight size={16} />
            </a>
          </div>
          <form
            className="public-form"
            onSubmit={handleSubmit}
            aria-busy={loading}
          >
            <h2 className="public-h3">Send an enquiry.</h2>
            <p className="public-small mt-2">
              All fields are required. Tell us a little about what you're
              looking for.
            </p>
            <div className="public-form-grid">
              {fields.map(([name, label, type, autoComplete]) => (
                <div className="public-field" key={name}>
                  <label htmlFor={`contact-${name}`}>{label}</label>
                  <input
                    id={`contact-${name}`}
                    name={name}
                    type={type}
                    autoComplete={autoComplete}
                    required
                    disabled={loading}
                    value={formData[name]}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>
            <div className="public-field mt-6">
              <label htmlFor="contact-message">Your message</label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                disabled={loading}
                value={formData.message}
                onChange={handleChange}
              />
            </div>
            <PublicButton type="submit" disabled={loading} className="mt-6">
              {loading ? "Sending…" : "Send Message"}
              <Send size={16} />
            </PublicButton>
            {feedback && (
              <div
                role={feedback.type === "error" ? "alert" : "status"}
                className={`public-form-message ${feedback.type === "error" ? "public-form-message--error" : ""}`}
              >
                {feedback.message}
              </div>
            )}
          </form>
        </div>
      </section>
      <section id="club-location" className="public-section public-white">
        <div className="public-container">
          <div className="public-section-head">
            <div>
              <p className="public-eyebrow">Our home ground</p>
              <h2 className="public-heading">See you in Solapur.</h2>
            </div>
            <p className="public-copy">
              Find us at Chh. Shivaji Night College. Call ahead to plan your
              visit and meet the club.
            </p>
          </div>
          <iframe
            title="All Star Fencing Club location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3801.470314578422!2d75.8990999!3d17.675229!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc5d08029796ae9%3A0xf8f57d22b01ea920!2sChh.%20Chatrapati%20Shivaji%20Maharaj%20Night%20College%20of%20Arts%20%26%20Commerce%20Solapur!5e0!3m2!1sen!2sin!4v1785833307387!5m2!1sen!2sin"
            className="public-map"
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </section>
      <section className="public-section public-light">
        <div
          className="public-container public-split"
          style={{ alignItems: "start" }}
        >
          <div>
            <p className="public-eyebrow">Before your first visit</p>
            <h2 className="public-heading">A few good questions.</h2>
          </div>
          <div className="public-faq">
            {[
              [
                "Do I need fencing experience?",
                "You can begin without prior fencing experience. Contact the club to discuss a suitable starting point for you or your child.",
              ],
              [
                "What should I bring to my first session?",
                "Speak to the club before your visit so we can explain clothing, equipment and how your first session will work.",
              ],
              [
                "When can we visit?",
                "Call us to arrange a visit. Our evening training session runs from 6:00 to 8:00 PM, Monday to Saturday.",
              ],
            ].map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p className="public-copy">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
