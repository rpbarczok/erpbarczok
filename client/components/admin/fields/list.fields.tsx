import React, { useState } from 'react'
import '../../../style.css'
import '../admin.css'
import { Field } from './fields.jsx'
import { DataWithMeta } from 'components/forms.jsx'
import { Button, ButtonGroup, Col, ListGroup, Row } from "react-bootstrap"
import { Pencil, Trash, Plus } from "react-bootstrap-icons"
import { InputFields } from './input.fields.jsx'
import { client } from 'utils/openAPIClientAxios.js'
import { Note } from 'components/notifiers/notifiers.js'
import { useAuth } from 'react-oidc-context'


interface ListFieldsComponent {
    fullList: DataWithMeta<Field>[]
    setIsFieldChanged: React.Dispatch<React.SetStateAction<boolean>>
    addMainNote: (note: Note) => void
}

interface ListItemComponent {
    field: DataWithMeta<Field>
    setIsFieldChanged: React.Dispatch<React.SetStateAction<boolean>>
    addMainNote: (note: Note) => void
}

const ListItem = ({ field, setIsFieldChanged, addMainNote }: ListItemComponent) => {
    const auth = useAuth()
    const title = 'Neue Firmenrolle anlegen'
    const [show, setShow] = useState(false)


    const handleModal = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setShow(true)
    }

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const token = auth.user?.access_token
        const userConfirmed = window.confirm(`Willst du wirklich die Firmenrolle ${field.data.name} löschen?`)
        if (userConfirmed) {
            client.deleteFieldById(field.meta.location, null, { headers: { Authorization: `Bearer ${token}` }})
                .then((res) => {
                    const note: Note = {
                        message: 'Die Firmenrolle wurde erfolgreich gelöscht.',
                        variant: 'info',
                    }
                    addMainNote(note)
                    setIsFieldChanged(true)
                })
                .catch(error => {
                    if (error.status === 409) {
                        const note: Note = {
                            message: `Die Firmenrolle konnte nicht gelöscht werden, weil sie noch referenziert wird.`,
                            variant: 'danger',
                        }
                        addMainNote(note)
                    } else {
                        const note: Note = {
                            message: `Fehler beim Löschen der Firmenrolle: ${error.message}`,
                            variant: 'danger'
                        }
                        addMainNote(note)
                    }
                })
        }
    }

    return (
        <ListGroup.Item className="standardDesign lineWithButton">
            <Row>
                <Col xs={6}>
                    <span>{field.meta.location === 0 ? title : field.data.name}</span>
                </Col>
                <Col xs={6}>
                    <ButtonGroup className="standard float-end">
                        <Button className="standardDesign" variant="outline-dark" onClick={(e) => handleModal(e)}>{field.meta.location === 0 ? <Plus /> : <Pencil />}</Button>
                        {field.meta.location === 0 ? '' : <Button className="standardDesign" variant="outline-dark" onClick={e => handleDelete(e)}><Trash /></Button>}
                        <InputFields
                            setIsFieldChanged={setIsFieldChanged}
                            show={show}
                            setShow={setShow}
                            field={field}
                            title={`Firmenrolle ${field.data.name}`}
                            addMainNote={addMainNote} />
                    </ButtonGroup>
                </Col>
            </Row>
        </ListGroup.Item>
    )
}


export const ListFields = ({ fullList, setIsFieldChanged, addMainNote }: ListFieldsComponent) => {


    return fullList.map(field => {
        return (
            <ListItem
                field={field}
                key={String(field.meta.location)}
                setIsFieldChanged={setIsFieldChanged}
                addMainNote={addMainNote} />
        )
    })
}
