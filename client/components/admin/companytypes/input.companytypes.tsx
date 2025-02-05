import '../../../style.css'
import '../admin.css'
import { Form, Modal, Row, Col, Button } from "react-bootstrap"
import { ChangeEvent, MouseEventHandler } from "react"
import { Companytype } from './companytypes.jsx'
import { DataWithMeta } from 'components/forms.jsx'
import { Notifiers, Notifier } from 'components/notifiers/notifiers.jsx'

interface InputCompanytypesInterface {
    show: boolean
    setShow: React.Dispatch<React.SetStateAction<boolean>>
    handleSubmit: Function
    companytype: DataWithMeta<Companytype> | undefined
    setCompanytype: React.Dispatch<React.SetStateAction<DataWithMeta<Companytype> | undefined>>
    title: string
    notifiers: Notifier[]
    removeNotifier: (notifier: Notifier) => void
}

const InputCompanytypes = ({ show, setShow, handleSubmit, companytype, setCompanytype, title, notifiers, removeNotifier }: InputCompanytypesInterface) => {

    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setCompanytype({
            meta: companytype ? companytype.meta : { location: 0, etag: '' },
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
                    <Notifiers removeNotifier={removeNotifier} notifiers={notifiers} label='addCompanytypes' />
                    <Row>
                        <Col>
                            <Form.Group controlId="formFirmenname">
                                <Form.Label>Firmenname</Form.Label>
                                <Form.Control type="text" value={companytype ? companytype.data.name : ''} onChange={handleChangeName} />
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