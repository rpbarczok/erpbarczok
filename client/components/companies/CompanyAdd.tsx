import { apiClient } from '../../utils/openAPIClientAxios.js'
import { Button, ButtonGroup, Form, Modal } from 'react-bootstrap'
import { ChangedCompanyAction, changedCompanyReducer } from './changedCompanyReducer.js'
import { Company, emptyCompany } from './CompanyPageBasis.jsx'
import { CompanyType } from '../resources/companyTypes/CompanyTypesInput.jsx'
import { DataWithMeta } from '../Pages.jsx'
import { CompanyInput } from './CompanyInput.jsx'
import { LoadingContext } from '../../utils/loadingContext.js'
import { Note, Notes } from '../notifiers/Notes.jsx'
import { PermissionContext, updateUserPermissions } from '../../utils/permissionContext.js'
import { removeStringBeforeLastDigits } from '../../utils/removeStringBeforeLastDigits.js'
import { useAuth } from 'react-oidc-context'
import { useContextThrowUndefined } from '../../utils/contextUndefined.js'
import { useNotifier } from '../notifiers/useNotifier.js'
import { useReducer, useState } from 'react'
import e from 'express'

interface CompanyAddComponent {
    changeActive: (active: number) => void
    addEditNote: (note: Note) => void
    setIsNew: React.Dispatch<React.SetStateAction<boolean>>
    companyTypesList: DataWithMeta<CompanyType>[]
    setIsCompanyChanged: React.Dispatch<React.SetStateAction<boolean>>
}

export const CompanyAdd = ({ changeActive, addEditNote, setIsNew, setIsCompanyChanged, companyTypesList }: CompanyAddComponent) => {
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
                changeActive={changeActive}
                addEditNote={addEditNote}
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
    changeActive: (active: number) => void
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
    changeActive,
    addEditNote,
    setIsCompanyChanged,
    setIsNew,
    show,
    setShow,
    newCompanyClick,
    companyTypesList,
    changedCompanyDispatch }: AddCompanyModalComponent) => {
    const [validated, setValidated] = useState<boolean>(false)
    const [addNotes, addAddNote, removeAddNote] = useNotifier()
    const { setIsLoading } = useContextThrowUndefined(LoadingContext)

    const auth = useAuth()
    const { permissions, setPermissions } = useContextThrowUndefined(PermissionContext)
    const token = auth.user?.access_token

    const handleClose: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()
        setValidated(false)
        setShow(false)
    }

    const handleSubmitAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget
        e.preventDefault()
        e.stopPropagation()
        if (!form.checkValidity()) {
            setValidated(true)
        } else {
            setIsLoading(true)

            try {
                const client = await apiClient
                const result = await client.postCompany(null, changedCompany.data, { headers: { Authorization: `Bearer ${token}` } })
                setIsLoading(false)
                changeActive(Number(removeStringBeforeLastDigits(result.headers.location)))
                const note: Note = {
                    message: `Neues Unternehmen erfolgreich erstellt.`,
                    variant: 'success',
                }
                addEditNote(note)
                if (typeof result.headers.permissions === 'string') {
                    updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                } else {
                    throw new Error ('No permissions header found')
                }
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
                    addAddNote(note)
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