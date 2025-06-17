import React, { FunctionComponent, useState } from "react";
import { Button, ButtonGroup, Form, Modal } from "react-bootstrap";
import { ActiveResource } from "./ActiveResource.js";
import { Note, Notes } from "components/notifiers/Notes.js";
import { useNotifier } from "components/notifiers/useNotifier.js";
import { Resource, ResourceDescription, ResourcePayloadAndDescription } from "./resourceList.js";

interface ResourceAddModalProps {
    show: boolean
    setShow: React.Dispatch<React.SetStateAction<boolean>>
    resource: ResourceDescription<Resource>
    submitNewResource: ({ description, item }: ResourcePayloadAndDescription<Resource>) =>  Promise<Note>
    addMainNote: (note: Note) => void
}

export const ResourcesAddModal: FunctionComponent<ResourceAddModalProps> = ({ show, setShow, resource, submitNewResource, addMainNote }) => {
    const [validated, setValidated] = useState(false)
    const [notes, addNote, removeNote] = useNotifier()
const [newItem, setNewItem] = useState<ResourcePayloadAndDescription<Resource>>({ description: resource, item: resource.empty })

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

    return (<Modal show={show} onHide={() => handleClose()}>
        <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e, e.currentTarget)}>
            <Modal.Header closeButton>
                <Modal.Title>{newItem.description.name} hinzufügen</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Notes notes={notes} removeNote={removeNote} />
                <ActiveResource
                    item={newItem} setItem={setNewItem}
                />
            </Modal.Body>
            <Modal.Footer>
                <ButtonGroup className='w-100'>
                    <Button type='submit' variant='outline-primary'>Speichern</Button>
                    <Button size='sm' variant='outline-secondary' onClick={() => setShow(false)}>Abbrechen</Button>
                </ButtonGroup>
            </Modal.Footer>
        </Form>

    </Modal>)
}
