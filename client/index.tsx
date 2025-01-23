import { createRoot } from "react-dom/client"
import App from './app.jsx'
import React from "react"

const root = createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <App />
)