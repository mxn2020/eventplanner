import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConvexProvider, ConvexReactClient } from "convex/react";
import App from './App.tsx'
import { Analytics } from '@vercel/analytics/react'
import './i18n'
import { ErrorBoundary } from './components/ErrorBoundary'
import '@geenius-ui/react-css/styles'
import './index.css'

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL || "http://localhost:3001");

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <ErrorBoundary><App /></ErrorBoundary>
      <Analytics />
    </ConvexProvider>
  </StrictMode>,
)
