/*
Copyright (c) 2025 Ralph Barczok
Portions Copyright (c) 2024 Pan Xuguang GmbH
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

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
                            <Row>
                            <Navigation
                                openPages={openPages} setOpenPages={setOpenPages}
                                activePage={activePage} setActivePage={setActivePage}
                                theme={theme} setTheme={setTheme}
                            />
                            </Row>
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