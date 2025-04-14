import { apiClient } from '../../../utils/openAPIClientAxios.js'
import { Button, ButtonGroup, Col, Form, Row } from 'react-bootstrap'
import { ChangedCompanyAction } from '../utils/changedCompanyReducer.js'
import { Company } from '../CompanyPageBasis.js'
import { CompanyInput } from '../CompanyInput.js'
import { CompanyType } from '../../resources/companyTypes/CompanyTypesInput.js'
import { DataWithMeta } from '../../Pages.js'
import { hasPermission } from '../../../utils/hasPermission.js'
import { LoadingContext } from '../../../utils/loadingContext.js'
import { Note } from '../../notifiers/Notes.js'
import { PermissionContext, updateUserPermissions } from '../../../utils/permissionContext.js'
import { useAuth } from 'react-oidc-context'
import { useContextThrowUndefined } from '../../../utils/contextUndefined.js'
import { FunctionComponent, useState } from 'react'

interface CompanySMEditProps {
    company: DataWithMeta<Company>
    companyTypesList: DataWithMeta<CompanyType>[]
    setIsCompanyChanged: React.Dispatch<React.SetStateAction<boolean>>
    addEditNote: (note: Note) => void
    changedCompany: DataWithMeta<Company>
    changedCompanyDispatch: React.ActionDispatch<[action: ChangedCompanyAction]>
}

export const CompanySMEdit: FunctionComponent<CompanySMEditProps> = ({ company, companyTypesList, setIsCompanyChanged, addEditNote, changedCompany, changedCompanyDispatch }) => {
    const [validated, setValidated] = useState<boolean>(false)
    const { permissions, setPermissions } = useContextThrowUndefined(PermissionContext)
    const { setIsLoading } = useContextThrowUndefined(LoadingContext)
    const auth = useAuth()
    const token = auth.user?.access_token

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e: React.FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget
        e.preventDefault()
        if (token) {
            if (!form.checkValidity()) {
                setValidated(true)
            } else {
                setIsLoading(true)
                try {
                    const client = await apiClient
                    const result = await client.putCompanyById({ id: changedCompany.meta.location, 'if-match': changedCompany.meta.etag },
                        changedCompany.data,
                        { headers: { Authorization: `Bearer ${token}` } })
                    setIsLoading(false)
                    const note: Note = {
                        variant: 'success',
                        message: `Unternehmen erfolgreich überarbeitet.`,
                    }
                    addEditNote(note)
                    setIsCompanyChanged(true)
                    if (typeof result.headers.permissions === 'string') {
                        updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                    } else {
                        throw Error('Permissions header should be type string.')
                    }
                } catch (error) {
                    setIsLoading(false)
                    const note: Note = {
                        variant: 'danger',
                        message: `Fehler beim Speichern der Unternehmensdaten: ${error instanceof Error ? error.message : String(error)}`,
                    }
                    addEditNote(note)
                }
            }
        }
    }

    const isNotChanged: boolean = (company.data.name === changedCompany.data.name &&
        company.data.abbr === changedCompany.data.abbr &&
        company.data.www === changedCompany.data.www &&
        company.data.companyType === changedCompany.data.companyType)

    const handleUndo = (e: React.MouseEvent) => {
        e.preventDefault()
        setValidated(false)
        changedCompanyDispatch({ type: 'companyChange', newValue: company })
    }


    return (
        <Col>
            <Row>
                <Col id='company' sm={12} lg={6} xl={5} >
                    <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e)}>
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