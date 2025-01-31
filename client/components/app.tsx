import '../style.css'
import { useState, useEffect } from "react"
import { Container, Row } from 'react-bootstrap'
import Navigation from './navigation/navigation.jsx'
import { FormTab } from './navigation/ribbon.js'
import Forms from './forms.jsx'

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
                <Forms activeForm={activeForm}  />
            </Row>
            <Row>
                Footer
            </Row>
        </Container>
    )
}