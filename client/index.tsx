import { createRoot } from "react-dom/client"
import { App } from './components/app.jsx'
import './style.css'
import { serviceWorkerRegistry } from './utils/serviceworker.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import { StrictMode } from "react"
import { AuthProvider, AuthProviderProps } from "react-oidc-context"

const root = createRoot(document.getElementById("root") as HTMLElement)

const oidcConfig: AuthProviderProps = {
  authority: `https://dev-xny0abm7nsusygw7.eu.auth0.com/`,
  client_id: "CHzm5u0oVYPYlIbY6JinPgQG2ll9kG3t",
  redirect_uri: "http://localhost:3000/",
  extraQueryParams: {
    audience: "http://localhost:8080"
  }
}

root.render(
  <AuthProvider {...oidcConfig}>
    <StrictMode>
      <App />
    </StrictMode>
  </AuthProvider >
)

if (process.env.NODE_ENV === "production") serviceWorkerRegistry()