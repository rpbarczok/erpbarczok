import { apiClient } from '../../utils/openAPIClientAxios.js'
import { Button, ButtonGroup, Form, ListGroup, Modal } from 'react-bootstrap'
import { CompanyType } from './companyTypes/CompanyTypesInput.jsx'
import { DataWithMeta } from '../Pages.jsx'
import { Field, FieldsInput } from './fields/Fields.jsx'
import { CompanyTypesInput } from './companyTypes/CompanyTypesInput.jsx'
import { LoadingContext } from '../../utils/loadingContext.js'
import { Note, Notes } from '../notifiers/Notes.jsx'
import { PermissionContext, updateUserPermissions } from '../../utils/permissionContext.js'
import { Resource } from './resourceList.js'
import { useAuth } from 'react-oidc-context'
import { useContextThrowUndefined } from '../../utils/contextUndefined.js'
import { useNotifier } from '../notifiers/useNotifier.js'
import { useState } from 'react'
import { is$204Success } from 'utils/typeguards.js'


interface ResourceActiveInterface {
    resource: Resource
    changedItem: DataWithMeta<Field | CompanyType>
    setChangedItem: React.Dispatch<React.SetStateAction<DataWithMeta<Field | CompanyType>>>
}

const ResourceActive = ({ resource, changedItem, setChangedItem }: ResourceActiveInterface) => {
    switch (resource.name) {
        case 'Beziehung':
            return <CompanyTypesInput
                companyType={changedItem}
                setCompanyType={setChangedItem}
            />
        case 'Branche':
            return <FieldsInput
                field={changedItem}
                setField={setChangedItem} />
        default:
            <p>No Content</p>
    }

}

interface ResourcesListInterface {
    item: DataWithMeta<Field | CompanyType>
    setIsItemChanged: React.Dispatch<React.SetStateAction<boolean>>
    addMainNote: (note: Note) => void
    resource: Resource
}

export const ResourcesList = ({ resource, setIsItemChanged, addMainNote, item }: ResourcesListInterface) => {
    const [show, setShow] = useState(false)
    const [validated, setValidated] = useState<boolean>(false)
    const [changedItem, setChangedItem] = useState<DataWithMeta<CompanyType | Field>>(item)
    const [notes, addNote, removeNote] = useNotifier()
    const { permissions, setPermissions } = useContextThrowUndefined(PermissionContext)
    const isNotChanged = changedItem.data === item.data
    const auth = useAuth()
    const token = auth.user?.access_token
    const { setIsLoading } = useContextThrowUndefined(LoadingContext)
    const handleModal = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setShow(true)
    }

    const handleClose = () => {
        setValidated(false)
        setShow(false)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, changedItem: DataWithMeta<CompanyType | Field>) => {
        const form = e.currentTarget
        e.preventDefault()
        e.stopPropagation()
        if (token) {
            if (!form.checkValidity()) {
                setValidated(true)
            } else {
                setIsLoading(true)
                const client = await apiClient
                const result = await client.paths[resource.paths.single].put(
                    { id: changedItem.meta.location, 'if-match': changedItem.meta.etag },
                    changedItem.data,
                    { headers: { Authorization: `Bearer ${token}` } })
                setIsLoading(false)
                console.log(is$204Success(result))
                if (result.status === 204) {
                    const note: Note = {
                        message: `Die Entität wurde erfolgreich geändert.`,
                        variant: 'success'
                    }
                    addMainNote(note)
                    setShow(false)
                    setIsItemChanged(true)
                    if (typeof result.headers.permissions === 'string') {
                        updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                    } else {
                        throw new Error ('No permissions header found')
                    }
                } else {
                    const note: Note = {
                        message: `Fehler beim Ändern der Entität: Error status ${String(result.status)} ${String(result.message)}`,
                        variant: 'danger'
                    }
                    addNote(note)
                }
            }
        } else {
            const note: Note = {
                message: 'Nicht authentifiziert',
                variant: 'danger'
            }
            addNote(note)

        }
    }

    const handleDelete = async () => {
        if (token) {
            const userConfirmed = window.confirm(`Willst du die ${resource.name} '${item.data.name}' wirklich löschen?`)
            if (userConfirmed) {
                setIsLoading(true)
                const client = await apiClient
                const result = await client.paths[resource.paths.single].delete(item.meta.location, null, { headers: { Authorization: `Bearer ${token}` } })
                setIsLoading(false)
                if (result.status === 204) {
                    setIsItemChanged(true)
                    const note: Note = {
                        variant: 'warning',
                        message: `${resource.name} wurde gelöscht.`,
                    }
                    setShow(false)
                    addMainNote(note)
                    if (typeof result.headers.permissions === 'string') {
                        updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                    } else {
                        throw new Error ('No permissions header found')
                    }
                } else {
                    const note: Note = {
                        variant: 'danger',
                        message: `Löschen der ${resource.name} hat nicht geklappt: ${String(result.status)} ${String(result.data.message)}`,
                    }
                    addNote(note)
                }
            }
        } else {
            const note: Note = {
                message: 'Nicht authentifiziert',
                variant: 'danger'
            }
            addNote(note)

        }

    }

    const handleUndo: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()
        setValidated(false)
        setChangedItem(item)
    }

    return (
        <>
            <ListGroup.Item  onClick={handleModal}>
                {item.data.name}
            </ListGroup.Item>
            <Modal show={show} onHide={() => handleClose()}>
                <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e, changedItem)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{resource.name} {item.data.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Notes notes={notes} removeNote={removeNote} />
                        <ResourceActive
                            resource={resource}
                            changedItem={changedItem} setChangedItem={setChangedItem} />
                    </Modal.Body>
                    <Modal.Footer>
                        <ButtonGroup className='w-100'>
                            <Button size='sm' variant='outline-primary' onClick={handleUndo} disabled={isNotChanged}>Undo</Button>
                            <Button type='submit' variant='outline-primary' disabled={isNotChanged}>Speichern</Button>
                            <Button size='sm' variant='outline-danger' onClick={handleDelete}>Löschen</Button>
                            <Button size='sm' variant='outline-secondary' onClick={() => setShow(false)}>Abbrechen</Button>
                        </ButtonGroup>
                    </Modal.Footer>
                </Form>

            </Modal>
        </>
    )
}

