import React from 'react'
import Hero from '../components/homepage/Hero.jsx'
import AboutPreview from '../components/homepage/AboutPreview.jsx'
import CTA from '../components/homepage/CTA.jsx'
import Achievements from '../components/homepage/Achievements.jsx'

function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsClub",
    "@id": "https://all-star-fencing-club.vercel.app/#organization",
    name: "All Star Fencing Club",
    url: "https://all-star-fencing-club.vercel.app/",
    description:
      "All Star Fencing Club is a fencing club in Solapur, Maharashtra, offering fencing training, coaching, competition preparation and player development.",
    sport: "Fencing",
    address: {
      "@type": "PostalAddress",
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

      <Hero />
      <Achievements />
      <AboutPreview />
      <CTA />
    </>
  )
}

export default Home
