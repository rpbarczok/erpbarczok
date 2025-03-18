import React from "react"
import { Container, Modal, Spinner } from "react-bootstrap"

export const Loading = () => {
    return <Container fluid className="d-flex flex-column vh-100 align-items-center justify-content-center">
        <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    </Container>
}

export const ModalLoading = ({ show, setShow }: { show: boolean, setShow: React.Dispatch<React.SetStateAction<boolean>> }) => {
    return <Modal size="lg" backdrop centered show={show} onHide={() => setShow(false)} animation={false}>
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </Modal>
}