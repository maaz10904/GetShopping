import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from "@clerk/react"


console.log('main.jsx module loaded')
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

console.log('publishable key=', PUBLISHABLE_KEY)
if (!PUBLISHABLE_KEY) {
  // log a warning instead of throwing so we can still re nder
  console.warn('Missing Publishable Key (check .env)')
}

const root = createRoot(document.getElementById('root'))
root.render(
  <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
  </StrictMode>,
)
