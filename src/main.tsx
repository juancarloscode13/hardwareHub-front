import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@/api/interceptors'
import App from './App.tsx'
import { AppProviders } from './aplication/providers.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
)
