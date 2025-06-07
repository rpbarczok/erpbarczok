import { DataWithMeta } from "components/Pages.js"
import { Company, emptyCompany } from "./CompanyPage.js"
import { Note, Notes } from "components/notifiers/Notes.js"
import { CompanyType } from "components/resources/companyTypes/CompanyTypesInput.js"
import { ChangedCompanyAction } from "./utils/changedCompanyReducer.js"
import { FunctionComponent, useState } from "react"
import { useNotifier } from "components/notifiers/useNotifier.js"
import { Button, ButtonGroup, Form, Modal } from "react-bootstrap"
import { CompanyInput } from "./CompanyInput.js"

interface AddCompanyModalProps {
    changedCompany: DataWithMeta<Company>
    addEditNote: (note: Note) => void
    show: boolean
    setShow: React.Dispatch<React.SetStateAction<boolean>>
    newCompanyClick: number
    companyTypesList: DataWithMeta<CompanyType>[]
    changedCompanyDispatch: React.ActionDispatch<[action: ChangedCompanyAction]>
    submitNewCompany:(newCompany: DataWithMeta<Company>) => Promise<Note>
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
        changedCompanyDispatch({ type: 'companyChange', newValue: emptyCompany })
    }

    const handleHide = () => {
        setValidated(false)
        setShow(false)
        changedCompanyDispatch({ type: 'companyChange', newValue: emptyCompany })
    }

    const handleSubmitAdd = async (e: React.FormEvent<HTMLFormElement>, form: HTMLFormElement) => {
        e.preventDefault()

        if (!form.checkValidity()) {
            setValidated(true)
        } else {

            const newNote = await submitNewCompany(changedCompany)
            changedCompanyDispatch({ type: 'companyChange', newValue: emptyCompany })
            if (newNote.variant === 'success') {
                setShow(false)
                addEditNote(newNote)
            } else {
                addAddNote(newNote)
            }

        }
    }

    return <Modal
        key={newCompanyClick}
        show={show}
        onHide={handleHide}
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