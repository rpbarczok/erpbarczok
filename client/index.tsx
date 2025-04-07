import 'bootstrap/dist/css/bootstrap.min.css'
import { App } from './components/App.js'
import { AuthProvider, AuthProviderProps } from 'react-oidc-context'
import { Button } from 'react-bootstrap'
import { createRoot } from 'react-dom/client'
import { serviceWorkerRegistry } from './utils/serviceworker.js'
import { StrictMode } from 'react'
import { WebStorageStateStore } from 'oidc-client-ts'

const root = createRoot(document.getElementById('root') as HTMLElement)

const onSigninCallback = (): void => {
  window.history.replaceState(
    {},
    document.title,
    window.location.pathname
  )
}

const redirect_uri = window.location.href

export interface WindowAuth extends Window {
  idp_server?: string
  client_id?: string
  scope?: string
  audience?: string
}

const windowAuth = window as WindowAuth

if (!windowAuth.idp_server
  || !windowAuth.client_id
  || !windowAuth.audience) {

  root.render(
    <StrictMode>
      <div>
        <h1>Konfiguration der Authentifizierungsparameter unvollständig</h1>
        <p>IDP-Server: {windowAuth.idp_server}</p>
        <p>Client-ID: {windowAuth.client_id}</p>
        <p>Audience: {windowAuth.audience}</p>
      </div>
      <div>
        <Button type='button' onClick={() => window.location.reload()}>Wiederholen</Button>
      </div>
    </StrictMode>
  )
} else {
  const oidcConfig: AuthProviderProps = {
    authority: windowAuth.idp_server,
    client_id: windowAuth.client_id,
    redirect_uri: redirect_uri,
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

  if (process.env.NODE_ENV === 'production') serviceWorkerRegistry()
}
