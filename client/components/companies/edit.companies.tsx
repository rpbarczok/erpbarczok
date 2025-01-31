import '../../style.css'
import './companies.css'
import { Col, Row, Button, ButtonGroup, Form } from 'react-bootstrap'
import React, { useState } from 'react'
import { Company, CompanyEdit, Companytype } from './companies.jsx'
import { DataWithMeta } from '../forms.jsx'
import { transformCompany, transformCompanyEdit } from './companies.jsx'
import { client } from '../../utils/openapiclientaxios.js'

interface EditCompaniesInterface {
    setCompanyIsChanged: React.Dispatch<React.SetStateAction<boolean>>
    activeCompany: DataWithMeta<Company>
    listCompanytypes: DataWithMeta<Companytype>[]
}

export default function EditCompanies({ setCompanyIsChanged, activeCompany, listCompanytypes }: EditCompaniesInterface) {
    const [changeCompany, setChangeCompany] = useState<CompanyEdit>(transformCompany(activeCompany.data))

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

    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setChangeCompany({
            "name": e.target.value,
            "companytype": changeCompany.companytype,
            "abbr": changeCompany.abbr,
            "www": changeCompany.www
        })
    }

    const handleChangeAbbr = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setChangeCompany({
            "name": changeCompany.name,
            "companytype": changeCompany.companytype,
            "abbr": e.target.value,
            "www": changeCompany.www
        })
    }

    const handleChangeWWW = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setChangeCompany({
            "name": changeCompany.name,
            "companytype": changeCompany.companytype,
            "abbr": changeCompany.abbr,
            "www": e.target.value
        })
    }

    const handleChangeCompanytype = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault()
        setChangeCompany({
            "name": changeCompany.name,
            "companytype": e.target.value,
            "abbr": changeCompany.abbr,
            "www": changeCompany.www
        })
    }

    const handleSubmitChange = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (changeCompany.name !== "") {
            client.putCompanyById({ id: activeCompany.meta.location, "if-match": activeCompany.meta.etag },
                transformCompanyEdit(changeCompany))
                .then((res) => {
                    setCompanyIsChanged(true)
                })
                .catch(function (error) {
                    throw error
                })
        }
    }

    const Companytypes = () => {
        const optionsdefault = [<option key="default" id="default" value='default'>Rolle auswählen</option>]
        const options = listCompanytypes.map((role: DataWithMeta<Companytype>) => {
            return (
                <option key={role.meta.location} id={String(role.meta.location)} value={role.data.name} >{role.data.name}</option>
            )
        })
        return optionsdefault.concat(options)
    }

    return (
        <>
            <Row id="edit">
                <Col id='company' xl={5} lg={6} xs={12}>
                    <Form>
                        <Row>
                            <ButtonGroup className="function-button standardDesign">
                                <Button className="standardDesign" variant="outline-primary" onClick={handleSubmitChange}>Abspeichern</Button>
                                <Button className="standardDesign" variant="outline-primary" disabled >Rückgängig</Button>
                                <Button className="standardDesign" variant="outline-primary" onClick={handleDelete}>Löschen</Button>
                            </ButtonGroup>
                        </Row>
                        <Row className="defaultRow">
                            <Col xs={8}>
                                <Form.Group controlId="companyName">
                                    <Form.Label className="standardDesign">Firmenname</Form.Label>
                                    <Form.Control className="standardDesign" type="text" value={changeCompany.name} onChange={handleChangeName} />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="companyAbbr">
                                    <Form.Label className="standardDesign">Kürzel</Form.Label >
                                    <Form.Control type="text" className="standardDesign" value={changeCompany.abbr} onChange={handleChangeAbbr} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="defaultRow">
                            <Col xs={8}>
                                <Form.Group controlId="companyWWW">
                                    <Form.Label className="standardDesign">Internetadresse</Form.Label >
                                    <Form.Control type="text" className="standardDesign" value={changeCompany.www} onChange={handleChangeWWW} />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="companyCompanytype">
                                    <Form.Label className="standardDesign">Firmenrolle</Form.Label>
                                    <Form.Select className="standardDesign" key="companyCompanytype" value={changeCompany.companytype} onChange={handleChangeCompanytype}>
                                        <Companytypes />
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col>
                    CompanyAddition
                </Col>
            </Row>
        </>
    )
}

