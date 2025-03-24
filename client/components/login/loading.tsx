import './login.css'
import React, { useEffect, useState } from "react"
import { Col, Container, Modal, Row, Spinner } from "react-bootstrap"

export const LoginLoading = () => {
    return <Container fluid className="d-flex flex-column vh-100 align-items-center justify-content-center">
        <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    </Container>
}

export const DataLoading = () => {
    const [showLoading, setShowLoading] = useState(false)

    useEffect(() => {
        const timer = setInterval(() => setShowLoading(true), 500)
        return () => clearInterval(timer)
    }, [])

    if (!showLoading) return <></>

    return <Modal backdropClassName='transparent-backdrop' backdrop show centered animation={false}>
        <Modal.Body>
            <Row>
                <Col className="d-flex justify-content-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </Col>
            </Row>
            <Row >
                <Col className="d-flex justify-content-center">
                    Test-Version. Laden kann bis 30 Sekunden dauern...
                </Col>
            </Row>
        </Modal.Body>
    </Modal>
}