import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import PlayerProfile from './pages/PlayerProfile'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import RegistrationForm from './components/RegistrationForm'

function App() {
  const [count, setCount] = useState(0)

  return (
   <>
    <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<PlayerProfile />} />
      </Routes>

    
    <div className="bg-linear-to-bl from-blue-200 to-blue-600 h-full p-5">
      <h1 className="text-3xl font-bold text-white text-center">ASFC MERN PROJECT</h1>
      <RegistrationForm />
    </div>

   </>
  )
}

export default App
