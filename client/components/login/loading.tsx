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
        const timer = setInterval(() => setShowLoading(true), 1000)
        return () => clearInterval(timer)
    }, [])

    return <Modal  backdropClassName='transparent-backdrop' backdrop show centered animation={false}>
        <Modal.Body as='div' style={{border: '0px !important'}}>
            <Row>
                <Col className="d-flex justify-content-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </Col>
            </Row>
            {showLoading?<Row ><Col className="d-flex justify-content-center"><h4>Auf Containerstart warten...</h4></Col></Row>:<></>}
        </Modal.Body>
    </Modal>
}