import '../../style.css'
import './companies.css'
import { Col, Row, Button, Form, Modal } from "react-bootstrap"
import React, { ChangeEvent, MouseEvent, useState } from 'react'
import { client } from '../../utils/openapiclientaxios.js'
import { DataWithMeta } from '../forms.jsx'
import { Company, Companytype } from "./companies.jsx"
import { removeBeforeLastDigits } from 'utils/removeBeforeLastDigits.js'

interface AddCompaniesInterface {
    setCompanyIsChanged: React.Dispatch<React.SetStateAction<boolean>>
    onChangeActive: Function
    setIsNew: React.Dispatch<React.SetStateAction<boolean>>
    listCompanytypes: DataWithMeta<Companytype>[]
}

export default function AddCompanies({setCompanyIsChanged, onChangeActive, setIsNew, listCompanytypes}: AddCompaniesInterface) {
    const [show, setShow] = useState<boolean>(false) // to handle the modal
    const [company, setCompany] = useState<Company>({ name: '', companytype: 'default', abbr: "", www: "" })
    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false)

    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setCompany({
            ...company,
            name: e.target.value
        })
    }

    const handleChangeAbbr = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setCompany({
            ...company,
            abbr: e.target.value
        })
    }

    const handleChangeWWW = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setCompany({
            ...company,
            www: e.target.value
        })
    }

    const handleChangeCompanytype = (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault()
        setCompany({
            ...company,
            companytype: e.target.value
        })
    }

    const handleSubmitNew = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (company.name !== "") {
            client.postCompany(null, company)
                .then((res) => {
                    setCompanyIsChanged(true)
                    setIsNew(true)
                    onChangeActive(Number(removeBeforeLastDigits(res.headers.location)))
                    setCompany({
                        name: '',
                        abbr: '',
                        www: '',
                        companytype: 'default'
                    })
                    setShow(false)
                })
        }
    }

    const Companytypes = () => {
        const optionsdefault = [<option id="default" value="default" selected ={company.companytype==='default'} >Rolle auswählen</option>]
        const options = listCompanytypes.map((role: DataWithMeta<Companytype>) => {
            return (
                <option id={String(role.meta.location)} value={role.data.name} selected={company.companytype===role.data.name}>{role.data.name}</option>
            )
        })
        return optionsdefault.concat(options)
    }

    return (
        <>
            <Button className="standardDesign" variant="outline-primary" onClick={handleShow}>Firma hinzufügen</Button>
            <Form>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Neue Firma hinzufügen</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col>
                                <Form.Group controlId="formFirmenname">
                                    <Form.Label>Firmenname</Form.Label>
                                    <Form.Control type="text" placeholder='Firmenname' onChange={handleChangeName} />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formFirmenkuerzel">
                                    <Form.Label>Firmenkürzel</Form.Label>
                                    <Form.Control type="text" placeholder='Firmenkürzel' onChange={handleChangeAbbr} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="formWWW">
                                    <Form.Label>Internetadresse</Form.Label>
                                    <Form.Control type="text" placeholder='Internetadresse' onChange={handleChangeWWW} />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Firmenrolle</Form.Label>
                                    <Form.Select onChange={handleChangeCompanytype}>
                                        <Companytypes />
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Abbrechen</Button>
                        <Button type="submit" variant='primary' onClick={handleSubmitNew}>Abspeichern</Button>
                    </Modal.Footer>
                </Modal>
            </Form>
        </>
    )
} 
