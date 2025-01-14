import React, {useState} from "react"
import {Container, Row} from 'react-bootstrap'
import Companies from './components/companies/companies.js'
import Navigation from './components/navigation/navigation.js'

export default function App() {
    const startPage = { name: "Stammdaten", id: "stammForm"}
    const [activeForm, setActiveForm] = useState(startPage)
    const [tabs, setTabs] = useState([startPage])
    
    return(
        <Container fluid>
            <Row>
                <Navigation 
                    tabs ={tabs} setTabs = {setTabs}   
                    activeForm = {activeForm} setActiveForm= {setActiveForm}
                />
            </Row>
            <Row>
                {activeForm.id === "stammForm"? <Companies/> : <h1> {activeForm.name}: Work in Progress</h1>}    
            </Row>
            <Row>
                Footer
            </Row>
        </Container>
    )
}