import '../style.css'
import { useState, createContext, useContext } from "react"
import { Container, Row, Col } from 'react-bootstrap'
import { Navigation } from './navigation/navigation.jsx'
import { FormTab } from './navigation/ribbon.js'
import { Forms } from './forms.jsx'
import { Login } from './login/login.jsx'
import { useAuth } from 'react-oidc-context'
import { ThemeContext } from 'utils/themeContext.js'
import { PermissionContext } from 'utils/permissionContext.js'
import { DataLoading, LoginLoading } from './login/loading.jsx'
import { LoginError } from './login/error.jsx'
import { LoadingContext } from '../utils/loadingContext.js'

export function App() {
    const startPage: FormTab = { name: "Stammdaten", id: "stammForm" }
    const [activeForm, setActiveForm] = useState<FormTab>(startPage)
    const [tabs, setTabs] = useState<FormTab[]>([startPage])
    const auth = useAuth()
    const [theme, setTheme] = useState<'light' | 'dark'>(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    const [permissions, setPermissions] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)


    document.getElementsByTagName('html')[0].setAttribute('data-bs-theme', theme)
    console.log(window.location.href)

    if (auth.isLoading) {
        return <LoginLoading />
    }

    if (auth.error) {
        return <LoginError message={auth.error.message ?? ''} />
    }

    if (auth.isAuthenticated) {
        return (
            <ThemeContext.Provider value={theme}>
                <LoadingContext.Provider value={{ isLoading: isLoading, setIsLoading: setIsLoading }}>
                    <PermissionContext.Provider value={{ permissions: permissions, setPermissions: setPermissions }}>
                        <Container fluid className="d-flex flex-column vh-100">
                            <Navigation
                                tabs={tabs} setTabs={setTabs}
                                activeForm={activeForm} setActiveForm={setActiveForm}
                                theme={theme} setTheme={setTheme}
                            />
                            {isLoading ? <DataLoading /> : ''}
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
                    </PermissionContext.Provider>
                </LoadingContext.Provider>
            </ThemeContext.Provider>
        )
    }

    return (
        <Login />
    )
}