import '../../style.css'
import './admin.css'
import { Row, Col } from 'react-bootstrap'
import { Heading } from '../headings/heading.jsx'
import { LeftNavigation } from './leftnav.admin.jsx'
import { Companytypes } from './companytypes/companytypes.jsx'
import { useState } from 'react'

export interface Ressource {
    name: string
    path: string
}

export function Admin() {
    const [ressource, setRessource] = useState<Ressource>({ name: "Firmenrolle", path: "companytypes" })

    const ActiveRessource = () => {
        switch (ressource.path) {
            case "companytypes":
                return <Companytypes />
        }
    }

    return (
        <>
            <Row id="heading">
                <Heading title="Administratoren-Bereich" cssClass='adminForm' />
            </Row>
            <Row>
                <Col xs={12} md={2}>
                    <LeftNavigation
                        setRessource={setRessource}
                    />
                </Col>
                <Col xs={12} md = {10} lg={9} xl={8} xxl={6}>
                    <ActiveRessource />
                </Col>
                <Col lg = {1} xl={2} xxl={4}>
                </Col>
            </Row>
        </>
    )
}