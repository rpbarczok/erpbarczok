import '../../style.css'
import './admin.css'
import { Row, Col } from 'react-bootstrap'
import { Heading } from '../headings/heading.jsx'
import { LeftNavigation } from './leftNav.admin.jsx'
import { CompanyTypes } from './companyTypes/companyTypes.jsx'
import { useState } from 'react'
import { Fields } from './fields/fields.jsx'

export interface Resource {
    name: string
    path: string
}

export function Admin() {
    const [resource, setResource] = useState<Resource>({ name: "Firmenrolle", path: "company-types" })

    const ActiveResource = () => {
        switch (resource.path) {
            case "company-types":
                return <CompanyTypes />
            case "fields":
                return <Fields />
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
                        setResource={setResource}
                    />
                </Col>
                <Col xs={12} md = {10} lg={9} xl={8} xxl={6}>
                    <ActiveResource />
                </Col>
                <Col lg = {1} xl={2} xxl={4}>
                </Col>
            </Row>
        </>
    )
}