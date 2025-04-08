import { useState } from 'react'
import { Button, ButtonGroup, Form, Modal } from 'react-bootstrap'
import { useAuth } from 'react-oidc-context'
import { useContextThrowUndefined } from '../../utils/contextUndefined.js'
import { hasPermission } from '../../utils/hasPermission.js'
import { LoadingContext } from '../../utils/loadingContext.js'
import { apiClient } from '../../utils/openAPIClientAxios.js'
import { PermissionContext, updateUserPermissions } from '../../utils/permissionContext.js'
import { DataWithMeta } from '../Pages.jsx'
import { Note, Notes } from '../notifiers/Notes.jsx'
import { useNotifier } from '../notifiers/useNotifier.js'
import { CompanyType } from '../resources/companyTypes/CompanyTypesInput.jsx'
import { ChangedCompanyAction } from './changedCompanyReducer.js'
import { CompanyDelete } from './CompanyDelete.jsx'
import { Company } from './CompanyPageBasis.js'
import { CompanyInput } from './CompanyInput.js'

interface CompanyXSEditInterface {
    show: boolean
    setShow: React.Dispatch<React.SetStateAction<boolean>>
    companyTypesList: DataWithMeta<CompanyType>[]
    addEditNote: (note: Note) => void
    setIsCompanyChanged: React.Dispatch<React.SetStateAction<boolean>>
    changedCompany: DataWithMeta<Company>
    changedCompanyDispatch: React.ActionDispatch<[action: ChangedCompanyAction]>
    activeCompany: DataWithMeta<Company>
}

export const CompanyXSEdit = ({ show, setShow, companyTypesList, addEditNote, setIsCompanyChanged, changedCompany, changedCompanyDispatch, activeCompany }: CompanyXSEditInterface) => {

    const [validated, setValidated] = useState(false)
    const [errorNotes, addErrorNote, removeErrorNote] = useNotifier()
    const auth = useAuth()
    const { permissions, setPermissions } = useContextThrowUndefined(PermissionContext)
    const { setIsLoading } = useContextThrowUndefined(LoadingContext)

    const token = auth.user?.access_token
    const isNotChanged: boolean = (activeCompany.data.name === changedCompany.data.name &&
        activeCompany.data.abbr === changedCompany.data.abbr &&
        activeCompany.data.www === changedCompany.data.www &&
        activeCompany.data.companyType === changedCompany.data.companyType)

    const handleSubmitEdit: React.FormEventHandler<HTMLFormElement> = async (e: React.FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget
        e.preventDefault()
        e.stopPropagation()
        if (!form.checkValidity()) {
            setValidated(true)
        } else {
            setIsLoading(true)
            const client = await apiClient
            client.putCompanyById({ id: changedCompany.meta.location, 'if-match': changedCompany.meta.etag },
                changedCompany.data,
                { headers: { Authorization: `Bearer ${token}` } })
                .then(
                    result => {
                    setIsLoading(false)
                    const note: Note = {
                        variant: 'success',
                        message: `Unternehmen erfolgreich überarbeitet.`,
                    }
                    addEditNote(note)
                    setIsCompanyChanged(true)
                    setShow(false)
                    if (typeof result.headers.permissions === 'string') {
                        updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                    } else {
                        throw new Error ('No permissions header found')
                    }
                },
                error => {
                    setIsLoading(false)
                    const note: Note = {
                        variant: 'danger',
                        message: `Fehler beim Speichern der Unternehmensdaten: ${error.message}`,
                    }
                    addErrorNote(note)
                }
            )
        }
    }

    const handleUndo: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()
        setValidated(false)
        changedCompanyDispatch({ type: 'companyChange', newValue: activeCompany })
    }

    const UserButtons = () => {
        if (hasPermission(['user'], permissions)) {
            return (<ButtonGroup className='w-100'>
                <Button size='sm' variant='outline-primary' onClick={handleUndo} disabled={isNotChanged}>Rückgängig</Button>
                <Button size='sm' type='submit' variant='outline-primary' disabled={isNotChanged}>Speichern</Button>
                <CompanyDelete
                    company={changedCompany}
                    setIsCompanyChanged={setIsCompanyChanged}
                    addNote={addEditNote}
                    setShow={setShow}
                    size='sm'
                />
                <Button size='sm' variant='outline-secondary' onClick={() => setShow(false)}>Abbrechen</Button>
            </ButtonGroup>)
        } else {
            return <Button size='sm' variant='outline-secondary' onClick={() => setShow(false)}>Schließen</Button>
        }

    }

    return (
        <Modal
            key={changedCompany.meta.location}
            show={show}
            onHide={() => setShow(false)}
            backdrop='static'
            size='lg'>
            <Form noValidate validated={validated} onSubmit={handleSubmitEdit}>
                <Modal.Header closeButton>
                    <Modal.Title>Unternehmen bearbeiten</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Notes notes={errorNotes} removeNote={removeErrorNote} />
                    <CompanyInput
                        companyTypesList={companyTypesList}
                        changedCompany={changedCompany}
                        changedCompanyDispatch={changedCompanyDispatch}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <UserButtons />
                </Modal.Footer>
            </Form>
        </Modal >
    )
}