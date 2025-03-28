import { useReducer, useState } from 'react'
import { apiClient } from '../../utils/openAPIClientAxios.js'
import { ChangedCompanyAction, changedCompanyReducer } from './company.reducer.js'
import { Company, emptyCompany } from './companies.jsx'
import { removeBeforeLastDigits } from '../../utils/removeBeforeLastDigits.js'
import { useAuth } from 'react-oidc-context'
import { Note, Notes } from '../../components/notifiers/notifiers.jsx'
import { useNotifier } from '../../components/notifiers/useNotifier.js'
import { DataWithMeta } from '../../components/forms.jsx'
import { CompanyType } from '../../components/resources/companyTypes/companyTypes.js'
import { Button, ButtonGroup, Form, Modal } from 'react-bootstrap'
import { InputCompanies } from './input.companies.jsx'
import { PermissionContext, updateUserPermissions } from '../../utils/permissionContext.js'
import { useContextThrowUndefined } from '../../utils/contextUndefined.js'
import { LoadingContext } from '../../utils/loadingContext.js'

interface AddCompanyComponent {
    handleChangeActive: (active: number) => void
    addEditNote: (note: Note) => void
    setIsNew: React.Dispatch<React.SetStateAction<boolean>>
    companyTypesList: DataWithMeta<CompanyType>[]
    setIsCompanyChanged: React.Dispatch<React.SetStateAction<boolean>>
}

export const AddCompany = ({ handleChangeActive, addEditNote, setIsNew, setIsCompanyChanged, companyTypesList }: AddCompanyComponent) => {
    const [changedCompany, changedCompanyDispatch] = useReducer(changedCompanyReducer, emptyCompany)
    const [newCompanyClick, setNewCompanyClick] = useState(0)
    const [show, setShow] = useState(false)

    const handleShow = () => {
        setNewCompanyClick(newCompanyClick - 1)
        changedCompanyDispatch({ type: 'companyChange', newValue: emptyCompany })
        setShow(true)
    }
    return (
        <>
            <Button className='standardDesign' variant='outline-primary' onClick={handleShow}>Hinzufügen</Button>
            <AddCompanyModal 
            changedCompany={changedCompany}
            handleChangeActive={handleChangeActive}
            addEditNote = {addEditNote}
            setIsCompanyChanged={setIsCompanyChanged}
            setIsNew={setIsNew}
            show={show}
            setShow={setShow}
            newCompanyClick={newCompanyClick}
            changedCompanyDispatch={changedCompanyDispatch}
            companyTypesList={companyTypesList}
            />
        </>
    )
}

interface AddCompanyModalComponent {
    changedCompany: DataWithMeta<Company>
    handleChangeActive: (active: number) => void
    addEditNote: (note: Note) => void
    setIsCompanyChanged: React.Dispatch<React.SetStateAction<boolean>>
    setIsNew: React.Dispatch<React.SetStateAction<boolean>>
    show: boolean
    setShow: React.Dispatch<React.SetStateAction<boolean>>
    newCompanyClick: number
    companyTypesList: DataWithMeta<CompanyType>[]
    changedCompanyDispatch: React.ActionDispatch<[action: ChangedCompanyAction]>
}

export const AddCompanyModal = ({
    changedCompany, 
    handleChangeActive, 
    addEditNote, 
    setIsCompanyChanged, 
    setIsNew, 
    show,
    setShow,
    newCompanyClick,
    companyTypesList,
    changedCompanyDispatch}: AddCompanyModalComponent) => {
    const [validated, setValidated] = useState<boolean>(false)
    const [addNotes, addAddNote, removeAddNote] = useNotifier()
    const { isLoading, setIsLoading } = useContextThrowUndefined(LoadingContext)

    const auth = useAuth()
    const { permissions, setPermissions } = useContextThrowUndefined(PermissionContext)
    const token = auth.user?.access_token
    
    const handleClose: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()
        if (setShow) {
            setValidated(false)
            setShow(false)
        }
    }

    const handleSubmitAdd: React.FormEventHandler<HTMLFormElement> = async (e: React.FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget
        e.preventDefault()
        e.stopPropagation()
        if (form.checkValidity() === false) {
            setValidated(true)
        } else {
            setIsLoading(true)

            try {
                const client = await apiClient
                const result = await client.postCompany(null, changedCompany.data, { headers: { Authorization: `Bearer ${token}` } })
                setIsLoading(false)
                handleChangeActive(Number(removeBeforeLastDigits(result.headers.location)))
                const note: Note = {
                    message: `Neues Unternehmen erfolgreich erstellt.`,
                    variant: 'success',
                }
                addEditNote(note)
                updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                setIsCompanyChanged(true)
                setIsNew(true)
                setShow(false)
            }
            catch (error) {
                setIsLoading(false)
                if (error instanceof Error) {
                    const note: Note = {
                        variant: 'danger',
                        message: `Fehler bei Erstellung des neuen Unternehmens: ${error.message}`,
                    }
                    addAddNote(note)
                } else {
                    const note: Note = {
                        variant: 'danger',
                        message: `Fehler bei Erstellung des neuen Unternehmens: ${error}`,
                    }
                }
            }
        }
    }

    return <Modal
        key={newCompanyClick}
        show={show}
        onHide={() => setShow(false)}
        backdrop='static'
        size='lg'>
        <Form noValidate validated={validated} onSubmit={(e) => handleSubmitAdd(e)}>
            <Modal.Header closeButton>
                <Modal.Title>Neues Unternehmen hinzufügen</Modal.Title>
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
                <ButtonGroup className='w-100'>
                    <Button type='submit' variant='outline-primary'>Speichern</Button>
                    <Button variant='outline-secondary' onClick={(e) => handleClose(e)}>Abbrechen</Button>
                </ButtonGroup>
            </Modal.Footer>
        </Form>
    </Modal>
}