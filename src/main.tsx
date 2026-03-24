import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import '@/api/interceptors'
import { AppProviders } from './aplication/providers.tsx'
import { ThemeToggle } from './components/ui/theme-toggle.tsx'
import router from './aplication/router.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <ThemeToggle />
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
)
