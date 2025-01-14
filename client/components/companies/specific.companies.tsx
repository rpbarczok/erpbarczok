import {Col, Row, Button, ButtonGroup, Form} from 'react-bootstrap'
import "../../style.css"
import React, { useState } from 'react'
import axios from 'axios'
import { Company, CompanyLoc } from './companies.js'

interface SpecificComapniesInterface {
    setIsChanged: React.Dispatch<React.SetStateAction<boolean>>
    activeCompany: CompanyLoc
}

export default function SpecificCompanies({setIsChanged, activeCompany}: SpecificComapniesInterface) {

    const [changeCompany, setChangeCompany] = useState<Company>(activeCompany.company)

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const userConfirmed = window.confirm("Willst du wirklich die Firma löschen?")
        if (userConfirmed) {
            axios.delete(`http://localhost:8080${activeCompany.location}`)
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
                .put(`http://localhost:8080${activeCompany.location}`, changeCompany)
                .then((res) => {
                    setIsChanged(true)
                })
                .catch(function (error) {
                    console.log(error)
                })
        }
    }

    return (
        <>
            <Row id="specific">
                <Col id='company' xl={5} lg={6} xs={12}>
                    <Form>
                        <Row>
                            <ButtonGroup className="function-button smallDesign">
                                <Button className="smallDesign" variant="outline-primary" onClick={handleSubmitChange}>Abspeichern</Button>
                                <Button className="smallDesign" variant="outline-primary" disabled >Rückgängig</Button>
                                <Button className="smallDesign" variant="outline-primary" onClick={handleDelete}>Löschen</Button>
                            </ButtonGroup>
                        </Row>
                        <Row className="defaultRow">
                            <Col xs={8}>
                                <Form.Group controlId="companyName">
                                    <Form.Label className="smallDesign">Firmenname</Form.Label>
                                    <Form.Control className="smallDesign" type="text" value={changeCompany.name} onChange={handleChangeName} />
                                </Form.Group>
                            </Col>
                            <Col sc={2}>
                                <Form.Group controlId="companyAbbr">
                                    <Form.Label className="smallDesign">Kürzel</Form.Label >
                                    <Form.Control type="text" className="smallDesign" value={changeCompany.abbr} onChange={handleChangeAbbr} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="defaultRow">
                            <Col>
                                <Form.Group controlId="companyWWW">
                                    <Form.Label className="smallDesign">Internet Adresse</Form.Label >
                                    <Form.Control type="text" className="smallDesign" value={changeCompany.www} onChange={handleChangeWWW} />
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

