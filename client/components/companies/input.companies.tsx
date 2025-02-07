import { Row, ButtonGroup, Button, Col, Form, Modal } from "react-bootstrap"
import { CompanytypesDropdown } from "./companytypesdropdown.companies.jsx"
import { Company } from "./companies.jsx"
import { DataWithMeta } from "components/forms.jsx"
import { Companytype } from "components/admin/companytypes/companytypes.jsx"
import { useEffect, useReducer } from "react"
import { changedCompanyReducer } from "./company.reducer.js"

interface InputCompaniesComponent {
    changedCompanyBasis: DataWithMeta<Company>
    listCompanytypes: DataWithMeta<Companytype>[]
    handleSubmit: (e: React.MouseEvent<HTMLButtonElement>, company: DataWithMeta<Company>) => void
    handleDelete?: (e: React.MouseEvent<HTMLButtonElement>, company: DataWithMeta<Company>) => void
}

export const InputCompanies = ({ changedCompanyBasis, listCompanytypes, handleSubmit, handleDelete }: InputCompaniesComponent) => {
    
    const [changedCompany, changedCompanyDispatch] = useReducer(changedCompanyReducer, changedCompanyBasis)


        // useEffect(function logChangedCompanyBasis() {
        //     {
        //         changedCompanyDispatch({type: 'companyChange', newValue: changedCompanyBasis})

        //     }
        // }, [changedCompanyBasis])

        // useEffect(function logChangedCompany() {
        //     {
        //         console.log("New changedCompany:", JSON.stringify(changedCompany))

        //         return () => {
        //             console.log("terminating changedCompany")
        //         }
        //     }
        // }, [changedCompany])

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

    const Input = (
        <>
            <Row className="defaultRow">
                <Col xs={8}>
                    <Form.Group controlId="companyName">
                        <Form.Label className="standardDesign">Firmenname</Form.Label>
                        <Form.Control className="standardDesign" type="text" value={changedCompany.data.name} onChange={handleChangeName} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="companyAbbr">
                        <Form.Label className="standardDesign">Kürzel</Form.Label >
                        <Form.Control type="text" className="standardDesign" value={changedCompany.data.abbr} onChange={handleChangeAbbr} />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="defaultRow">
                <Col xs={8}>
                    <Form.Group controlId="companyWWW">
                        <Form.Label className="standardDesign">Internetadresse</Form.Label >
                        <Form.Control type="text" className="standardDesign" value={changedCompany.data.www} onChange={handleChangeWWW} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="companyCompanytype">
                        <Form.Label className="standardDesign">Firmenrolle</Form.Label>
                        <Form.Select className="standardDesign" key="companyCompanytype" value={changedCompany.data.companytype} onChange={handleChangeCompanytype}>
                            <CompanytypesDropdown listCompanytypes={listCompanytypes} />
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
        </>
    )

    if (changedCompanyBasis.meta.location !== 0 && handleDelete) {
        return (
            <>
                <Row>
                    <ButtonGroup className="function-button standardDesign">
                        <Button className="standardDesign" variant="outline-primary" onClick={(e) => handleSubmit(e, changedCompany)}>Abspeichern</Button>
                        <Button className="standardDesign" variant="outline-primary" disabled >Rückgängig</Button>
                        <Button className="standardDesign" variant="outline-primary" onClick={(e) => handleDelete(e, changedCompany)}>Löschen</Button>
                    </ButtonGroup>
                </Row>
                {Input}
            </>
        )
    } else {
        return (
            <Modal.Body>
            <Button type="submit" variant='primary' onClick={(e) => handleSubmit(e, changedCompany)}>Abspeichern</Button>
            {Input}
        </Modal.Body>
        )
    }
}
