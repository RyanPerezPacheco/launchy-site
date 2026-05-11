import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import Dashboard from './pages/Dashboard'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Dashboard />
  </StrictMode>,
)
