import { Button, ButtonGroup, Form, Modal } from "react-bootstrap"
import { Resource } from "./resourceList.js"
import React, { SetStateAction, useState } from "react"
import { useAuth } from "react-oidc-context"
import { client } from "utils/openAPIClientAxios.js"
import { Field, InputFields } from "./fields/fields.jsx"
import { CompanyType, InputCompanyTypes } from "./companyTypes/companyTypes.jsx"
import { DataWithMeta } from "components/forms.jsx"
import { Note, Notes } from "components/notifiers/notifiers.jsx"
import { useNotifier } from "components/notifiers/useNotifier.js"

interface AddResourceComponent {
    resource: Resource
    addMainNote: (note: Note) => void
    setIsItemChanged: React.Dispatch<React.SetStateAction<boolean>>
}

interface ActiveResourceComponent {
    resource: Resource
    newItem: DataWithMeta<Field | CompanyType>
    setNewItem: React.Dispatch<SetStateAction<DataWithMeta<Field | CompanyType>>>
}

export const ActiveResource = ({resource, newItem, setNewItem}: ActiveResourceComponent) => {
    switch (resource.name) {
        case 'Beziehung':
            return <InputCompanyTypes
                companyType={newItem}
                setCompanyType={setNewItem}
            />
        case 'Branche':
            return <InputFields
                field={newItem}
                setField={setNewItem} />
        default:
            <p>No Content</p>
    }

}

export const AddResources = ({ resource, addMainNote, setIsItemChanged }: AddResourceComponent) => {
    const [show, setShow] = useState(false)
    const [validated, setValidated] = useState(false)
    const [newItem, setNewItem] = useState<DataWithMeta<Field | CompanyType>>(resource.empty)
    const [notes, addNote, removeNote] = useNotifier()

    const auth = useAuth()

    const handleModal = () => {
        setShow(true)
    }

    const handleClose = () => {
        setValidated(false)
        setShow(false)
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>, item: DataWithMeta<CompanyType | Field>) => {
        const form = e.currentTarget
        e.preventDefault()
        const token = auth.user?.access_token
        if (form.checkValidity() === false) {
            setValidated(true)
            client.paths[resource.paths['all']].post(null, newItem.data, { headers: { Authorization: `Bearer ${token}` } })
                .then((res) => {
                    const note: Note = {
                        message: `Eine neue Beziehungsart wurde erfolgreich abgespeichert.`,
                        variant: 'success'
                    }
                    addMainNote(note)
                    setShow(false)
                    setIsItemChanged(true)
                })
                .catch(error => {
                    const note: Note = {
                        message: `Fehler beim Speichern der neuen Beziehungsart: ${error.message}`,
                        variant: 'danger',
                    }
                    addNote(note)
                })
        }
    }

    return (<>
            <Button variant="outline-primary" onClick={handleModal}>{resource.name} hinzufügen</Button>
            <Modal show={show} onHide={() => handleClose()}>
                <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e, newItem)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{resource.name} hinzufügen</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Notes notes={notes} removeNote={removeNote} />
                        <ActiveResource 
                        resource={resource}
                        newItem={newItem} setNewItem={setNewItem}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <ButtonGroup className="w-100">
                            <Button type="submit" variant='outline-primary'>Speichern</Button>
                            <Button size="sm" variant="outline-secondary" onClick={() => setShow(false)}>Abbrechen</Button>
                        </ButtonGroup>
                    </Modal.Footer>
                </Form>

            </Modal>
        </>
    )
}

