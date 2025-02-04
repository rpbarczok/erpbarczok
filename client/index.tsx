import { createRoot } from "react-dom/client"
import App from './components/app.jsx'
import './style.css'
import serviceWorkerRegistry from './utils/serviceworker.js'
import 'bootstrap/dist/css/bootstrap.min.css'

const root = createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <App />
)

if (process.env.NODE_ENV === "production") serviceWorkerRegistry()