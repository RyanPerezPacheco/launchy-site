import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import Auth from './pages/Auth'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth />
  </StrictMode>,
)
