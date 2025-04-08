import { Col, Form, Row } from 'react-bootstrap'
import { ChangedCompanyAction } from './changedCompanyReducer.js'
import { Company } from './CompanyPageBasis.jsx'
import { DataWithMeta } from '../Pages.jsx'
import { CompanyType } from '../resources/companyTypes/CompanyTypesInput.jsx'
import { CompanyTypesDropdown } from './CompanyTypesDropdown.jsx'
import { hasPermission } from '../../utils/hasPermission.js'
import { PermissionContext } from '../../utils/permissionContext.js'
import { useContextThrowUndefined } from '../../utils/contextUndefined.js'

interface CompanyInputInterface {
    companyTypesList: DataWithMeta<CompanyType>[]
    changedCompany: DataWithMeta<Company>
    changedCompanyDispatch: React.ActionDispatch<[action: ChangedCompanyAction]>
}

export const CompanyInput = ({ companyTypesList, changedCompanyDispatch, changedCompany }: CompanyInputInterface) => {

    const { permissions } = useContextThrowUndefined(PermissionContext)
    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        changedCompanyDispatch({ type: 'nameChange', newValue: e.target.value })
    }

    const handleChangeAbbr = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        changedCompanyDispatch({ type: 'abbrChange', newValue: e.target.value })
    }

    const handleChangeWWW = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        changedCompanyDispatch({ type: 'wwwChange', newValue: e.target.value })
    }

    const handleChangeCompanyType = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault()
        changedCompanyDispatch({ type: 'companyTypeChange', newValue: e.target.value })
    }

    return (
        <>
            <Row>
                <Col xs={12} sm={8} lg={12} xxl={8}>
                    <Form.Group controlId='companyName'>
                        <Form.Label className= 'labelPadding'>Firma</Form.Label>
                        <Form.Control required  type='text' value={changedCompany.data.name} onChange={handleChangeName} disabled={!hasPermission(['user'], permissions) } />
                        <Form.Control.Feedback type='invalid'>Bitte eine Firma eingeben!</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col xs={12} sm={4} lg={12} xxl={4}>
                    <Form.Group controlId='companyAbbr'>
                        <Form.Label className= 'labelPadding'>Kürzel (max 3 Zeichen)</Form.Label >
                        <Form.Control maxLength={3} type='text'  value={changedCompany.data.abbr} onChange={handleChangeAbbr} disabled={!hasPermission(['user'], permissions)} />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col xs={12} sm={6} lg={12} xxl={6}>
                    <Form.Group controlId='companyWWW'>
                        <Form.Label className= 'labelPadding' >Homepage</Form.Label >
                        <Form.Control type='text'  value={changedCompany.data.www} onChange={handleChangeWWW} disabled={!hasPermission(['user'], permissions)} />
                    </Form.Group>
                </Col>
                <Col xs={12} sm={6} lg={12} xxl={6}>
                    <Form.Group controlId='companyCompanyType'>
                        <Form.Label className= 'labelPadding' >Art der Beziehung zum Unternehmen</Form.Label>
                        <Form.Select  key='companyCompanyType' required value={changedCompany.data.companyType} onChange={handleChangeCompanyType} disabled={!hasPermission(['user'], permissions)}>
                            <CompanyTypesDropdown companyTypesList={companyTypesList} />
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
        </>
    )
}