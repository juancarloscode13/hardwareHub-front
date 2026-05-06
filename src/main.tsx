// Punto de entrada principal de la aplicación React
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
// Registra los interceptores de Axios al cargar la app
import '@/api/interceptors'
import { AppProviders } from '@/application/providers.tsx'
import router from '@/application/router.tsx'

// Monta la app en el div#root del index.html
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Envuelve toda la app con los providers globales */}
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
)
