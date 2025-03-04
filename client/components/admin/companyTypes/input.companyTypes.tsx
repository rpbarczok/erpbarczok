import '../../../style.css'
import '../admin.css'
import { Form, Modal, Button } from "react-bootstrap"
import React, { ChangeEvent, useState } from "react"
import { CompanyType } from './companyTypes.jsx'
import { DataWithMeta } from 'components/forms.jsx'
import { client } from 'utils/openAPIClientAxios.js'
import { Note } from 'components/notifiers/notifiers.jsx'
import { useNotifier } from 'components/notifiers/useNotifier.js'
import { useAuth } from 'react-oidc-context'

interface InputCompanyTypesInterface {
    show: boolean
    setShow: React.Dispatch<React.SetStateAction<boolean>>
    companyType: DataWithMeta<CompanyType>
    title: string
    setIsCompanyTypeChanged: React.Dispatch<React.SetStateAction<boolean>>
    addMainNote: (note: Note) => void
}

export const InputCompanyTypes = ({ companyType, title, show, setShow, setIsCompanyTypeChanged, addMainNote }: InputCompanyTypesInterface) => {

    const [changedCompanyType, setChangedCompanyType] = useState<DataWithMeta<CompanyType>>(companyType)
    const [notes, addNote, removeNote] = useNotifier()
    const [validated, setValidated] = useState<boolean>(false)
    const auth = useAuth()
    const isNotChanged: boolean = (companyType.data.name === changedCompanyType.data.name)

    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setChangedCompanyType({
            meta: companyType.meta,
            data: { name: e.target.value }
        })
    }

    const handleClose = () => {
        setValidated(false)
        setShow(false)
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>, companyType: DataWithMeta<CompanyType>) => {
        const form = e.currentTarget
        e.preventDefault()
        e.stopPropagation()
        const token=auth.user?.access_token
        if (form.checkValidity() === false) {
            setValidated(true)
        } else {
            if (changedCompanyType.meta.location === 0) {
                client.postCompanyType(null, changedCompanyType.data, { headers: { Authorization: `Bearer ${token}` }})
                    .then((res) => {
                        const note: Note = {
                            message: `Die neue Firmenrolle wurde erfolgreich abgespeichert.`,
                            variant: 'success'
                        }
                        addMainNote(note)
                        setShow(false)
                        setIsCompanyTypeChanged(true)
                    })
                    .catch(error => {
                        const note: Note = {
                            message: `Fehler beim Speichern der neuen Firmenrolle: ${error.message}`,
                            variant: 'danger',
                        }
                        addNote(note)
                    })
            } else {
                client.putCompanyTypeById({ id: changedCompanyType.meta.location, 'if-match': changedCompanyType.meta.etag }, changedCompanyType.data,{ headers: { Authorization: `Bearer ${token}` }})
                    .then((res) => {
                        const note: Note = {
                            message: `Die Firmenrolle wurde erfolgreich geändert.`,
                            variant: 'success'
                        }
                        addMainNote(note)
                        setShow(false)
                        setIsCompanyTypeChanged(true)
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
            <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e, changedCompanyType)}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="formFirmenname">
                        <Form.Label>Firmenname</Form.Label>
                        <Form.Control required type="text" value={changedCompanyType.data.name} onChange={handleChangeName} />
                        <Form.Control.Feedback type="invalid">
                            Bitte eine Firmenrolle eintragen.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    {changedCompanyType.data.name === '' || isNotChanged ? '' : <Button type="submit" variant='primary'>Speichern</Button>}
                    <Button variant="secondary" onClick={() => handleClose()}>Abbrechen</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}