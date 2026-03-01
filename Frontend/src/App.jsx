import { useState } from 'react'
import './App.css'
import RegistrationForm from './components/RegistrationForm'

function App() {
  const [count, setCount] = useState(0)

  return (
   <>
    <div className="bg-linear-to-bl from-blue-200 to-blue-600 h-full p-5">
      <h1 className="text-3xl font-bold text-white text-center">ASFC MERN PROJECT</h1>
      <RegistrationForm />
    </div>

   </>
  )
}

export default App
