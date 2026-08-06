import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from './context/AuthContext.jsx'
import { ServerStatusProvider } from './context/ServerStatusContext.jsx'
import './index.css'
import App from './App.jsx'
import { Toaster } from "react-hot-toast";
import InternetStatusBanner from "./components/InternetStatusBanner";



createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ServerStatusProvider>
      <InternetStatusBanner />
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
          }}
        />
        <App />
      </AuthProvider>
    </ServerStatusProvider>
  </BrowserRouter>,
)
