import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.jsx'

// Globalni 401 hvatač: ako token istekne, automatski očisti i vrati na login
// (umjesto da stranica samo "ne učita" bez objašnjenja)
const _origFetch = window.fetch.bind(window)
window.fetch = async (...args) => {
  const res = await _origFetch(...args)
  if (res.status === 401 && localStorage.getItem('token')) {
    const url = typeof args[0] === 'string' ? args[0] : args[0]?.url || ''
    if (!url.includes('/auth/login')) {
      localStorage.removeItem('token')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?isteklo=1'
      }
    }
  }
  return res
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
