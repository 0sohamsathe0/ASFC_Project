import React from 'react'
import Hero from '../components/homepage/Hero.jsx'
import AboutPreview from '../components/homepage/AboutPreview.jsx'
import CTA from '../components/homepage/CTA.jsx'
import Achievements from '../components/homepage/Achievements.jsx'

function Home() {
  return (
    <>
      <Hero />
      <AboutPreview />
      <Achievements/>
      <CTA />
    </>
  )
}

export default Home
