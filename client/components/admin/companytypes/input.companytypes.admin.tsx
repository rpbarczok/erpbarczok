import '../../../style.css'
import '../admin.css'
import { Form, Modal, Row, Col, Button } from "react-bootstrap"
import { ChangeEvent, MouseEventHandler } from "react"
import { Companytype } from "components/companies/companies.jsx"
import { DataWithMeta } from 'components/app.js'

interface InputCompanytypesInterface {
    show: boolean
    setShow: React.Dispatch<React.SetStateAction<boolean>>
    handleSubmit: Function
    companytype: DataWithMeta<Companytype> | undefined
    setCompanytype: React.Dispatch<React.SetStateAction<DataWithMeta<Companytype>|undefined>>
    title: string
}

const InputCompanytypes = ({ show, setShow, handleSubmit, companytype, setCompanytype, title }: InputCompanytypesInterface) => {

    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setCompanytype({
            meta: companytype?companytype.meta: {location: 0, etag:''},
            data: {
                name: e.target.value
            }
        })
    }

    return (
        <Form>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <Form.Group controlId="formFirmenname">
                                <Form.Label>Firmenname</Form.Label>
                                <Form.Control type="text" value={companytype?companytype.data.name:''} onChange={handleChangeName} />
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>Abbrechen</Button>
                    <Button type="submit" variant='primary' onClick={(e) => handleSubmit(e, companytype)}>Abspeichern</Button>
                </Modal.Footer>
            </Modal>
        </Form>
    )
}

export default InputCompanytypes