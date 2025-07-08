import { Button, ButtonGroup, Col, Form, Row } from 'react-bootstrap'
import { ChangedCompanyAction } from '../utils/changedCompanyReducer.js'
import { Company } from '../CompanyPage.js'
import { CompanyInput } from '../CompanyInput.js'
import { DataWithMeta } from '../../Pages.js'
import { hasPermission } from '../../../utils/hasPermission.js'
import { Note } from '../../notifiers/Notes.js'
import { PermissionContext } from '../../../utils/permissionContext.js'
import { useContextThrowUndefined } from '../../../utils/contextUndefined.js'
import { FunctionComponent, useState } from 'react'
import { GenericResource } from 'components/resources/resourceList.js'
import { AddressList } from 'components/addresses/AddressList.js'

interface CompanySMEditProps {
    activeCompany: DataWithMeta<Company>
    companyTypesList: DataWithMeta<GenericResource>[]
    addEditNote: (note: Note) => void
    changedCompany: DataWithMeta<Company>
    changedCompanyDispatch: React.ActionDispatch<[action: ChangedCompanyAction]>
    submitChangedCompany: (changedCompany: DataWithMeta<Company>) => Promise<Note>,
}

export const CompanySMEdit: FunctionComponent<CompanySMEditProps> = ({
    activeCompany,
    companyTypesList,
    addEditNote,
    changedCompany,
    changedCompanyDispatch,
    submitChangedCompany,
}) => {

    const [validated, setValidated] = useState<boolean>(false)

    const { permissions } = useContextThrowUndefined(PermissionContext)

    const isNotChanged: boolean = (activeCompany.data.name === changedCompany.data.name &&
        activeCompany.data.abbr === changedCompany.data.abbr &&
        activeCompany.data.www === changedCompany.data.www &&
        activeCompany.data.companyType === changedCompany.data.companyType)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, form: HTMLFormElement) => {
        e.preventDefault()

        if (!form.checkValidity()) {
            setValidated(true)
        } else {
            const newNote = await submitChangedCompany(changedCompany)
            changedCompanyDispatch({ type: 'companyChange', newValue: activeCompany })
            addEditNote(newNote)
        }
    }

    const handleUndo = (e: React.MouseEvent) => {
        e.preventDefault()
        setValidated(false)
        changedCompanyDispatch({ type: 'companyChange', newValue: activeCompany })
    }


    return (
        <Col>
            <Row>
                <Col id='company' sm={12} lg={6} xl={5} >
                    <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e, e.currentTarget)}>
                        {hasPermission(['user'], permissions)
                            ?
                            <Row className='d-none d-sm-block'>
                                <ButtonGroup className='float-end' >
                                    <Button type='submit' variant='outline-primary' disabled={isNotChanged} aria-label='Änderung der Firmendaten abspeichern'>Speichern</Button>
                                    <Button variant='outline-primary' disabled={isNotChanged} onClick={handleUndo} aria-label='Änderung der Firmendaten rückgängig machen' >Rückgängig</Button>
                                </ButtonGroup>
                            </Row>
                            : ''}
                        <CompanyInput
                            companyTypesList={companyTypesList}
                            changedCompany={changedCompany} changedCompanyDispatch={changedCompanyDispatch} />
                    </Form>
                </Col>
                <Col sm={12} lg={6} xl={7}>
                    <Row>
                            <AddressList activeCompany={activeCompany} />
                    </Row>
                    <Row>
                        Employees
                    </Row>
                </Col>
            </Row>
        </Col>
    )
}