import { createRoot } from "react-dom/client"
import App from './app.jsx'
import React from "react"
import './style.css'

const root = createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <App />
)