import '../../style.css'
import './admin.css'
import { Row, Col, Button } from 'react-bootstrap'
import Heading from '../headings/heading.jsx'
import LeftNavAdmin from './leftnav.admin.jsx'
import Companytypes from './companytypes/companytypes.jsx'
import { useState } from 'react'
import { DataWithMeta } from 'components/forms.jsx'
import { Companytype } from './companytypes/companytypes.jsx'

export interface Ressource {
    name: string
    path: string
}

interface AdminInterface {
    listCompanytypes: DataWithMeta<Companytype>[]
    setIsCompanytypeChanged: React.Dispatch<React.SetStateAction<boolean>>
}
export default function Admin({ listCompanytypes, setIsCompanytypeChanged }: AdminInterface) {
    const [ressource, setRessource] = useState<Ressource>({ name: "Firmenrolle", path: "companytypes" })

    const ActiveRessource = () => {
        switch (ressource.path) {
            case "companytypes":
                return <Companytypes
                    listCompanytypes={listCompanytypes}
                    setIsCompanytypeChanged={setIsCompanytypeChanged}
                />
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