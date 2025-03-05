import { DataWithMeta } from "components/forms.jsx"
import { Company } from "./companies.jsx"
import { Button, Col, Container, ListGroup, Row } from "react-bootstrap"
import { XSEditCompanies } from "./xs.edit.companies.jsx"
import { useState } from "react"
import { ChangedCompanyAction } from "./company.reducer.js"
import { CompanyType } from "components/admin/companyTypes/companyTypes.jsx"
import { useNotifier } from "components/notifiers/useNotifier.js"

interface XSListCompaniesComponent {
    filteredCompanies: DataWithMeta<Company>[]
    changedCompany: DataWithMeta<Company>
    changedCompanyDispatch: React.ActionDispatch<[action: ChangedCompanyAction]>
    activeCompany: DataWithMeta<Company>
    handleChangeActive: (active: number) => void
    companyTypesList: DataWithMeta<CompanyType>[]
    setIsCompanyChanged: React.Dispatch<React.SetStateAction<boolean>>
}

export const XSListCompanies = ({ filteredCompanies, changedCompany, changedCompanyDispatch, activeCompany, companyTypesList, setIsCompanyChanged, handleChangeActive }: XSListCompaniesComponent) => {
    const [show, setShow] = useState(false)
    const [editNotes, addEditNote, removeEditNote] = useNotifier()

    const handleOpenModal = (e: React.MouseEvent<Element, MouseEvent>, location: number) => {
        e.preventDefault
        handleChangeActive(location)
        setShow(true)
    }

    const List = () => {
        if (filteredCompanies.length === 0) {
            return (
                <p>Keine Firmen gefunden!</p>
            )
        } else {
            return filteredCompanies.map((element) => {
                return (
                    <ListGroup.Item key={element.meta.location} onClick={(e) => handleOpenModal(e, element.meta.location)}>
                        {element.data.name + (element.data.abbr ? " (" + element.data.abbr + ")" : "")}
                    </ListGroup.Item>
                )
            }
            )
        }
    }

    return (
        <>
            <ListGroup id="company-list" className="scrollBoxXS" style={{ marginTop: "10px" }}>
                <List />
            </ListGroup >

            <XSEditCompanies
                show={show} setShow={setShow}
                companyTypesList={companyTypesList}
                addEditNote={addEditNote}
                setIsCompanyChanged={setIsCompanyChanged}
                changedCompany={changedCompany} changedCompanyDispatch={changedCompanyDispatch}
                activeCompany={activeCompany}
            />
        </>
    )
}