import '../style.css'
import React, { useState } from "react"
import { Container, Row } from 'react-bootstrap'
import Navigation from './navigation/navigation.jsx'
import { FormTab } from './navigation/forms.js'
import ActiveForm from './navigation/activeform.navigation.jsx'

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

    return (
        <Container fluid>
            <Row>
                <Navigation
                    tabs={tabs} setTabs={setTabs}
                    activeForm={activeForm} setActiveForm={setActiveForm}
                />
            </Row>
            <Row>
                <ActiveForm activeForm={activeForm}/>
            </Row>
            <Row>
                Footer
            </Row>
        </Container>
    )
}