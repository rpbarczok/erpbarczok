import { createRoot } from "react-dom/client"
import App from './components/app.jsx'
import React from "react"
import './style.css'
import serviceWorkerRegistry from './components/serviceworker.js'

const root = createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <App />
)

if (process.env.NODE_ENV === "production") serviceWorkerRegistry()