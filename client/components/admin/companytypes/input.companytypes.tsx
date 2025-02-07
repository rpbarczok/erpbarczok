import '../../../style.css'
import '../admin.css'
import { Form, Modal, Row, Col, Button } from "react-bootstrap"
import React, { ChangeEvent, MouseEventHandler, useState } from "react"
import { Companytype } from './companytypes.jsx'
import { DataWithMeta } from 'components/forms.jsx'
import { client } from 'utils/openapiclientaxios.js'
import { Note, Notes } from 'components/notifiers/notifiers.jsx'
import { useNotifier } from 'components/notifiers/useNotifier.js'

interface InputCompanytypesInterface {
    show: boolean
    setShow: React.Dispatch<React.SetStateAction<boolean>>
    companytype: DataWithMeta<Companytype>
    title: string
    setIsCompanytypeChanged: React.Dispatch<React.SetStateAction<boolean>>
    addMainNote: (note: Note) => void
}

const InputCompanytypes = ({ companytype, title, show, setShow, setIsCompanytypeChanged, addMainNote }: InputCompanytypesInterface) => {

    const [changedCompanytype, setChangedCompanytype] = useState<DataWithMeta<Companytype>>(companytype)
    const [notes, addNote, removeNote] = useNotifier()

    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setChangedCompanytype({
            meta: companytype.meta,
            data: { name: e.target.value }
        })
    }

    const handleSubmit = (e: React.MouseEvent<Element>) => {
        e.preventDefault()
        if (changedCompanytype) {
            if (changedCompanytype.data.name === '') {
                const note: Note = {
                    message: `Bitte einen Namen eingeben.`,
                    variant: 'danger'
                }
                addNote(note)
            } else {
                if (changedCompanytype.meta.location === 0) {
                    client.postCompanytype(null, changedCompanytype.data)
                        .then((res) => {
                            const note: Note = {
                                message: `Die neue Firmenrolle wurde erfolgreich abgespeichert.`,
                                variant: 'success'
                            }
                            addMainNote(note)
                            setShow(false)
                            setIsCompanytypeChanged(true)
                        })
                        .catch(error => {
                            const note: Note = {
                                message: `Fehler beim Speichern der neuen Firmenrolle: ${error.message}`,
                                variant: 'danger',
                            }
                            addNote(note)
                        })
                } else {
                    if (changedCompanytype.data.name === companytype.data.name) {
                        const note: Note = {
                            message: `Es wurden keine Veränderungen festgestellt.`,
                            variant: 'info'
                        }
                        addNote(note)
                    } else {
                        client.putCompanytypeById({ id: changedCompanytype.meta.location, 'if-match': changedCompanytype.meta.etag }, changedCompanytype.data)
                            .then((res) => {
                                const note: Note = {
                                    message: `Die Firmenrolle wurde erfolgreich geändert.`,
                                    variant: 'success'
                                }
                                addMainNote(note)
                                setShow(false)
                                setIsCompanytypeChanged(true)
                            })
                            .catch(error => {
                                const note: Note = {
                                    message: `Fehler beim Ändern der Firmenrolle: ${error.message}`,
                                    variant: 'danger'
                                }
                                addNote(note)
                            })
                    }
                }
            }
        } else {
            const note: Note = {
                message: `Bitte eine Bezeichnung für die Firmenrolle eingeben.`,
                variant: 'danger',
            }
            addNote(note)
        }
    }

    return (
        <Form>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Notes notes={notes} removeNote={removeNote} />
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="formFirmenname">
                                <Form.Label>Firmenname</Form.Label>
                                <Form.Control type="text" value={changedCompanytype.data.name} onChange={handleChangeName} />
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>Abbrechen</Button>
                    <Button type="submit" variant='primary' onClick={(e) => handleSubmit(e)} >Abspeichern</Button>
                </Modal.Footer>
            </Modal>
        </Form>
    )
}

export default InputCompanytypes