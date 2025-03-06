import React, { useState } from 'react'
import '../../../style.css'
import '../admin.css'
import { CompanyType } from './companyTypes.jsx'
import { DataWithMeta } from 'components/forms.jsx'
import { Button, ButtonGroup, Col, ListGroup, Row } from "react-bootstrap"
import { Pencil, Trash, Plus } from "react-bootstrap-icons"
import { InputCompanyTypes } from './input.companyTypes.jsx'
import { client } from 'utils/openAPIClientAxios.js'
import { Note } from 'components/notifiers/notifiers.js'
import { useAuth } from 'react-oidc-context'
import { Resource } from '../admin.js'


interface ListCompanyTypesComponent {
    fullList: DataWithMeta<CompanyType>[]
    setIsCompanyTypeChanged: React.Dispatch<React.SetStateAction<boolean>>
    addMainNote: (note: Note) => void
    resource: Resource
}

interface ListItemComponent {
    companyType: DataWithMeta<CompanyType>
    setIsCompanyTypeChanged: React.Dispatch<React.SetStateAction<boolean>>
    addMainNote: (note: Note) => void
    resource: Resource
}

const ListItem = ({ companyType, setIsCompanyTypeChanged, addMainNote, resource }: ListItemComponent) => {
    const auth = useAuth()
    const title = `Neue ${resource.name} anlegen`
    const [show, setShow] = useState(false)


    const handleModal = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setShow(true)
    }

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const token = auth.user?.access_token
        const userConfirmed = window.confirm(`Willst du wirklich die Firmenrolle ${companyType.data.name} löschen?`)
        if (userConfirmed) {
            client.deleteCompanyTypeById(companyType.meta.location, null, { headers: { Authorization: `Bearer ${token}` }})
                .then((res) => {
                    const note: Note = {
                        message: 'Die Firmenrolle wurde erfolgreich gelöscht.',
                        variant: 'info',
                    }
                    addMainNote(note)
                    setIsCompanyTypeChanged(true)
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
        <ListGroup.Item className="standardDesign">
            <Row>
                <Col xs={6}>
                    <span>{companyType.meta.location === 0 ? title : companyType.data.name}</span>
                </Col>
                <Col xs={6}>
                    <ButtonGroup className="standardDesign float-end">
                        <Button className="standardDesign" variant="outline-dark" onClick={(e) => handleModal(e)}>{companyType.meta.location === 0 ? <Plus /> : <Pencil />}</Button>
                        {companyType.meta.location === 0 ? '' : <Button className="standardDesign" variant="outline-dark" onClick={e => handleDelete(e)}><Trash /></Button>}
                        <InputCompanyTypes
                            setIsCompanyTypeChanged={setIsCompanyTypeChanged}
                            show={show}
                            setShow={setShow}
                            companyType={companyType}
                            title={`${resource.name} ${companyType.data.name}`}
                            addMainNote={addMainNote} />
                    </ButtonGroup>
                </Col>
            </Row>
        </ListGroup.Item>
    )
}


export const ListCompanyTypes = ({ resource, fullList, setIsCompanyTypeChanged, addMainNote }: ListCompanyTypesComponent) => {
    return fullList.map(companyType => {
        return (
            <ListItem
                companyType={companyType}
                key={String(companyType.meta.location)}
                setIsCompanyTypeChanged={setIsCompanyTypeChanged}
                addMainNote={addMainNote} 
                resource={resource}/>
        )
    })
}
