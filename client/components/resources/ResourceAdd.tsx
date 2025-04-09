import { apiClient } from '../../utils/openAPIClientAxios.js'
import { Button, ButtonGroup, Form, Modal } from 'react-bootstrap'
import { CompanyType, CompanyTypesInput } from './companyTypes/CompanyTypesInput.jsx'
import { DataWithMeta } from '../Pages.jsx'
import { Field, FieldsInput } from './fields/Fields.jsx'
import { LoadingContext } from '../../utils/loadingContext.js'
import { Note, Notes } from '../notifiers/Notes.jsx'
import { PermissionContext, updateUserPermissions } from '../../utils/permissionContext.js'
import { Resource } from './resourceList.js'
import { SetStateAction, useState } from 'react'
import { useAuth } from 'react-oidc-context'
import { useContextThrowUndefined } from '../../utils/contextUndefined.js'
import { useNotifier } from 'components/notifiers/useNotifier.js'


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

export const ActiveResource = ({ resource, newItem, setNewItem }: ActiveResourceComponent) => {
    switch (resource.name) {
        case 'Beziehung':
            return <CompanyTypesInput
                companyType={newItem}
                setCompanyType={setNewItem}
            />
        case 'Branche':
            return <FieldsInput
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
    const { permissions, setPermissions } = useContextThrowUndefined(PermissionContext)
    const auth = useAuth()
    const [addItemCount, setAddItemCount] = useState(0)
    const { setIsLoading } = useContextThrowUndefined(LoadingContext)

    const handleModal = () => {
        setAddItemCount(addItemCount + 1)
        setShow(true)
    }

    const handleClose = () => {
        setValidated(false)
        setShow(false)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget
        e.preventDefault()
        const token = auth.user?.access_token
        if (token) {
            if (!form.checkValidity()) {
                setValidated(true)
            }
            else {
                setIsLoading(true)
                try {
                    const client = await apiClient
                    const result = await client.paths[resource.paths.all].post(null, newItem.data, { headers: { Authorization: `Bearer ${token}` } })
                    setIsLoading(false)
                    const note: Note = {
                        message: `Eine neue Entität wurde erfolgreich abgespeichert.`,
                        variant: 'success'
                    }
                    addMainNote(note)
                    setShow(false)
                    setIsItemChanged(true)
                    if (typeof result.headers.permissions === 'string') {
                        updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                    } else {
                        throw Error('Permissions header should be type string.')
                    }
                } catch (error) {
                    setIsLoading(false)
                    const note: Note = {
                        message: `Fehler beim Speichern der neuen Entität:  ${error instanceof Error ? error.message : String(error)}`,
                        variant: 'danger',
                    }
                    addNote(note)
                }
            }
        }
    }


    return (<>
        <Button variant='outline-primary' onClick={handleModal}>{resource.name} hinzufügen</Button>
        <Modal key={'newItem' + String(addItemCount)} show={show} onHide={() => handleClose()}>
            <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e)}>
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
                    <ButtonGroup className='w-100'>
                        <Button type='submit' variant='outline-primary'>Speichern</Button>
                        <Button size='sm' variant='outline-secondary' onClick={() => setShow(false)}>Abbrechen</Button>
                    </ButtonGroup>
                </Modal.Footer>
            </Form>

        </Modal>
    </>
    )
}

