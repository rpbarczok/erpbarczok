import { createRoot } from "react-dom/client"
import {App} from './components/app.jsx'
import './style.css'
import {serviceWorkerRegistry} from './utils/serviceworker.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import { StrictMode } from "react"

const root = createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <StrictMode>
    <App />
  </StrictMode>
)

if (process.env.NODE_ENV === "production") serviceWorkerRegistry()