import React from 'react'
import heroimg from '../assets/hero-section-img.jpg'

function Hero() {
  return (
    <div className="w-full px-6 py-4 bg-gray-100">
      <div className="relative rounded-3xl overflow-hidden">

        {/* Background Image */}
        <img
          src={heroimg}
          alt="Hero"
          className="w-full h-[80vh] object-cover"
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/60"></div>

        {/* Top Right Text */}
        <div className="absolute top-10 right-10 text-right text-white max-w-md">
          <h2 className="text-xl font-extrabold leading-tight tracking-wide">
            RULERS OF THE PISTE
          </h2>

          <p className="mt-2 text-lg opacity-90">
            Precision. Speed. Strategy
          </p>
        </div>

        {/* Bottom Left Text */}
        <div className="absolute bottom-16 left-12 text-white">
          <h1 className="text-6xl font-extrabold tracking-wide leading-tight">
            ALL STAR <br />
            FENCING CLUB
          </h1>
        </div>

      </div>
    </div>
  )
}

export default Hero
