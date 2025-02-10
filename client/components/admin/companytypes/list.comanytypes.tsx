import React, { useState } from 'react'
import '../../../style.css'
import '../admin.css'
import { Companytype } from './companytypes.jsx'
import { DataWithMeta } from 'components/forms.jsx'
import { Button, ButtonGroup, Col, Form, ListGroup, Modal, Row } from "react-bootstrap"
import { Pencil, Trash, Plus } from "react-bootstrap-icons"
import InputCompanytypes from './input.companytypes.jsx'
import { client } from 'utils/openapiclientaxios.js'
import { Note } from 'components/notifiers/notifiers.js'


interface ListCompanytypesComponent {
    fullList: DataWithMeta<Companytype>[]
    setIsCompanytypeChanged: React.Dispatch<React.SetStateAction<boolean>>
    addMainNote: (note: Note) => void
}

interface ListItemComponent {
    companytype: DataWithMeta<Companytype>
    setIsCompanytypeChanged: React.Dispatch<React.SetStateAction<boolean>>
    addMainNote: (note: Note) => void
}

const ListItem = ({ companytype, setIsCompanytypeChanged, addMainNote }: ListItemComponent) => {
    const title = 'Neue Firmenrolle anlegen'
    const [show, setShow] = useState(false)
    
    
    const handleModal = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setShow(true)
    }

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const userConfirmed = window.confirm(`Willst du wirklich die Firmenrolle ${companytype.data.name} löschen?`)
        if (userConfirmed) {
            client.deleteCompanytypeById(companytype.meta.location)
                .then((res) => {
                    const note: Note = {
                        message: 'Die Firmenrolle wurde erfolgreich gelöscht.',
                        variant: 'info',
                    }
                    addMainNote(note)
                    setIsCompanytypeChanged(true)
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
                    <span>{companytype.meta.location === 0 ? title : companytype.data.name}</span>
                </Col>
                <Col xs={6}>
                    <ButtonGroup className="function-button standardDesign">
                        <Button className="standardDesign" variant="outline-dark" onClick={(e) => handleModal(e)}>{companytype.meta.location === 0 ? <Plus /> : <Pencil />}</Button>
                        {companytype.meta.location === 0 ? '' : <Button className="standardDesign" variant="outline-dark" onClick={e => handleDelete(e)}><Trash /></Button>}
                        <InputCompanytypes
                            setIsCompanytypeChanged={setIsCompanytypeChanged}
                            show={show}
                            setShow={setShow}
                            companytype={companytype}
                            title={`Firmenrolle ${companytype.data.name}`} 
                            addMainNote = {addMainNote}/>
                    </ButtonGroup>
                </Col>
            </Row>
        </ListGroup.Item>
    )
}


const ListCompanytypes = ({ fullList, setIsCompanytypeChanged, addMainNote }: ListCompanytypesComponent) => {


    return fullList.map(companytype => {
        return (
           <ListItem 
           companytype={companytype} 
           key={String(companytype.meta.location)} 
           setIsCompanytypeChanged={setIsCompanytypeChanged} 
           addMainNote={addMainNote} />
        )
    })
}

export default ListCompanytypes