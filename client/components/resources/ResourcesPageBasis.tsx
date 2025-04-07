import { Col, Row } from 'react-bootstrap'
import { Heading } from '../headings/Heading.js'
import { ResourcePage } from './ResourcePage.js'
import { Resource } from './resourceList.js'
import { ResourceNavigation } from './ResourceNavigation.js'
import { useState } from 'react'

export function ResourcesPageBasis() {
    const [activeResource, setActiveResource] = useState<Resource>({ name: 'Beziehung', paths: { all: '/company-types/', single: '/company-types/{id}' }, empty: { meta: { location: 0, etag: '' }, data: { name: '' } } })
    const [isResourceChanged, setIsResourceChanged] = useState(false)

    return (
        <>
            <Heading title='Allgemeine Ressourcen' cssClass='resPage' />
            <Row className='flex-grow-1 d-flex'>
                <Col xs={12} md={3} lg={2}>
                    <ResourceNavigation
                        activeResource={activeResource} setActiveResource={setActiveResource}
                        setIsResourceChanged={setIsResourceChanged}
                    />
                </Col>
                <Col xs={12} md={9} lg={9} xl={8} xxl={6}>
                    <ResourcePage resource={activeResource}
                        isResourceChanged={isResourceChanged} setIsResourceChanged={setIsResourceChanged}
                    />
                </Col>
                <Col lg={1} xl={2} xxl={4}>
                </Col>
            </Row>
        </>
    )
}