import {Button, Form, Modal} from "react-bootstrap"
import "../../style.css"
import {ChangeEvent, MouseEvent, useState} from 'react' 
import axios from 'axios'
import { Company } from "./companies.js"


export default function AddCompanies(props) {
    const [show, setShow] = useState<boolean>(false) // to handle the modal
    const [company, setCompany] = useState<Company>({name: "", abbr: ""}) 
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

    const handleSubmitNew = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (company.name !== "") {
            axios
                .post(`http://localhost:8080/companies/`, company)
                .then((res) => {
                    props.setIsChanged(true)
                    props.setIsNew(true)
                    props.onChangeActive(res.headers.location)
                    setCompany({
                        abbr: "",
                        name: ""
                    })
                    setShow(false)
                })
        }
    }

    return (
            <>
                <Button className="smallDesign" variant="outline-primary" onClick={handleShow}>Firma hinzufügen</Button>
                <Form>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Neue Firma hinzufügen</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group controlId="formFirmenname">
                                <Form.Label>Firmenname</Form.Label>
                                <Form.Control type="text" placeholder='Firmenname' onChange={handleChangeName}/>
                            </Form.Group>
                            <Form.Group controlId="formFirmenkuerzel">
                                <Form.Label>Firmenkuerzel</Form.Label>
                                <Form.Control type="text" placeholder='Firmenkürzel' onChange={handleChangeAbbr}/>
                            </Form.Group>
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
