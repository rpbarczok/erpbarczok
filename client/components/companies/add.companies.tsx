import '../../style.css'
import './companies.css'
import { Button, Form, Modal } from "react-bootstrap"
import React from 'react'
import { DataWithMeta } from '../forms.jsx'
import { ChangeCompanyAction, Company } from "./companies.jsx"
import { Companytype } from 'components/admin/companytypes/companytypes.jsx'
import { InputCompanies } from './input.companies.jsx'
import { blandCompany } from './companies.jsx'
import { Note, Notes } from '../notifiers/notifiers.jsx'

interface AddCompaniesInterface {
    changeCompany: DataWithMeta<Company>
    changeCompanyDispatch: React.ActionDispatch<[action: ChangeCompanyAction]>
    listCompanytypes: DataWithMeta<Companytype>[]
    handleSubmit: React.MouseEventHandler<HTMLButtonElement>
    show: boolean
    setShow: React.Dispatch<React.SetStateAction<boolean>>
    notes: Note[]
    removeNote: (note: Note) => void,
    activeCompany: DataWithMeta<Company>
}

export default function AddCompanies({
    listCompanytypes,
    changeCompany,
    handleSubmit,
    show,
    setShow,
    changeCompanyDispatch,
    notes,
    removeNote,
    activeCompany
}: AddCompaniesInterface) {

    const handleShow = () => {
        changeCompanyDispatch({type: 'companyChange', newValue: blandCompany})
        setShow(true)
    }
    const handleClose = () => {
        changeCompanyDispatch({type: 'companyChange', newValue: activeCompany})
        setShow(false)
    }

    return (
        <>
            <Button className="standardDesign" variant="outline-primary" onClick={handleShow}>Firma hinzufügen</Button>
            <Form>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Neue Firma hinzufügen</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Notes notes={notes} removeNote={removeNote}/>
                        <InputCompanies changeCompany={changeCompany} changeCompanyDispatch={changeCompanyDispatch} listCompanytypes={listCompanytypes} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Abbrechen</Button>
                        <Button type="submit" variant='primary' onClick={handleSubmit}>Abspeichern</Button>
                    </Modal.Footer>
                </Modal>
            </Form>
        </>
    )
} 
