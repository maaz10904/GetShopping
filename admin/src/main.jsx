import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from "@clerk/react"
import { BrowserRouter } from 'react-router'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import * as Sentry from "@sentry/react";

console.log('main.jsx module loaded')
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

console.log('publishable key=', PUBLISHABLE_KEY)
if (!PUBLISHABLE_KEY) {
  // log a warning instead of throwing so we can still re nder
  console.warn('Missing Publishable Key (check .env)')
}

const queryClient = new QueryClient()



Sentry.init({
  dsn:import.meta.env.VITE_SENTRY_DSN,
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  enableLogs: true,
  integrations: [Sentry.replayIntegration()],
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
});

const root = createRoot(document.getElementById('root'))
root.render(
  <StrictMode>
      <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ClerkProvider>
      </BrowserRouter>
  </StrictMode>,
)
