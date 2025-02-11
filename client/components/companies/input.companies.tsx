import { Row, Col, Form, ButtonGroup, Button, Modal } from "react-bootstrap"
import { CompanytypesDropdown } from "./companytypesdropdown.companies.jsx"
import { Company } from "./companies.jsx"
import { DataWithMeta } from "components/forms.jsx"
import { Companytype } from "components/admin/companytypes/companytypes.jsx"
import { useReducer, useState } from "react"
import { changedCompanyReducer } from "./company.reducer.js"
import { Notes } from "components/notifiers/notifiers.jsx"
import { useNotifier } from "components/notifiers/useNotifier.js"
import { client } from "utils/openapiclientaxios.js"
import { removeBeforeLastDigits } from "utils/removeBeforeLastDigits.js"
import { Note } from "components/notifiers/notifiers.jsx"
import e from "express"

interface InputCompaniesComponent {
    listCompanytypes: DataWithMeta<Companytype>[]
    company: DataWithMeta<Company>
    setIsCompanyChanged: React.Dispatch<React.SetStateAction<boolean>>
    addEditNote: (note: Note) => void
    setIsNew?: React.Dispatch<React.SetStateAction<boolean>> // only for add Company
    onChangeActive?: (active: number) => void // only for add Company
    setShow?: React.Dispatch<React.SetStateAction<boolean>> // only for add Company
    show?: boolean // only for add Company
    editNotes?: Note[] // only for edit Company
    removeEditNote?: (note: Note) => void // only for edit Company
}

export const InputCompanies = ({ listCompanytypes, company, onChangeActive, setIsCompanyChanged, setIsNew, addEditNote, removeEditNote, editNotes, setShow, show }: InputCompaniesComponent) => {
    const [addNotes, addAddNote, removeAddNote] = useNotifier()
    const [changedCompany, changedCompanyDispatch] = useReducer(changedCompanyReducer, company)
    const [validated, setValidated] = useState<boolean>(false)

    const isNotChanged: boolean = (company.data.name === changedCompany.data.name &&
        company.data.abbr === changedCompany.data.abbr &&
        company.data.www === changedCompany.data.www &&
        company.data.companytype === changedCompany.data.companytype)

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e: React.FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget
        e.preventDefault()
        e.stopPropagation()
        if (form.checkValidity() === false) {
            setValidated(true)
        } else {
            if (onChangeActive && setIsNew && setShow) {
                client.postCompany(null, changedCompany.data)
                    .then((res) => {
                        onChangeActive(Number(removeBeforeLastDigits(res.headers.location)))
                        const note: Note = {
                            message: `Neue Firma erfolgreich erstellt.`,
                            variant: 'success',
                        }
                        addEditNote(note)
                        setIsCompanyChanged(true)
                        setIsNew(true)
                        setShow(false)
                    })
                    .catch((error) => {
                        const note: Note = {
                            variant: 'danger',
                            message: `Fehler bei Erstellung der neuen Firma: ${error.message}`,
                        }
                        addAddNote(note)
                    })
            } else {
                client.putCompanyById({ id: changedCompany.meta.location, "if-match": changedCompany.meta.etag },
                    changedCompany.data)
                    .then((res) => {
                        const note: Note = {
                            variant: 'success',
                            message: `Firma erfolgreich überarbeitet.`,
                        }
                        addEditNote(note)
                        setIsCompanyChanged(true)
                    })
                    .catch(function (error) {
                        const note: Note = {
                            variant: 'danger',
                            message: `Fehler beim Abspeichern der Firmendaten: ${error.message}`,
                        }
                        addEditNote(note)
                    })
            }
        }
    }

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

    const handleChangeCompanytype = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault()
        changedCompanyDispatch({ type: 'companytypeChange', newValue: e.target.value })
    }

    const handleClose: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()
        if (setShow) {
            setValidated(false)
            setShow(false)
        }
    }

    const handleUndo: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()
        setValidated(false)
        changedCompanyDispatch({ type: 'companyChange', newValue: company })
    }

    const input = (
        <>
            <Row className="defaultRow">
                <Col xs={7}>
                    <Form.Group controlId="companyName">
                        <Form.Label className="standardDesign">Firmenname</Form.Label>
                        <Form.Control required className="standardDesign" type="text" value={changedCompany.data.name} onChange={handleChangeName} />
                        <Form.Control.Feedback type="invalid">Bitte einen Firmennamen eingeben!</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="companyAbbr">
                        <Form.Label className="standardDesign">Kürzel (max 3 Zeichen)</Form.Label >
                        <Form.Control maxLength={3} type="text" className="standardDesign" value={changedCompany.data.abbr} onChange={handleChangeAbbr} />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="defaultRow">
                <Col xs={7}>
                    <Form.Group controlId="companyWWW">
                        <Form.Label className="standardDesign">Internetadresse</Form.Label >
                        <Form.Control type="text" className="standardDesign" value={changedCompany.data.www} onChange={handleChangeWWW} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="companyCompanytype">
                        <Form.Label className="standardDesign">Firmenrolle</Form.Label>
                        <Form.Select className="standardDesign" key="companyCompanytype" required value={changedCompany.data.companytype} onChange={handleChangeCompanytype}>
                            <CompanytypesDropdown listCompanytypes={listCompanytypes} />
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
        </>
    )

    if (company.meta.location === 0 && setShow) {
        return (
            <>
                <Modal
                    show={show}
                    onHide={() => setShow(false)}
                    backdrop="static"
                    size='lg'>
                    <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Neue Firma hinzufügen</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Notes notes={addNotes} removeNote={removeAddNote} />
                            <Modal.Body>
                                {input}
                            </Modal.Body>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button type="submit" variant='primary'>Abspeichern</Button>
                            <Button variant="secondary" onClick={(e) => handleClose(e)}>Abbrechen</Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </>
        )
    } else if (editNotes && removeEditNote) {
        return (
            <>
                <Row id="edit">
                    <Col id='company' xl={5} lg={6} xs={12}>
                        <Row id="edit">
                            <Col id='company' xl={5} lg={6} xs={12}></Col>
                            <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e)}>
                                <Row>
                                    <ButtonGroup className="function-button standardDesign">
                                        <Button type="submit" className="standardDesign" variant="outline-primary" disabled={isNotChanged}>Abspeichern</Button>
                                        <Button className="standardDesign" variant="outline-primary" disabled={isNotChanged} onClick={handleUndo} >Rückgängig</Button>
                                    </ButtonGroup>
                                </Row>
                                <Row>
                                    <Col className="standardDesign">
                                        <Notes notes={editNotes} removeNote={removeEditNote} />
                                    </Col>
                                </Row>
                                {input}
                            </Form>
                        </Row>
                    </Col>
                    <Col>
                        CompanyAddition
                    </Col>
                </Row >
            </>
        )

    }
}
