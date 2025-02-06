import '../../style.css'
import './admin.css'
import { Row, Col } from 'react-bootstrap'
import Heading from '../headings/heading.jsx'
import LeftNavAdmin from './leftnav.admin.jsx'
import Companytypes from './companytypes/companytypes.jsx'
import { useState } from 'react'

export interface Ressource {
    name: string
    path: string
}

export default function Admin() {
    const [ressource, setRessource] = useState<Ressource>({ name: "Firmenrolle", path: "companytypes" })

    const ActiveRessource = () => {
        switch (ressource.path) {
            case "companytypes":
                return <Companytypes/>
        }
    }

    return (
        <>
            <Row id="heading">
                <Heading title="Administratoren-Bereich" cssClass='adminForm' />
            </Row>
            <Row>
                <Col xs={2}>
                    <LeftNavAdmin
                        setRessource={setRessource}
                    />
                </Col>
                <Col xs={5}>
                    <ActiveRessource />
                </Col>
                <Col>
                </Col>
            </Row>
        </>
    )
}