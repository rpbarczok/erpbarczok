import { Button, ButtonGroup, Form, ListGroup, Modal } from 'react-bootstrap'
import { DataWithMeta } from '../Pages.jsx'
import { Note, Notes } from '../notifiers/Notes.jsx'
import { ResourceDescriptionType, ResourceType } from './resourceList.js'
import { useNotifier } from '../notifiers/useNotifier.js'
import { useState } from 'react'
import { ActiveResource } from './ActiveResource.js'

interface ResourcesListProps {
    item: DataWithMeta<ResourceType>
    addMainNote: (note: Note) => void
    resource: ResourceDescriptionType
    submitChangedResource: (changedItem: DataWithMeta<ResourceType>) => Promise<Note>
    deleteResource: (item: DataWithMeta<ResourceType>) => Promise<Note>
}

export const ResourcesList = ({ resource, addMainNote, item, submitChangedResource, deleteResource }: ResourcesListProps) => {
    const [show, setShow] = useState(false)
    const [validated, setValidated] = useState<boolean>(false)
    const [changedItem, setChangedItem] = useState<DataWithMeta<ResourceType>>(item)
    const [notes, addNote, removeNote] = useNotifier()
    const isNotChanged = changedItem.data === item.data
    const handleModal = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setShow(true)
    }

    const handleClose = () => {
        setValidated(false)
        setChangedItem(item)
        setShow(false)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, form: HTMLFormElement) => {
        e.preventDefault()

        if (!form.checkValidity()) {
            setValidated(true)
        } else {

            const newNote = await submitChangedResource(changedItem)

            if (newNote.variant === 'success') {
                addMainNote(newNote)
                setShow(false)
            } else {
                addNote(newNote)
            }

        }

    }

    const handleDelete = async () => {
        const userConfirmed = window.confirm(`Willst du die ${resource.name} '${item.data.name}' wirklich löschen?`)
        if (userConfirmed) {
            const newNote = await deleteResource(item)
            if (newNote.variant === 'warning') {
                setShow(false)
                addMainNote(newNote)
            } else {
                addNote(newNote)
            }

        }
    }

    const handleUndo: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()
        setValidated(false)
        setChangedItem(item)
    }
    return (
        <>
            <ListGroup.Item onClick={handleModal}>
                {item.data.name}
            </ListGroup.Item>
            <Modal show={show} onHide={() => handleClose()}>
                <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e, e.currentTarget)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{resource.name} {item.data.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Notes notes={notes} removeNote={removeNote} />
                        <ActiveResource
                            resource={resource}
                            item={changedItem} setItem={setChangedItem} />
                    </Modal.Body>
                    <Modal.Footer>
                        <ButtonGroup className='w-100'>
                            <Button size='sm' variant='outline-primary' onClick={handleUndo} disabled={isNotChanged}>Undo</Button>
                            <Button type='submit' variant='outline-primary' disabled={isNotChanged}>Speichern</Button>
                            <Button size='sm' variant='outline-danger' onClick={handleDelete}>Löschen</Button>
                            <Button size='sm' variant='outline-secondary' onClick={() => handleClose()}>Abbrechen</Button>
                        </ButtonGroup>
                    </Modal.Footer>
                </Form>

            </Modal>
        </>
    )
}

