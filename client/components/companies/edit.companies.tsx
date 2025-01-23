import { Col, Row, Button, ButtonGroup, Form } from 'react-bootstrap'
import "../../style.css"
import React, { useState } from 'react'
import axios from 'axios'
import { Company, Companytype } from './companies.jsx'
import { Loc } from '../../app.jsx'

interface EditCompaniesInterface {
    setIsChanged: React.Dispatch<React.SetStateAction<boolean>>
    activeCompany: Loc<Company>
    listCompanytypes: Loc<Companytype>[]
}

export default function EditCompanies({ setIsChanged, activeCompany, listCompanytypes }: EditCompaniesInterface) {

    const [changeCompany, setChangeCompany] = useState<Company>(activeCompany.data)

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const userConfirmed = window.confirm("Willst du wirklich die Firma löschen?")
        if (userConfirmed) {
            axios.delete(activeCompany.location)
                .then((res) => {
                    setIsChanged(true)
                })
                .catch(function (error) {
                    console.log(error)
                })
        }
    }

    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setChangeCompany({
            "name": e.target.value,
            "abbr": changeCompany.abbr,
            "www": changeCompany.www
        })
    }

    const handleChangeAbbr = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setChangeCompany({
            "name": changeCompany.name,
            "abbr": e.target.value,
            "www": changeCompany.www
        })
    }

    const handleChangeWWW = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setChangeCompany({
            "name": changeCompany.name,
            "abbr": changeCompany.abbr,
            "www": e.target.value
        })
    }

    const handleSubmitChange = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (changeCompany.name !== "") {
            axios
                .put(activeCompany.location, changeCompany)
                .then((res) => {
                    setIsChanged(true)
                })
                .catch(function (error) {
                    console.log(error)
                })
        }
    }

    const Companytypes = () => {
        const optionsdefault = [<option id="default" value="default">Rolle auswählen</option>]
        const options = listCompanytypes.map((role: Loc<Companytype>) => {
            return (
                <option id={role.location} value={role.data.name}>{role.data.name}</option>
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
                                    <Form.Label className="standardDesign">Internet Adresse</Form.Label >
                                    <Form.Control type="text" className="standardDesign" value={changeCompany.www} onChange={handleChangeWWW} />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label className="standardDesign">Firmenrolle</Form.Label>
                                    <Form.Select className="standardDesign">
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

