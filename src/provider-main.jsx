import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import Provider from './pages/Provider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider />
  </StrictMode>,
)
