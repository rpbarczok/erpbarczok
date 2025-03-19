import React from "react"
import { Container, Modal, Spinner } from "react-bootstrap"

export const LoginLoading = () => {
    return <Container fluid className="d-flex flex-column vh-100 align-items-center justify-content-center">
        <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    </Container>
}

export const DataLoading = () => {
    return <Modal className="d-flex justify-content-center" backdrop show centered animation={false}>
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </Modal>
}