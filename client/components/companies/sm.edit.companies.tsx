import { useReducer, useState } from "react"
import { Button, ButtonGroup, Col, Form, Row } from "react-bootstrap"
import { useAuth } from "react-oidc-context"
import { ChangedCompanyAction, changedCompanyReducer } from "./company.reducer.js"
import { DataWithMeta } from "components/forms.jsx"
import { Company } from "./companies.jsx"
import { CompanyType } from "components/admin/companyTypes/companyTypes.jsx"
import { client } from "utils/openAPIClientAxios.js"
import { Note, Notes } from "components/notifiers/notifiers.jsx"
import { InputCompanies } from "./input.companies.jsx"

interface SMEditCompanies {
    company: DataWithMeta<Company>
    companyTypesList: DataWithMeta<CompanyType>[]
    setIsCompanyChanged: React.Dispatch<React.SetStateAction<boolean>>
    notes: Note[]
    addNote: (note: Note) => void
    removeNote: (note: Note) => void
    changedCompany: DataWithMeta<Company>
    changedCompanyDispatch: React.ActionDispatch<[action: ChangedCompanyAction]>
}

export const SMEditCompanies = ({ company, companyTypesList, setIsCompanyChanged, notes, addNote, removeNote, changedCompany,changedCompanyDispatch }: SMEditCompanies) => {
    const [validated, setValidated] = useState<boolean>(false)


    const auth = useAuth()
    const token = auth.user?.access_token

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e: React.FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget
        e.preventDefault()
        e.stopPropagation()
        if (form.checkValidity() === false) {
            setValidated(true)
        } else {
            client.putCompanyById({ id: changedCompany.meta.location, "if-match": changedCompany.meta.etag },
                changedCompany.data,
                { headers: { Authorization: `Bearer ${token}` } })
                .then((res) => {
                    const note: Note = {
                        variant: 'success',
                        message: `Firma erfolgreich überarbeitet.`,
                    }
                    addNote(note)
                    setIsCompanyChanged(true)
                })
                .catch(function (error) {
                    const note: Note = {
                        variant: 'danger',
                        message: `Fehler beim Abspeichern der Firmendaten: ${error.message}`,
                    }
                    addNote(note)
                })
        }
    }

    const ButtonEdit = () => {
        const isNotChanged: boolean = (company.data.name === changedCompany.data.name &&
            company.data.abbr === changedCompany.data.abbr &&
            company.data.www === changedCompany.data.www &&
            company.data.companyType === changedCompany.data.companyType)

        const handleUndo: React.MouseEventHandler<HTMLButtonElement> = (e) => {
            e.preventDefault()
            setValidated(false)
            changedCompanyDispatch({ type: 'companyChange', newValue: company })
        }

        return (
            <>
                <Row className="d-none d-sm-block">
                    <ButtonGroup className="standardDesign float-end" >
                        <Button type="submit" className="standardDesign" variant="outline-primary" disabled={isNotChanged}>Abspeichern</Button>
                        <Button className="standardDesign" variant="outline-primary" disabled={isNotChanged} onClick={handleUndo} >Rückgängig</Button>
                    </ButtonGroup>
                </Row>
                <Row className="d-block d-sm-none">
                    <ButtonGroup className="standardDesign float-end" vertical>
                        <Button type="submit" className="standardDesign" variant="outline-primary" disabled={isNotChanged}>Abspeichern</Button>
                        <Button className="standardDesign" variant="outline-primary" disabled={isNotChanged} onClick={handleUndo} >Rückgängig</Button>
                    </ButtonGroup>
                </Row>
            </>
        )
    }

    return (
        <>
            <Col id='company' sm={12} lg={6} xl={5} >

                <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e)}>
                    {(auth.user?.scope as string).indexOf('user') !== -1 ? <ButtonEdit /> : ''}
                    <Row>
                        <Col className="standardDesign">
                            <Notes notes={notes} removeNote={removeNote} />
                        </Col>
                    </Row>
                    <InputCompanies
                        companyTypesList={companyTypesList}
                        changedCompany={changedCompany} changedCompanyDispatch={changedCompanyDispatch} />
                </Form>
            </Col>
            <Col sm={12} lg={6} xl={7}>
                CompanyAddition
            </Col>
        </>
    )
}