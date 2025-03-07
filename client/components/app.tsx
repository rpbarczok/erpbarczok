import '../style.css'
import { useState, createContext, useContext } from "react"
import { Container, Row, Col } from 'react-bootstrap'
import { Navigation } from './navigation/navigation.jsx'
import { FormTab } from './navigation/ribbon.js'
import { Forms } from './forms.jsx'
import { Login } from './login/login.jsx'
import { useAuth } from 'react-oidc-context'

export function App() {
    const startPage: FormTab = { name: "Stammdaten", id: "stammForm" }
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

                <Container fluid className="d-flex flex-column vh-100">
                    <Navigation
                        tabs={tabs} setTabs={setTabs}
                        activeForm={activeForm} setActiveForm={setActiveForm}
                    />
                    <Forms activeForm={activeForm} />
                    <Row className="bg-body-secondary" >
                        <hr />
                        <Col  >
                            <div className="float-end">made by rpbarczok</div>
                        </Col>
                    </Row>
                </Container>
        )
    }

    return (
        <Login />
    )
}