import React, { useState } from "react"
import { Container, Row } from 'react-bootstrap'
import Companies from './components/companies/companies.jsx'
import Navigation from './components/navigation/navigation.jsx'
import Admin from "./components/admin/admin.jsx"

export interface FormTab {
    name: string
    id: string
}

interface Meta {
    location: string
    etag: string
}
export interface DataWithMeta<T> {
    "meta": Meta
    "data": T
}

export default function App() {
    const startPage: FormTab = { name: "Stammdaten", id: "stammForm" }
    const [activeForm, setActiveForm] = useState<FormTab>(startPage)
    const [tabs, setTabs] = useState<FormTab[]>([startPage])

    const ActiveForm = () => {
        switch (activeForm.id) {
            case 'stammForm':
                return <Companies />
            case 'adminForm':
                return <Admin />
            default:
                return <h1> {activeForm.name}: Work in Progress</h1>
        }
    }

    return (
        <Container fluid>
            <Row>
                <Navigation
                    tabs={tabs} setTabs={setTabs}
                    activeForm={activeForm} setActiveForm={setActiveForm}
                />
            </Row>
            <Row>
                <ActiveForm />
            </Row>
            <Row>
                Footer
            </Row>
        </Container>
    )
}