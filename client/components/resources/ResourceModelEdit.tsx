import { FunctionComponent, useState } from "react"
import { Resource, ResourcePayloadAndDescription } from "./resourceList.js"
import { Note, Notes } from "components/notifiers/Notes.js"
import { useNotifier } from "components/notifiers/useNotifier.js"
import { Button, ButtonGroup, Form, Modal } from "react-bootstrap"
import { ActiveResource } from "./ActiveResource.js"

interface ResourceModelEdit {
    item: ResourcePayloadAndDescription<Resource>
    show: boolean
    setShow: React.Dispatch<React.SetStateAction<boolean>>
    addMainNote: (note: Note) => void
    submitChangedResource: ({ description, item }: ResourcePayloadAndDescription<Resource>) =>  Promise<Note>
    deleteResource: ({ description, item }: ResourcePayloadAndDescription<Resource>) => Promise<Note>
}

export const ResourceModelEdit: FunctionComponent<ResourceModelEdit> = ({ item, show, setShow, addMainNote, deleteResource, submitChangedResource }) => {

    const [changedItem, setChangedItem] = useState<ResourcePayloadAndDescription<Resource>>(item)
    const [validated, setValidated] = useState<boolean>(false)
    const [notes, addNote, removeNote] = useNotifier()
    const isNotChanged = item.item.data === changedItem.item.data

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
        const userConfirmed = window.confirm(`Willst du die ${item.description.name} '${item.item.data.name}' wirklich löschen?`)
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

    const handleClose = () => {
        setValidated(false)
        setShow(false)
    }

    return (<Modal show={show} onHide={() => handleClose()}>
        <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e, e.currentTarget)}>
            <Modal.Header closeButton>
                <Modal.Title>{item.description.name} {item.item.data.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Notes notes={notes} removeNote={removeNote} />
                <ActiveResource
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

    </Modal>)
}
