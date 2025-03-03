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
    const [activeResource, setActiveResource] = useState<Resource>({ name: "Firmenrolle", path: "company-types" })

    const ActiveResource = () => {
        switch (activeResource.path) {
            case "company-types":
                return <CompanyTypes />
            case "fields":
                return <Fields />
        }
    }

    return (
        <>
            <Heading title="Administratoren-Bereich" cssClass='adminForm' />
            <Row>
                <Col xs={12} md={3} lg={2}>
                    <LeftNavigation
                        activeResource={activeResource} setActiveResource={setActiveResource}
                    />
                </Col>
                <Col xs={12} md={9} lg={9} xl={8} xxl={6}>
                    <ActiveResource />
                </Col>
                <Col lg={1} xl={2} xxl={4}>
                </Col>
            </Row>
        </>
    )
}