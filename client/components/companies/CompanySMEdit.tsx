import { apiClient } from '../../utils/openAPIClientAxios.js'
import { Button, ButtonGroup, Col, Form, Row } from 'react-bootstrap'
import { ChangedCompanyAction } from './changedCompanyReducer.js'
import { Company } from './CompanyPageBasis.js'
import { CompanyInput } from './CompanyInput.jsx'
import { CompanyType } from '../resources/companyTypes/CompanyTypesInput.jsx'
import { DataWithMeta } from '../Pages.jsx'
import { hasPermission } from '../../utils/hasPermission.js'
import { LoadingContext } from '../../utils/loadingContext.js'
import { Note } from '../notifiers/Notes.jsx'
import { PermissionContext, updateUserPermissions } from '../../utils/permissionContext.js'
import { useAuth } from 'react-oidc-context'
import { useContextThrowUndefined } from '../../utils/contextUndefined.js'
import { useState } from 'react'

interface CompanySMEditInterface {
    company: DataWithMeta<Company>
    companyTypesList: DataWithMeta<CompanyType>[]
    setIsCompanyChanged: React.Dispatch<React.SetStateAction<boolean>>
    addEditNote: (note: Note) => void
    changedCompany: DataWithMeta<Company>
    changedCompanyDispatch: React.ActionDispatch<[action: ChangedCompanyAction]>
}

export const CompanySMEdit = ({ company, companyTypesList, setIsCompanyChanged, addEditNote, changedCompany, changedCompanyDispatch }: CompanySMEditInterface) => {
    const [validated, setValidated] = useState<boolean>(false)
    const { permissions, setPermissions } = useContextThrowUndefined(PermissionContext)
    const { setIsLoading } = useContextThrowUndefined(LoadingContext)
    const auth = useAuth()
    const token = auth.user?.access_token

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e: React.FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget
        e.preventDefault()
        e.stopPropagation()
        if (form.checkValidity() === false) {
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
                        updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                    },
                    error => {
                        setIsLoading(false)
                        const note: Note = {
                            variant: 'danger',
                            message: `Fehler beim Speichern der Unternehmensdaten: ${error.message}`,
                        }
                        addEditNote(note)
                    }
                )
        }
    }

    const ButtonEdit = () => {
        const isNotChanged: boolean = (company.data.name === changedCompany.data.name &&
            company.data.abbr === changedCompany.data.abbr &&
            company.data.www === changedCompany.data.www &&
            company.data.companyType === changedCompany.data.companyType)

        const handleUndo: React.MouseEventHandler<HTMLButtonElement> = (e) => {
            e.preventDefault()
            setValidated(false)
            changedCompanyDispatch({ type: 'companyChange', newValue: company })
        }

        return (
            <>
                <Row className='d-none d-sm-block'>
                    <ButtonGroup className='standardDesign float-end' >
                        <Button type='submit' className='standardDesign' variant='outline-primary' disabled={isNotChanged}>Speichern</Button>
                        <Button className='standardDesign' variant='outline-primary' disabled={isNotChanged} onClick={handleUndo} >Rückgängig</Button>
                    </ButtonGroup>
                </Row>
            </>
        )
    }

    return (
        <Col>
            <Row>
                <Col id='company' sm={12} lg={6} xl={5} >
                    <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e)}>
                        {hasPermission(['user'], permissions) ? <ButtonEdit /> : ''}
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