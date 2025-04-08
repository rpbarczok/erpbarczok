import { Container, Row, Col } from 'react-bootstrap'
import { DataLoading, LoginLoading } from './login/Loading.js'
import { Pages } from './Pages.jsx'
import { LoadingContext } from '../utils/loadingContext.js'
import { Login } from './login/Login.js'
import { LoginError } from './login/LoginError.js'
import { Navigation } from './navigation/Navigation.js'
import { PermissionContext } from '../utils/permissionContext.js'
import { ThemeContext } from '../utils/themeContext.js'
import { useAuth } from 'react-oidc-context'
import { useState } from 'react'

export interface OpenPage {
    name: string
    id: string
}

export function App() {
    const startPage: OpenPage = { name: 'Stammdaten', id: 'stamm' }
    const [activePage, setActivePage] = useState<OpenPage>(startPage)
    const [openPages, setOpenPages] = useState<OpenPage[]>([startPage])
    const auth = useAuth()
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const [theme, setTheme] = useState<'light' | 'dark'>(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    const [permissions, setPermissions] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)


    document.getElementsByTagName('html')[0].setAttribute('data-bs-theme', theme)

    if (auth.isLoading) {
        return <LoginLoading />
    }

    if (auth.error) {
        return <LoginError message={auth.error.message || ''} />
    }

    if (auth.isAuthenticated) {
        return (
            <ThemeContext.Provider value={theme}>
                <LoadingContext.Provider value={{ isLoading: isLoading, setIsLoading: setIsLoading }}>
                    <PermissionContext.Provider value={{ permissions: permissions, setPermissions: setPermissions }}>
                        <Container fluid className='d-flex flex-column vh-100'>
                            <Navigation
                                openPages={openPages} setOpenPages={setOpenPages}
                                activePage={activePage} setActivePage={setActivePage}
                                theme={theme} setTheme={setTheme}
                            />
                            {isLoading ? <DataLoading /> : ''}
                            <Pages activePage={activePage} />
                            <Row className='bg-body-secondary' >
                                <hr />
                                <Col>
                                    <a href='https://www.flaticon.com/de/kostenlose-icons/panda' title='panda Icons'>Panda Icons erstellt von Freepik - Flaticon</a>
                                </Col>
                                <Col  >
                                    <div className='float-end'>© and made by rpbarczok</div>
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