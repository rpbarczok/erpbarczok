import { createRoot } from "react-dom/client"
import { App } from './components/app.jsx'
import './style.css'
import { serviceWorkerRegistry } from './utils/serviceworker.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import { StrictMode } from "react"
import { AuthProvider, AuthProviderProps } from "react-oidc-context"
import { User, WebStorageStateStore } from "oidc-client-ts"
import { Button } from "react-bootstrap"

const root = createRoot(document.getElementById("root") as HTMLElement)

const onSigninCallback = (_user: User | void): void => {
  window.history.replaceState(
    {},
    document.title,
    window.location.pathname
  )
}

export interface WindowAuth extends Window {
  idp_server?: string
  client_id?: string
  redirect_uri?: string
  scope?: string
  audience?: string
}

const windowAuth = window as WindowAuth

if (!windowAuth.idp_server
  || !windowAuth.client_id
  || !windowAuth.redirect_uri
  || !windowAuth.audience) {

  root.render(
    <StrictMode>
      <div>
        <h1>Konfiguration der Authentifizierungsparameter unvollständig</h1>
        <p>IDP-Server: {windowAuth.idp_server}</p>
        <p>Client-ID: {windowAuth.client_id}</p>
        <p>Redirect URI: {windowAuth.redirect_uri}</p>
        <p>Audience: {windowAuth.audience}</p>
      </div>
      <div>
        <Button type="button" onClick={() => window.location.reload()}>Wiederholen</Button>
      </div>
    </StrictMode>
  )
} else {
  const oidcConfig: AuthProviderProps = {
    authority: windowAuth.idp_server,
    client_id: windowAuth.client_id,
    redirect_uri: windowAuth.redirect_uri,
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    onSigninCallback: onSigninCallback,
    scope: windowAuth.scope,
    extraQueryParams: {
      audience: windowAuth.audience
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
}
