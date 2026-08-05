import React from 'react'
import Hero from '../components/homepage/Hero.jsx'
import Features from '../components/homepage/Features.jsx'
import CTA from '../components/homepage/CTA.jsx'
import { checkServer } from '../utils/checkServer.js'
import { useServerStatus } from "../context/ServerStatusContext.jsx";


function Home() {

  const test = async () => {
    console.log(await checkServer());
  };
  const { isServerDown, setIsServerDown } = useServerStatus();
  console.log(isServerDown);

  return (
    <>
      <button onClick={test}>Test Server</button>
      <button onClick={() => setIsServerDown(true)}>
        Test
      </button>
      <Hero />
      <Features />
      <CTA />
    </>
  )
}

export default Home
