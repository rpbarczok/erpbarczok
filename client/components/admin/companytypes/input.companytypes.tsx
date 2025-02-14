import '../../../style.css'
import '../admin.css'
import { Form, Modal, Button } from "react-bootstrap"
import React, { ChangeEvent, useState } from "react"
import { Companytype } from './companytypes.jsx'
import { DataWithMeta } from 'components/forms.jsx'
import { client } from 'utils/openapiclientaxios.js'
import { Note } from 'components/notifiers/notifiers.jsx'
import { useNotifier } from 'components/notifiers/useNotifier.js'

interface InputCompanytypesInterface {
    show: boolean
    setShow: React.Dispatch<React.SetStateAction<boolean>>
    companytype: DataWithMeta<Companytype>
    title: string
    setIsCompanytypeChanged: React.Dispatch<React.SetStateAction<boolean>>
    addMainNote: (note: Note) => void
}

export const InputCompanytypes = ({ companytype, title, show, setShow, setIsCompanytypeChanged, addMainNote }: InputCompanytypesInterface) => {

    const [changedCompanytype, setChangedCompanytype] = useState<DataWithMeta<Companytype>>(companytype)
    const [notes, addNote, removeNote] = useNotifier()
    const [validated, setValidated] = useState<boolean>(false)

    const isNotChanged: boolean = (companytype.data.name === changedCompanytype.data.name)

    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setChangedCompanytype({
            meta: companytype.meta,
            data: { name: e.target.value }
        })
    }

    const handleClose = () => {
        setValidated(false)
        setShow(false)
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>, companytype: DataWithMeta<Companytype>) => {
        const form = e.currentTarget
        e.preventDefault()
        e.stopPropagation()
        if (form.checkValidity() === false) {
            setValidated(true)
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

    return (
        <Modal show={show} onHide={() => handleClose()}>
            <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e, changedCompanytype)}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="formFirmenname">
                        <Form.Label>Firmenname</Form.Label>
                        <Form.Control required type="text" value={changedCompanytype.data.name} onChange={handleChangeName} />
                        <Form.Control.Feedback type="invalid">
                            Bitte eine Firmenrolle eintragen.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    {changedCompanytype.data.name === '' || isNotChanged ? '' : <Button type="submit" variant='primary'>Abspeichern</Button>}
                    <Button variant="secondary" onClick={() => handleClose()}>Abbrechen</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}