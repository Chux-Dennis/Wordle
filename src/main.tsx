import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import "./assets/tailwind/exports.css"
import "./index.css"
import "@radix-ui/themes/styles.css";
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
