import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { enableSwarm } from './components/swarm/enable'

// Debe ejecutarse antes del primer pintado para que los componentes aún sin construir no parpadeen.
enableSwarm()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
