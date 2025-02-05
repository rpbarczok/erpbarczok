import '../../style.css'
import './companies.css'
import { Col, Row, Button, ButtonGroup, Form } from 'react-bootstrap'
import React from 'react'
import { ChangeCompanyAction, Company } from './companies.jsx'
import { DataWithMeta } from '../forms.jsx'
import { Companytype } from 'components/admin/companytypes/companytypes.jsx'
import { InputCompanies } from './input.companies.jsx'

interface EditCompaniesInterface {
    listCompanytypes: DataWithMeta<Companytype>[]
    changeCompany: DataWithMeta<Company>
    handleSubmit: React.MouseEventHandler<HTMLButtonElement>
    changeCompanyDispatch: React.ActionDispatch<[action: ChangeCompanyAction]>
    handleDelete: React.MouseEventHandler<HTMLButtonElement>
}

export default function EditCompanies({ changeCompanyDispatch, listCompanytypes, changeCompany, handleSubmit, handleDelete }: EditCompaniesInterface) {

    return (
        <>
            <Row id="edit">
                <Col id='company' xl={5} lg={6} xs={12}>
                    <Form>
                        <Row>
                            <ButtonGroup className="function-button standardDesign">
                                <Button className="standardDesign" variant="outline-primary" onClick={handleSubmit}>Abspeichern</Button>
                                <Button className="standardDesign" variant="outline-primary" disabled >Rückgängig</Button>
                                <Button className="standardDesign" variant="outline-primary" onClick={handleDelete}>Löschen</Button>
                            </ButtonGroup>
                        </Row>
                        <InputCompanies changeCompany={changeCompany} changeCompanyDispatch={changeCompanyDispatch} listCompanytypes={listCompanytypes}/>
                    </Form>
                </Col>
                <Col>
                    CompanyAddition
                </Col>
            </Row>
        </>
    )
}

