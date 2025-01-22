import React, { useState } from "react"
import { Container, Row } from 'react-bootstrap'
import Companies from './components/companies/companies.js'
import Navigation from './components/navigation/navigation.js'
import Admin from "./components/admin/admin.js"

export interface FormTab {
    name: string
    id: string
}

export interface Loc<T> {
    "location": string,
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