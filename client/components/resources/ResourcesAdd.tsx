import { Button, ButtonGroup, Form, Modal } from 'react-bootstrap'
import { DataWithMeta } from '../Pages.js'
import { Note, Notes } from '../notifiers/Notes.js'
import { Resource, ResourceType } from './resourceList.js'
import { FunctionComponent, useState } from 'react'
import { useNotifier } from 'components/notifiers/useNotifier.js'
import { ActiveResource } from './ActiveResource.js'

interface ResourcesAddProps {
    resource: Resource
    addMainNote: (note: Note) => void
    submitNewResource: (newItem: DataWithMeta<ResourceType>) => Promise<Note>
}

export const ResourcesAdd: FunctionComponent<ResourcesAddProps> = ({ resource, addMainNote, submitNewResource }) => {
    const [show, setShow] = useState(false)
    const [validated, setValidated] = useState(false)
    const [newItem, setNewItem] = useState<DataWithMeta<ResourceType>>(resource.empty)
    const [notes, addNote, removeNote] = useNotifier()
    const [addItemCount, setAddItemCount] = useState(0)

    const handleModal = () => {
        setAddItemCount(addItemCount + 1)
        setShow(true)
    }

    const handleClose = () => {
        setValidated(false)
        setShow(false)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, form: HTMLFormElement) => {

        e.preventDefault()
        if (!form.checkValidity()) {
            setValidated(true)
        }
        else {
            const newNote: Note = await submitNewResource(newItem)
            if (newNote.variant === 'success') {
                addMainNote(newNote)
                setShow(false)
            } else {
                addNote(newNote)
            }
        }

    }


    return (<>
        <Button variant='outline-primary' onClick={handleModal}>{resource.name} hinzufügen</Button>
        <Modal key={'newItem' + String(addItemCount)} show={show} onHide={() => handleClose()}>
            <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e, e.currentTarget)}>
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

