import '../../style.css'
import './resources.css'
import { Row, Col } from 'react-bootstrap'
import { Heading } from '../headings/heading.jsx'
import { ResourceNavigation } from './nav.resources.jsx'
import { useState } from 'react'
import { MainResources } from './main.resources.jsx'
import { Resource } from './resourceList.js'

export function Resources() {
    const [activeResource, setActiveResource] = useState<Resource>({ name: "Beziehung", paths: { all: '/company-types/', single: '/company-types/{id}' }, empty: {meta: {location: 0, etag: ''}, data: {name: ''}}})
    const [isResourceChange, setIsResourceChanged] = useState(false)
    
    return (
        <>
            <Heading title="Allgemeine Ressourcen" cssClass='resForm' />
            <Row className="flex-grow-1 d-flex">
                <Col xs={12} md={3} lg={2}>
                    <ResourceNavigation
                        activeResource={activeResource} setActiveResource={setActiveResource}
                        setIsResourceChanged={setIsResourceChanged}
                    />
                </Col>
                <Col xs={12} md={9} lg={9} xl={8} xxl={6}>
                    <MainResources resource={activeResource}
                    isResourceChanged={isResourceChange} setIsResourceChanged={setIsResourceChanged}
                    />
                </Col>
                <Col lg={1} xl={2} xxl={4}>
                </Col>
            </Row>
        </>
    )
}