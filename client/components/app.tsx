import '../style.css'
import { useState } from "react"
import { Container, Row } from 'react-bootstrap'
import { Navigation } from './navigation/navigation.jsx'
import { FormTab } from './navigation/ribbon.js'
import { Forms } from './forms.jsx'
import { Login } from './login/login.jsx'
import { useAuth } from 'react-oidc-context'

export function App() {
    const startPage: FormTab = { name: "Admin", id: "adminForm" }
    const [activeForm, setActiveForm] = useState<FormTab>(startPage)
    const [tabs, setTabs] = useState<FormTab[]>([startPage])
    const auth = useAuth()
    
    if (auth.isLoading) {
        return <div>Loading...</div>
    }

    if (auth.error) {
        return <div>Oops... {auth.error.message}</div>
    }

    if (auth.isAuthenticated) {
    return (
        <Container fluid>
            <Row>
                <Navigation
                    tabs={tabs} setTabs={setTabs}
                    activeForm={activeForm} setActiveForm={setActiveForm}
                />
            </Row>
            <Row>
                <Forms activeForm={activeForm} />
            </Row>
            <Row>
                Footer
            </Row>
        </Container>

    )
}

    return (
        <Login/>
    )
}