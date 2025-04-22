import { Button, ButtonGroup, Col, Form, Row } from 'react-bootstrap'
import { ChangedCompanyAction } from '../utils/changedCompanyReducer.js'
import { Company } from '../CompanyPageBasis.js'
import { CompanyInput } from '../CompanyInput.js'
import { CompanyType } from '../../resources/companyTypes/CompanyTypesInput.js'
import { DataWithMeta } from '../../Pages.js'
import { hasPermission } from '../../../utils/hasPermission.js'
import { Note } from '../../notifiers/Notes.js'
import { PermissionContext } from '../../../utils/permissionContext.js'
import { useContextThrowUndefined } from '../../../utils/contextUndefined.js'
import { FunctionComponent, useState } from 'react'

interface CompanySMEditProps {
    company: DataWithMeta<Company>
    companyTypesList: DataWithMeta<CompanyType>[]
    addEditNote: (note: Note) => void
    changedCompany: DataWithMeta<Company>
    changedCompanyDispatch: React.ActionDispatch<[action: ChangedCompanyAction]>
    submitChangedCompany: () => Promise<Note>
}

export const CompanySMEdit: FunctionComponent<CompanySMEditProps> = ({
    company,
    companyTypesList,
    addEditNote,
    changedCompany,
    changedCompanyDispatch,
    submitChangedCompany 
}) => {

    const [validated, setValidated] = useState<boolean>(false)
    
    const { permissions } = useContextThrowUndefined(PermissionContext)

    const isNotChanged: boolean = (company.data.name === changedCompany.data.name &&
        company.data.abbr === changedCompany.data.abbr &&
        company.data.www === changedCompany.data.www &&
        company.data.companyType === changedCompany.data.companyType)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, form: HTMLFormElement) => {
        e.preventDefault()

        if (!form.checkValidity()) {
            setValidated(true)
        } else {            
            const newNote = await submitChangedCompany()
            addEditNote(newNote)
        }
    }

    const handleUndo = (e: React.MouseEvent) => {
        e.preventDefault()
        setValidated(false)
        changedCompanyDispatch({ type: 'companyChange', newValue: company })
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
                    CompanyAddition
                </Col>
            </Row>
        </Col>
    )
}