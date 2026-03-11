import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import PlayerProfile from './pages/PlayerProfile'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Register from './pages/Register'

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
        <Route path="/register" element={<Register />} />
      </Routes>

    
   </>
  )
}

export default App
