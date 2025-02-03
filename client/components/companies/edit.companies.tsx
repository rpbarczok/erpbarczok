import '../../style.css'
import './companies.css'
import { Col, Row, Button, ButtonGroup, Form } from 'react-bootstrap'
import React, { useState } from 'react'
import { Company } from './companies.jsx'
import { DataWithMeta } from '../forms.jsx'
import { client } from '../../utils/openapiclientaxios.js'
import { Companytype } from 'components/admin/companytypes/companytypes.jsx'
import { InputCompanies } from './input.companies.jsx'

interface EditCompaniesInterface {
    setCompanyIsChanged: React.Dispatch<React.SetStateAction<boolean>>
    activeCompany: DataWithMeta<Company>
    listCompanytypes: DataWithMeta<Companytype>[]
    changeCompany: DataWithMeta<Company>
    setChangeCompany: React.Dispatch<React.SetStateAction<DataWithMeta<Company>>>
    handleSubmit: React.MouseEventHandler<HTMLButtonElement>
}

export default function EditCompanies({ setCompanyIsChanged, activeCompany, listCompanytypes, changeCompany, setChangeCompany, handleSubmit }: EditCompaniesInterface) {

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const userConfirmed = window.confirm("Willst du wirklich die Firma löschen?")
        if (userConfirmed) {
            client.deleteCompanyById(activeCompany.meta.location)
                .then((res) => {
                    setCompanyIsChanged(true)
                })
                .catch(function (error) {
                    throw error
                })
        }
    }

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
                        <InputCompanies changeCompany={changeCompany} setChangeCompany={setChangeCompany} listCompanytypes={listCompanytypes}/>
                    </Form>
                </Col>
                <Col>
                    CompanyAddition
                </Col>
            </Row>
        </>
    )
}

