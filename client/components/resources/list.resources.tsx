import { DataWithMeta } from "components/forms.jsx"
import { CompanyType } from "./companyTypes/companyTypes.jsx"
import { Field, InputFields } from "./fields/fields.jsx"
import { Note, Notes } from "components/notifiers/notifiers.jsx"
import { Resource } from "./resourceList.js"
import { useAuth } from "react-oidc-context"
import React, { useState } from "react"
import { Button, ButtonGroup, Form, ListGroup, Modal } from "react-bootstrap"
import { client } from "utils/openAPIClientAxios.js"
import { useNotifier } from "components/notifiers/useNotifier.js"
import { InputCompanyTypes } from "./companyTypes/companyTypes.jsx"
import { useContextThrowUndefined } from "utils/contextUndefined.js"
import { PermissionContext, updateUserPermissions } from "utils/permissionContext.js"

interface ListItemComponent {
    item: DataWithMeta<Field | CompanyType>
    setIsItemChanged: React.Dispatch<React.SetStateAction<boolean>>
    addMainNote: (note: Note) => void
    resource: Resource
}

interface ActiveResourceComponent {
    resource: Resource
    changedItem: DataWithMeta<Field | CompanyType>
    setChangedItem: React.Dispatch<React.SetStateAction<DataWithMeta<Field | CompanyType>>>
}

const ActiveResource = ({ resource, changedItem, setChangedItem }: ActiveResourceComponent) => {
    switch (resource.name) {
        case 'Beziehung':
            return <InputCompanyTypes
                companyType={changedItem}
                setCompanyType={setChangedItem}
            />
        case 'Branche':
            return <InputFields
                field={changedItem}
                setField={setChangedItem} />
        default:
            <p>No Content</p>
    }

}

export const ListItem = ({ resource, setIsItemChanged, addMainNote, item }: ListItemComponent) => {
    const [show, setShow] = useState(false)
    const [validated, setValidated] = useState<boolean>(false)
    const [changedItem, setChangedItem] = useState<DataWithMeta<CompanyType | Field>>(item)
    const [notes, addNote, removeNote] = useNotifier()
    const { permissions, setPermissions } = useContextThrowUndefined(PermissionContext)
    const isNotChanged = changedItem.data === item.data
    const auth = useAuth()
    const token = auth.user?.access_token

    const handleModal = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setShow(true)
    }

    const handleClose = () => {
        setValidated(false)
        setShow(false)
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>, changedItem: DataWithMeta<CompanyType | Field>) => {
        const form = e.currentTarget
        e.preventDefault()
        e.stopPropagation()
        if (form.checkValidity() === false) {
            setValidated(true)
        } else {
            client.paths[resource.paths['single']].put({ id: changedItem.meta.location, 'if-match': changedItem.meta.etag }, changedItem.data, { headers: { Authorization: `Bearer ${token}` } })
                .then(result => {
                    const note: Note = {
                        message: `Die Beziehungsart wurde erfolgreich geändert.`,
                        variant: 'success'
                    }
                    addMainNote(note)
                    setShow(false)
                    setIsItemChanged(true)
                    updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                })
                .catch(error => {
                    const note: Note = {
                        message: `Fehler beim Ändern der Beziehung: ${error.message}`,
                        variant: 'danger'
                    }
                    addNote(note)
                })
        }
    }

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const userConfirmed = window.confirm(`Willst du die ${resource.name} '${item.data.name}' wirklich löschen?`)
        if (userConfirmed) {
            client.paths[resource.paths['single']].delete(item.meta.location, null, { headers: { Authorization: `Bearer ${token}` } })
                .then(result => {
                    setIsItemChanged(true)
                    const note: Note = {
                        variant: 'warning',
                        message: `${resource.name} wurde gelöscht.`,
                    }
                    if (setShow) {
                        setShow(false)
                    }
                    addNote(note)
                    updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                })
                .catch(error => {
                    const note: Note = {
                        variant: 'danger',
                        message: `Löschen der ${resource.name} hat nicht geklappt: ${error.message}`,
                    }
                    addNote(note)
                })

        }
    }

    const handleUndo: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()
        setValidated(false)
        setChangedItem(item)
    }

    return (
        <>
            <ListGroup.Item className="standardDesign" onClick={handleModal}>
                {item.data.name}
            </ListGroup.Item>
            <Modal show={show} onHide={() => handleClose()}>
                <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e, changedItem)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{resource.name} {item.data.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Notes notes={notes} removeNote={removeNote} />
                        <ActiveResource
                            resource={resource}
                            changedItem={changedItem} setChangedItem={setChangedItem} />
                    </Modal.Body>
                    <Modal.Footer>
                        <ButtonGroup className="w-100">
                            <Button size="sm" variant='outline-primary' onClick={handleUndo} disabled={isNotChanged}>Undo</Button>
                            <Button type="submit" variant='outline-primary' disabled={isNotChanged}>Speichern</Button>
                            <Button size="sm" variant="outline-danger" onClick={handleDelete}>Löschen</Button>
                            <Button size="sm" variant="outline-secondary" onClick={() => setShow(false)}>Abbrechen</Button>
                        </ButtonGroup>
                    </Modal.Footer>
                </Form>

            </Modal>
        </>
    )
}
