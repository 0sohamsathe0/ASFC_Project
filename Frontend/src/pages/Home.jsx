import Hero from '../components/homepage/Hero.jsx'
import Achievements from '../components/homepage/Achievements.jsx'
import HomeStorySections from '../components/homepage/HomeStorySections.jsx'
import '../components/homepage/home.css'

function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsClub",
    "@id": "https://all-star-fencing-club.vercel.app/#organization",
    name: "All Star Fencing Club",
    url: "https://all-star-fencing-club.vercel.app/",
    description:
      "All Star Fencing Club provides professional fencing training in Solapur for children, beginners and competitive athletes through structured coaching and athlete development.",
    sport: "Fencing",
    telephone: "+91 96379 63777",
    email: "info@allstarfencingclub.com",
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
  };
  return (
    <>
      <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />

      <main id="public-content" className="public-site asfc-home">
        <Hero />
        <HomeStorySections achievements={<Achievements />} />
      </main>
    </>
  )
}

export default Home
