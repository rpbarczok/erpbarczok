import { Col, Form, Row } from "react-bootstrap"
import { useAuth } from "react-oidc-context"
import { ChangedCompanyAction } from "./company.reducer.js"
import { Company } from "./companies.js"
import { DataWithMeta } from "components/forms.jsx"
import { CompanyType } from "components/admin/companyTypes/companyTypes.jsx"
import { CompanyTypesDropdown } from "./companyTypesDropdown.companies.jsx"

interface InputCompaniesComponent {
    companyTypesList: DataWithMeta<CompanyType>[]
    changedCompany: DataWithMeta<Company>
    changedCompanyDispatch: React.ActionDispatch<[action: ChangedCompanyAction]>
}

export const InputCompanies = ({companyTypesList, changedCompanyDispatch, changedCompany}:InputCompaniesComponent) => {
    const auth = useAuth()

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
                    <Form.Group controlId="companyName">
                        <Form.Label className="standardDesign">Firmenname</Form.Label>
                        <Form.Control required className="standardDesign" type="text" value={changedCompany.data.name} onChange={handleChangeName} disabled={(auth.user?.scope as string).indexOf('user') === -1} />
                        <Form.Control.Feedback type="invalid">Bitte einen Firmennamen eingeben!</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col xs={12} sm={4} lg={12} xxl={4}>
                    <Form.Group controlId="companyAbbr">
                        <Form.Label className="standardDesign">Kürzel (max 3 Zeichen)</Form.Label >
                        <Form.Control maxLength={3} type="text" className="standardDesign" value={changedCompany.data.abbr} onChange={handleChangeAbbr} disabled={(auth.user?.scope as string).indexOf('user') === -1} />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col xs={12} sm={6} lg={12} xxl={6}>
                    <Form.Group controlId="companyWWW">
                        <Form.Label className="standardDesign">Internetadresse</Form.Label >
                        <Form.Control type="text" className="standardDesign" value={changedCompany.data.www} onChange={handleChangeWWW} disabled={(auth.user?.scope as string).indexOf('user') === -1} />
                    </Form.Group>
                </Col>
                <Col xs={12} sm={6} lg={12} xxl={6}>
                    <Form.Group controlId="companyCompanyType">
                        <Form.Label className="standardDesign">Firmenrolle</Form.Label>
                        <Form.Select className="standardDesign" key="companyCompanyType" required value={changedCompany.data.companyType} onChange={handleChangeCompanyType} disabled={(auth.user?.scope as string).indexOf('user') === -1}>
                            <CompanyTypesDropdown companyTypesList={companyTypesList} />
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
        </>
    )
}