import { createRoot } from "react-dom/client"
import { App } from './components/app.jsx'
import './style.css'
import { serviceWorkerRegistry } from './utils/serviceworker.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import { StrictMode } from "react"
import { AuthProvider, AuthProviderProps } from "react-oidc-context"
import { User, WebStorageStateStore } from "oidc-client-ts"

const root = createRoot(document.getElementById("root") as HTMLElement)

const onSigninCallback = (_user: User | void): void => {
  window.history.replaceState(
    {},
    document.title,
    window.location.pathname
  )
}
const oidcConfig: AuthProviderProps = {
  authority: `https://dev-xny0abm7nsusygw7.eu.auth0.com/`,
  client_id: "CHzm5u0oVYPYlIbY6JinPgQG2ll9kG3t",
  redirect_uri: "http://localhost:3000/",
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  onSigninCallback: onSigninCallback,
  scope: "openid offline_access",
  extraQueryParams: {
    audience: "http://localhost:8080"
  }
}

root.render(
  <StrictMode>
    <AuthProvider {...oidcConfig}>
      <App />
    </AuthProvider >
  </StrictMode>
)

if (process.env.NODE_ENV === "production") serviceWorkerRegistry()