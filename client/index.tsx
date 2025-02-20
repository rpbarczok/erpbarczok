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
  //@ts-ignore
  authority: `https://${window.idp_server}/`,
  //@ts-ignore
  client_id: window.client_id,
  //@ts-ignore
  redirect_uri: window.redirect_url,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  onSigninCallback: onSigninCallback,
  //@ts-ignore
  permission: window.permission,
  //@ts-ignore
  scope: window.scope,
  extraQueryParams: {
    //@ts-ignore
    audience: window.audience
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