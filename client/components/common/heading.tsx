import {Col, Row} from 'react-bootstrap'
import React from 'react'

interface HeadingInterface {
    title: string
    cssClass: string
}

export default function Heading({title, cssClass }: HeadingInterface) {
    return (
        <Row className={"heading " + cssClass }>
            <Col>
                <h5>{title}</h5>
            </Col>
        </Row>
    )
}