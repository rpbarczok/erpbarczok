import { FunctionComponent, useState } from 'react'
import { Button, ButtonGroup, Form, Modal } from 'react-bootstrap'
import { useContextThrowUndefined } from '../../../utils/contextUndefined.js'
import { hasPermission } from '../../../utils/hasPermission.js'
import { PermissionContext } from '../../../utils/permissionContext.js'
import { DataWithMeta } from '../../Pages.js'
import { Note, Notes } from '../../notifiers/Notes.js'
import { useNotifier } from '../../notifiers/useNotifier.js'
import { ChangedCompanyAction } from '../utils/changedCompanyReducer.js'
import { CompanyDelete } from '../CompanyDelete.js'
import { Company } from '../CompanyPage.js'
import { CompanyInput } from '../CompanyInput.js'
import { GenericResource } from 'components/resources/resourceList.js'

interface CompanyXSEditProps {
    show: boolean
    setShow: React.Dispatch<React.SetStateAction<boolean>>
    companyTypesList: DataWithMeta<GenericResource>[]
    addEditNote: (note: Note) => void
    changedCompany: DataWithMeta<Company>
    changedCompanyDispatch: React.ActionDispatch<[action: ChangedCompanyAction]>
    activeCompany: DataWithMeta<Company>
    submitChangedCompany: (changedCompany: DataWithMeta<Company>) => Promise<Note>,
    deleteCompany: () => Promise<Note | undefined>
}

export const CompanyXSEdit: FunctionComponent<CompanyXSEditProps> = (
    { show,
        setShow,
        companyTypesList,
        addEditNote,
        changedCompany,
        changedCompanyDispatch,
        activeCompany,
        submitChangedCompany,
        deleteCompany }) => {

    const [validated, setValidated] = useState(false)
    const [errorNotes, addErrorNote, removeErrorNote] = useNotifier()
    const { permissions } = useContextThrowUndefined<{ permissions: string[] }>(PermissionContext)

    const isNotChanged: boolean = (activeCompany.data.name === changedCompany.data.name &&
        activeCompany.data.abbr === changedCompany.data.abbr &&
        activeCompany.data.www === changedCompany.data.www &&
        activeCompany.data.companyType === changedCompany.data.companyType)

    const handleSubmitEdit = async (e: React.FormEvent<HTMLFormElement>, form: HTMLFormElement) => {
        e.preventDefault()
        if (!form.checkValidity()) {
            setValidated(true)
        } else {
            const newNote: Note = await submitChangedCompany(changedCompany)
            changedCompanyDispatch({ type: 'companyChange', newValue: activeCompany })
            if (newNote.variant === 'danger') {
                addErrorNote(newNote)
            } else {
                setShow(false)
                addEditNote(newNote)
            }
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
            backdrop='static'
            size='lg'>
            <Form noValidate validated={validated} onSubmit={(e) => handleSubmitEdit(e, e.currentTarget)}>
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
                    {hasPermission(['user'], permissions)
                        ? <ButtonGroup className='w-100'>
                            <Button size='sm' variant='outline-primary' onClick={handleUndo} disabled={isNotChanged}>Rückgängig</Button>
                            <Button size='sm' type='submit' variant='outline-primary' disabled={isNotChanged}>Speichern</Button>
                            <CompanyDelete
                                addNote={addEditNote}
                                setShow={setShow}
                                size='sm'
                                deleteCompany={deleteCompany}
                            />
                            <Button size='sm' variant='outline-secondary' onClick={() => setShow(false)}>Abbrechen</Button>
                        </ButtonGroup>
                        : <Button size='sm' variant='outline-secondary' onClick={() => setShow(false)}>Schließen</Button>}
                </Modal.Footer>
            </Form>
        </Modal >
    )
}