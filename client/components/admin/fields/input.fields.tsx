import '../../../style.css'
import '../admin.css'
import { Form, Modal, Button } from "react-bootstrap"
import React, { ChangeEvent, useState } from "react"
import { Field } from './fields.jsx'
import { DataWithMeta } from 'components/forms.jsx'
import { client } from 'utils/openAPIClientAxios.js'
import { Note } from 'components/notifiers/notifiers.jsx'
import { useNotifier } from 'components/notifiers/useNotifier.js'
import { useAuth } from 'react-oidc-context'

interface InputFieldsInterface {
    show: boolean
    setShow: React.Dispatch<React.SetStateAction<boolean>>
    field: DataWithMeta<Field>
    title: string
    setIsFieldChanged: React.Dispatch<React.SetStateAction<boolean>>
    addMainNote: (note: Note) => void
}

export const InputFields = ({ field, title, show, setShow, setIsFieldChanged, addMainNote }: InputFieldsInterface) => {

    const [changedField, setChangedField] = useState<DataWithMeta<Field>>(field)
    const [notes, addNote, removeNote] = useNotifier()
    const [validated, setValidated] = useState<boolean>(false)
    const auth = useAuth()
    const isNotChanged: boolean = (field.data.name === changedField.data.name)

    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setChangedField({
            meta: field.meta,
            data: { name: e.target.value }
        })
    }

    const handleClose = () => {
        setValidated(false)
        setShow(false)
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>, field: DataWithMeta<Field>) => {
        const form = e.currentTarget
        e.preventDefault()
        e.stopPropagation()
        const token=auth.user?.access_token
        if (form.checkValidity() === false) {
            setValidated(true)
        } else {
            if (changedField.meta.location === 0) {
                client.postField(null, changedField.data, { headers: { Authorization: `Bearer ${token}` }})
                    .then((res) => {
                        const note: Note = {
                            message: `Die neue Firmenbranche wurde erfolgreich abgespeichert.`,
                            variant: 'success'
                        }
                        addMainNote(note)
                        setShow(false)
                        setIsFieldChanged(true)
                    })
                    .catch(error => {
                        const note: Note = {
                            message: `Fehler beim Speichern der neuen Firmenbranche: ${error.message}`,
                            variant: 'danger',
                        }
                        addNote(note)
                    })
            } else {
                client.putFieldById({ id: changedField.meta.location, 'if-match': changedField.meta.etag }, changedField.data,{ headers: { Authorization: `Bearer ${token}` }})
                    .then((res) => {
                        const note: Note = {
                            message: `Die Firmenbranche wurde erfolgreich geändert.`,
                            variant: 'success'
                        }
                        addMainNote(note)
                        setShow(false)
                        setIsFieldChanged(true)
                    })
                    .catch(error => {
                        const note: Note = {
                            message: `Fehler beim Ändern der Firmenbranche: ${error.message}`,
                            variant: 'danger'
                        }
                        addNote(note)
                    })
            }
        }
    }

    return (
        <Modal show={show} onHide={() => handleClose()}>
            <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e, changedField)}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="formFirmenname">
                        <Form.Label>Firmenname</Form.Label>
                        <Form.Control required type="text" value={changedField.data.name} onChange={handleChangeName} />
                        <Form.Control.Feedback type="invalid">
                            Bitte eine Firmenrolle eintragen.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    {changedField.data.name === '' || isNotChanged ? '' : <Button type="submit" variant='primary'>Abspeichern</Button>}
                    <Button variant="secondary" onClick={() => handleClose()}>Abbrechen</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}