import { Row, ButtonGroup, Button, Col, Form } from "react-bootstrap"
import { CompanytypesDropdown } from "./companytypesdropdown.companies.jsx"
import { ChangeCompanyAction, Company } from "./companies.jsx"
import { DataWithMeta } from "components/forms.jsx"
import { Companytype } from "components/admin/companytypes/companytypes.jsx"

interface InputCompaniesComponent {
    changeCompany: DataWithMeta<Company>
    listCompanytypes: DataWithMeta<Companytype>[]
    changeCompanyDispatch: React.ActionDispatch<[action: ChangeCompanyAction]>
}

export const InputCompanies = ({ changeCompany, listCompanytypes, changeCompanyDispatch }: InputCompaniesComponent) => {

    const handleChangeName  = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        changeCompanyDispatch({type: 'nameChange', newValue: e.target.value })
    }

    const handleChangeAbbr = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        changeCompanyDispatch({type: 'abbrChange', newValue: e.target.value })
    }

    const handleChangeWWW = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        changeCompanyDispatch({type: 'wwwChange', newValue: e.target.value })
    }

    const handleChangeCompanytype = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault()
        changeCompanyDispatch({type: 'companytypeChange', newValue: e.target.value })
    }

    return (
        <>
            <Row className="defaultRow">
                <Col xs={8}>
                    <Form.Group controlId="companyName">
                        <Form.Label className="standardDesign">Firmenname</Form.Label>
                        <Form.Control className="standardDesign" type="text" value={changeCompany.data.name} onChange={handleChangeName} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="companyAbbr">
                        <Form.Label className="standardDesign">Kürzel</Form.Label >
                        <Form.Control type="text" className="standardDesign" value={changeCompany.data.abbr} onChange={handleChangeAbbr} />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="defaultRow">
                <Col xs={8}>
                    <Form.Group controlId="companyWWW">
                        <Form.Label className="standardDesign">Internetadresse</Form.Label >
                        <Form.Control type="text" className="standardDesign" value={changeCompany.data.www} onChange={handleChangeWWW} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="companyCompanytype">
                        <Form.Label className="standardDesign">Firmenrolle</Form.Label>
                        <Form.Select className="standardDesign" key="companyCompanytype" value={changeCompany.data.companytype} onChange={handleChangeCompanytype}>
                            <CompanytypesDropdown listCompanytypes={listCompanytypes} />
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
        </>
    )
}