import '../../style.css'
import './admin.css'
import { Row, Col, Button } from 'react-bootstrap'
import Heading from '../common/heading.jsx'
import LeftNavAdmin from './leftnav.admin.jsx'
import Companytypes from './companytypes/companytypes.admin.jsx'
import { useState } from 'react'

export interface Ressource {
    name: string
    path: string
}

export default function Admin() {
    const [ressource, setRessource] = useState<Ressource>({name: "Firmenrolle", path: "companytypes"})

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
                <Col>
                    <LeftNavAdmin
                        setRessource={setRessource}
                    />
                </Col>
                <Col>
                    <ActiveRessource />
                </Col>
                <Col>
                </Col>
            </Row>
        </>
    )
}