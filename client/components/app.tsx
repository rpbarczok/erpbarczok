import '../style.css'
import { useState, createContext, useContext } from "react"
import { Container, Row, Col } from 'react-bootstrap'
import { Navigation } from './navigation/navigation.jsx'
import { FormTab } from './navigation/ribbon.js'
import { Forms } from './forms.jsx'
import { Login } from './login/login.jsx'
import { useAuth } from 'react-oidc-context'
import { ThemeContext } from 'utils/themeContext.js'
import { PermissionContext} from 'utils/permissionContext.js'
import {Loading} from './login/loading.jsx'
import { LoginError } from './login/error.jsx'

export function App() {
    const startPage: FormTab = { name: "Stammdaten", id: "stammForm" }
    const [activeForm, setActiveForm] = useState<FormTab>(startPage)
    const [tabs, setTabs] = useState<FormTab[]>([startPage])
    const auth = useAuth()
    const [theme, setTheme] = useState<'light' | 'dark'>(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    const [permissions, setPermissions] = useState<string[]>([])

    if (theme !== 'light' && theme !== 'dark') {
        setTheme('light')
    }
    window.onload = function () {
        document.getElementsByTagName('html')[0].setAttribute('data-bs-theme', theme)
    }

    if (auth.isLoading) {
        return <Loading />
    }

    if (auth.error) {
        return <LoginError message={auth.error.message ?? ''}/>

        
    }

    if (auth.isAuthenticated) {
        return (
            <PermissionContext.Provider value={{permissions: permissions, setPermissions: setPermissions}}>
                <ThemeContext.Provider value={theme}>
                    <Container fluid className="d-flex flex-column vh-100">
                        <Navigation
                            tabs={tabs} setTabs={setTabs}
                            activeForm={activeForm} setActiveForm={setActiveForm}
                            theme={theme} setTheme={setTheme}
                        />
                        <Forms activeForm={activeForm} />
                        <Row className="bg-body-secondary" >
                            <hr />
                            <Col>
                                <a href="https://www.flaticon.com/de/kostenlose-icons/panda" title="panda Icons">Panda Icons erstellt von Freepik - Flaticon</a>
                            </Col>
                            <Col  >
                                <div className="float-end">© and made by rpbarczok</div>
                            </Col>
                        </Row>
                    </Container>
                </ThemeContext.Provider>
            </PermissionContext.Provider>
        )
    }

    return (
        <Login />
    )
}