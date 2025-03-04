import { useReducer, useState } from "react"
import { client } from "utils/openAPIClientAxios.js"
import { changedCompanyReducer } from "./company.reducer.js"
import { emptyCompany } from "./companies.jsx"
import { removeBeforeLastDigits } from "utils/removeBeforeLastDigits.js"
import { useAuth } from "react-oidc-context"
import { Note, Notes } from "components/notifiers/notifiers.jsx"
import { useNotifier } from "components/notifiers/useNotifier.js"
import { DataWithMeta } from "components/forms.jsx"
import { CompanyType } from "components/admin/companyTypes/companyTypes.jsx"
import { Button, Col, Form, Modal } from "react-bootstrap"
import { InputCompanies } from "./input.companies.jsx"

interface AddCompanyComponent {
    handleChangeActive: (active: number) => void
    addEditNote: (note: Note) => void
    setIsNew: React.Dispatch<React.SetStateAction<boolean>>
    companyTypesList: DataWithMeta<CompanyType>[]
    setIsCompanyChanged: React.Dispatch<React.SetStateAction<boolean>>
}

export const AddCompany = ({ handleChangeActive, addEditNote, setIsNew, setIsCompanyChanged, companyTypesList }: AddCompanyComponent) => {
    const [validated, setValidated] = useState<boolean>(false)
    const [changedCompany, changedCompanyDispatch] = useReducer(changedCompanyReducer, emptyCompany)
    const [addNotes, addAddNote, removeAddNote] = useNotifier()
    const [newCompanyClick, setNewCompanyClick] = useState(0)
    const [show, setShow] = useState(false)

    const auth = useAuth()

    const token = auth.user?.access_token

    const handleSubmitAdd: React.FormEventHandler<HTMLFormElement> = (e: React.FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget
        e.preventDefault()
        e.stopPropagation()
        if (form.checkValidity() === false) {
            setValidated(true)
        } else {

            client.postCompany(null, changedCompany.data, { headers: { Authorization: `Bearer ${token}` } })
                .then((res) => {
                    handleChangeActive(Number(removeBeforeLastDigits(res.headers.location)))
                    const note: Note = {
                        message: `Neue Firma erfolgreich erstellt.`,
                        variant: 'success',
                    }
                    addEditNote(note)
                    setIsCompanyChanged(true)
                    setIsNew(true)
                    setShow(false)
                })
                .catch((error) => {
                    const note: Note = {
                        variant: 'danger',
                        message: `Fehler bei Erstellung der neuen Firma: ${error.message}`,
                    }
                    addAddNote(note)
                })
        }
    }

    const handleShow = () => {
        setNewCompanyClick(newCompanyClick - 1)
        setShow(true)
    }

    const handleClose: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()
        if (setShow) {
            setValidated(false)
            setShow(false)
        }
    }

    return (
        <>
            <Button className="standardDesign" variant="outline-primary" onClick={handleShow}>Firma hinzufügen</Button>
            <Modal
                key={newCompanyClick}
                show={show}
                onHide={() => setShow(false)}
                backdrop="static"
                size='lg'>
                <Form noValidate validated={validated} onSubmit={(e) => handleSubmitAdd(e)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Neue Firma hinzufügen</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Notes notes={addNotes} removeNote={removeAddNote} />
                        <Modal.Body>
                            <InputCompanies
                            companyTypesList={companyTypesList}
                            changedCompany={changedCompany} changedCompanyDispatch={changedCompanyDispatch}
                            />
                        </Modal.Body>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" variant='primary'>Abspeichern</Button>
                        <Button variant="secondary" onClick={(e) => handleClose(e)}>Abbrechen</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}
