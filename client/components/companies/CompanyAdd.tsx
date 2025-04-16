/*
Copyright (c) 2025 Ralph Barczok
Portions Copyright (c) 2024 Pan Xuguang GmbH
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


import { Button, ButtonGroup, Form, Modal } from 'react-bootstrap'
import { ChangedCompanyAction, changedCompanyReducer } from './utils/changedCompanyReducer.js'
import { Company, emptyCompany } from './CompanyPageBasis.jsx'
import { CompanyType } from '../resources/companyTypes/CompanyTypesInput.jsx'
import { DataWithMeta } from '../Pages.jsx'
import { CompanyInput } from './CompanyInput.jsx'
import { Note, Notes } from '../notifiers/Notes.jsx'
import { useNotifier } from '../notifiers/useNotifier.js'
import { FunctionComponent, useReducer, useState } from 'react'

interface CompanyAddProps {
    addEditNote: (note: Note) => void
    companyTypesList: DataWithMeta<CompanyType>[]
    submitNewCompany: () => Promise<Note>
}

export const CompanyAdd: FunctionComponent<CompanyAddProps> = ({  addEditNote,companyTypesList, submitNewCompany }) => {

    const [changedCompany, changedCompanyDispatch] = useReducer(changedCompanyReducer, emptyCompany)
    const [newCompanyClick, setNewCompanyClick] = useState(0)
    const [show, setShow] = useState(false)

    const handleShow = (e: React.MouseEvent) => {
        e.preventDefault()
        setNewCompanyClick(newCompanyClick - 1)
        changedCompanyDispatch({ type: 'companyChange', newValue: emptyCompany })
        setShow(true)
    }

    return (
        <>
            <Button variant='outline-primary' onClick={handleShow}>Hinzufügen</Button>
            <AddCompanyModal
                changedCompany={changedCompany}
                addEditNote={addEditNote}
                show={show}
                setShow={setShow}
                newCompanyClick={newCompanyClick}
                changedCompanyDispatch={changedCompanyDispatch}
                companyTypesList={companyTypesList}
                submitNewCompany={submitNewCompany}
            />
        </>
    )
}

interface AddCompanyModalProps {
    changedCompany: DataWithMeta<Company>
    addEditNote: (note: Note) => void
    show: boolean
    setShow: React.Dispatch<React.SetStateAction<boolean>>
    newCompanyClick: number
    companyTypesList: DataWithMeta<CompanyType>[]
    changedCompanyDispatch: React.ActionDispatch<[action: ChangedCompanyAction]>
    submitNewCompany: () => Promise<Note>
}

export const AddCompanyModal: FunctionComponent<AddCompanyModalProps> = ({
    changedCompany,
    addEditNote,
    show,
    setShow,
    newCompanyClick,
    companyTypesList,
    changedCompanyDispatch,
    submitNewCompany }) => {
    const [validated, setValidated] = useState<boolean>(false)
    const [addNotes, addAddNote, removeAddNote] = useNotifier()


    const handleClose: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()
        setValidated(false)
        setShow(false)
    }

    const handleSubmitAdd = async (e: React.FormEvent<HTMLFormElement>, form: HTMLFormElement) => {
        e.preventDefault()

        if (!form.checkValidity()) {
            setValidated(true)
        } else {

            const newNote = await submitNewCompany()

            if (newNote.variant === 'success') {
                setShow(false)
                addAddNote(newNote)
            } else {
                addEditNote(newNote)
            }

        }
    }

    return <Modal
        key={newCompanyClick}
        show={show}
        onHide={() => setShow(false)}
        backdrop='static'
        size='lg'>
        <Form noValidate validated={validated} onSubmit={(e) => handleSubmitAdd(e, e.currentTarget)}>
            <Modal.Header closeButton>
                <Modal.Title>Neues Unternehmen hinzufügen</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Notes notes={addNotes} removeNote={removeAddNote} />
                <Modal.Body>
                    <CompanyInput
                        companyTypesList={companyTypesList}
                        changedCompany={changedCompany} changedCompanyDispatch={changedCompanyDispatch}
                    />
                </Modal.Body>
            </Modal.Body>
            <Modal.Footer>
                <ButtonGroup className='w-100'>
                    <Button type='submit' variant='outline-primary'>Speichern</Button>
                    <Button variant='outline-secondary' onClick={handleClose}>Abbrechen</Button>
                </ButtonGroup>
            </Modal.Footer>
        </Form>
    </Modal>
}