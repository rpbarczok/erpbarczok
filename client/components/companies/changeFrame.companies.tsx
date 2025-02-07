import { Companytype } from "components/admin/companytypes/companytypes.jsx"
import { DataWithMeta } from "components/forms.jsx"
import { Company } from "./companies.jsx"
import { Note, Notes } from "components/notifiers/notifiers.jsx"
import { Button, Col, Form, Modal, Row } from "react-bootstrap"
import { InputCompanies } from "./input.companies.jsx"
import React, { MouseEvent, useState } from "react"
import { client } from "utils/openapiclientaxios.js"
import { removeBeforeLastDigits } from "utils/removeBeforeLastDigits.js"
import { useNotifier } from "components/notifiers/useNotifier.js"

interface ChangeFrameCompaniesComponent {
    listCompanytypes: DataWithMeta<Companytype>[]
    changedCompanyBasis: DataWithMeta<Company>
    onChangeActive?: (active: number) => void
    setIsCompanyChanged: React.Dispatch<React.SetStateAction<boolean>>
    setIsNew?: React.Dispatch<React.SetStateAction<boolean>>
}

const ChangeFrameCompanies = ({ listCompanytypes, changedCompanyBasis, onChangeActive, setIsCompanyChanged, setIsNew }: ChangeFrameCompaniesComponent) => {
    const [show, setShow] = useState<boolean>(false)
    const [editNotes, addEditNote, removeEditNote] = useNotifier()
    const [addNotes, addAddNote, removeAddNote] = useNotifier()

    const handleSubmit = (e: MouseEvent<HTMLButtonElement>, changedCompany: DataWithMeta<Company>) => {
        e.preventDefault()
        if (onChangeActive && setIsNew) {
            if (changedCompany.data.name !== "" || changedCompany.data.companytype !== "default") {
                client.postCompany(null, changedCompany.data)
                    .then((res) => {
                        onChangeActive(Number(removeBeforeLastDigits(res.headers.location)))
                        const note: Note = {
                            message: `Neue Firma erfolgreich erstellt`,
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
                const note: Note = {
                    variant: 'danger',
                    message: `Bitte einen Namen und eine Firmenrolle eintragen`,
                }
                addAddNote(note)
            }
        } else {
            if (changedCompany.data.name !== "" || changedCompany.data.companytype !== "default") {
                if (changedCompany.data === changedCompanyBasis.data) {
                    const note: Note = {
                        variant: 'info',
                        message: `Keine Änderung in der Firma'${changedCompany.data.name}' vorgenommen.`,
                    }
                    addEditNote(note)
                } else {
                    client.putCompanyById({ id: changedCompany.meta.location, "if-match": changedCompany.meta.etag },
                        changedCompany.data)
                        .then((res) => {
                            const note: Note = {
                                variant: 'success',
                                message: `Neue Firma '${changedCompany.data.name}' erfolgreich überarbeitet.`,
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
            } else {
                const note: Note = {
                    variant: 'danger',
                    message: `Bitte mindestens einen Namen und eine Firmenrolle eintragen`,
                }
                addEditNote(note)
            }
        }
        
    }

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>, company: DataWithMeta<Company>) => {
        e.preventDefault()
        const userConfirmed = window.confirm("Willst du wirklich die Firma löschen?")
        if (userConfirmed) {
            client.deleteCompanyById(company.meta.location)
                .then((res) => {
                    setIsCompanyChanged(true)
                    const note: Note = {
                        variant: 'warning',
                        message: `Firma wurde gelöscht. Aktuell gibt es keine Möglichkeit, die Daten zurückzuholen`,
                    }
                    addEditNote(note)
                })
                .catch(error => {
                    const note: Note = {
                        variant: 'danger',
                        message: `Löschen der Firma hat nicht geklappt: ${error.message}`,
                    }
                    addEditNote(note)
                })

        }
    }

    if (changedCompanyBasis.meta.location === 0) {
        return (
            <>
                <Button className="standardDesign" variant="outline-primary" onClick={() => setShow(true)}>Firma hinzufügen</Button>
                <Form>
                    <Modal show={show} onHide={() => setShow(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Neue Firma hinzufügen</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <Notes notes={addNotes} removeNote={removeAddNote} />
                        <InputCompanies changedCompanyBasis={changedCompanyBasis} listCompanytypes={listCompanytypes} handleSubmit={handleSubmit} />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShow(false)}>Abbrechen</Button>
                        </Modal.Footer>
                    </Modal>
                </Form>
            </>
        )
    } else {
        return (
            <>
                <Row id="edit">
                    <Col id='company' xl={5} lg={6} xs={12}>
                        <Form>
                            <Notes notes={editNotes} removeNote={removeEditNote} />
                            <InputCompanies changedCompanyBasis={changedCompanyBasis} listCompanytypes={listCompanytypes} handleDelete={handleDelete} handleSubmit={handleSubmit} />
                        </Form>
                    </Col>
                    <Col>
                        CompanyAddition
                    </Col>
                </Row>
            </>
        )
    }

}

export default ChangeFrameCompanies
