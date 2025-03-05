import { DataWithMeta } from "components/forms.jsx"
import { Button, ButtonGroup, Col, Form, Modal, Row } from "react-bootstrap"
import { Company } from "./companies.jsx"
import React, { useState } from "react"
import { Note, Notes } from "components/notifiers/notifiers.jsx"
import { useNotifier } from "components/notifiers/useNotifier.js"
import { CompanyType } from "components/admin/companyTypes/companyTypes.jsx"
import { DeleteCompanies } from "./delete.companies.jsx"
import { client } from "utils/openAPIClientAxios.js"
import { useAuth } from "react-oidc-context"
import { ChangedCompanyAction } from "./company.reducer.js"
import { InputCompanies } from "./input.companies.jsx"

interface XSEditCompaniesComponent {
    show: boolean
    setShow: React.Dispatch<React.SetStateAction<boolean>>
    companyTypesList: DataWithMeta<CompanyType>[]
    addEditNote: (note: Note) => void
    setIsCompanyChanged: React.Dispatch<React.SetStateAction<boolean>>
    changedCompany: DataWithMeta<Company>
    changedCompanyDispatch: React.ActionDispatch<[action: ChangedCompanyAction]>
    activeCompany: DataWithMeta<Company>
}

export const XSEditCompanies = ({ show, setShow, companyTypesList, addEditNote, setIsCompanyChanged, changedCompany, changedCompanyDispatch, activeCompany }: XSEditCompaniesComponent) => {

    const [validated, setValidated] = useState(false)
    const [errorNotes, addErrorNote, removeErrorNote] = useNotifier()
    const auth = useAuth()
    const token = auth.user?.access_token
    const isNotChanged: boolean = (activeCompany.data.name === changedCompany.data.name &&
        activeCompany.data.abbr === changedCompany.data.abbr &&
        activeCompany.data.www === changedCompany.data.www &&
        activeCompany.data.companyType === changedCompany.data.companyType)

    const handleSubmitEdit: React.FormEventHandler<HTMLFormElement> = (e: React.FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget
        e.preventDefault()
        e.stopPropagation()
        if (form.checkValidity() === false) {
            setValidated(true)
        } else {
            client.putCompanyById({ id: changedCompany.meta.location, "if-match": changedCompany.meta.etag },
                changedCompany.data,
                { headers: { Authorization: `Bearer ${token}` } })
                .then((res) => {
                    const note: Note = {
                        variant: 'success',
                        message: `Firma erfolgreich überarbeitet.`,
                    }
                    addEditNote(note)
                    setIsCompanyChanged(true)
                    setShow(false)
                })
                .catch(function (error) {
                    const note: Note = {
                        variant: 'danger',
                        message: `Fehler beim Speichern der Firmendaten: ${error.message}`,
                    }
                    addErrorNote(note)
                })
        }
    }

    const handleUndo: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()
        setValidated(false)
        changedCompanyDispatch({ type: 'companyChange', newValue: activeCompany })
    }

    return (
        <Modal
            key={changedCompany.meta.location}
            show={show}
            onHide={() => setShow(false)}
            backdrop="static"
            size='lg'>
            <Form noValidate validated={validated} onSubmit={handleSubmitEdit}>
                <Modal.Header closeButton>
                    <Modal.Title>Firma bearbeiten</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Notes notes={errorNotes} removeNote={removeErrorNote} />
                        <InputCompanies
                        companyTypesList={companyTypesList}
                        changedCompany={changedCompany}
                        changedCompanyDispatch={changedCompanyDispatch}
                        />
                </Modal.Body>
                <Modal.Footer>
                    <ButtonGroup className="w-100">
                        <Button size="sm" variant='outline-primary' onClick={handleUndo} disabled={isNotChanged}>Undo</Button>
                        <Button size="sm" type="submit" variant='outline-primary' disabled={isNotChanged}>Speichern</Button>
                        <DeleteCompanies
                            company={changedCompany}
                            setIsCompanyChanged={setIsCompanyChanged}
                            addNote={addEditNote}
                            setShow={setShow} 
                            size='sm'
                            />
                        <Button size="sm" variant="outline-secondary" onClick={() => setShow(false)}>Abbrechen</Button>
                    </ButtonGroup>
                </Modal.Footer>
            </Form>
        </Modal >
    )
}