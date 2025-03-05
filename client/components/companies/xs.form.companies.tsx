import React from "react"
import { Col, Row } from "react-bootstrap"
import { XSSearchCompanies } from "./xs.search.companies.jsx"
import { DataWithMeta } from "components/forms.jsx"
import { Company } from "./companies.jsx"
import { XSListCompanies } from "./xs.list.companies.jsx"
import { AddCompany } from "./add.companies.jsx"
import { useNotifier } from "components/notifiers/useNotifier.js"
import { CompanyType } from "components/admin/companyTypes/companyTypes.js"
import { ChangedCompanyAction } from "./company.reducer.js"

interface XSFormCompaniesComponent {
    search: string
    setSearch: React.Dispatch<React.SetStateAction<string>>
    filteredCompanies: DataWithMeta<Company>[]
    activeCompany: DataWithMeta<Company>
    handleChangeActive: (active: number) => void
    companyTypesList: DataWithMeta<CompanyType>[]
    setIsCompanyChanged: React.Dispatch<React.SetStateAction<boolean>>
    setIsNew: React.Dispatch<React.SetStateAction<boolean>>
    changedCompany: DataWithMeta<Company>
    changedCompanyDispatch: React.ActionDispatch<[action: ChangedCompanyAction]>
}

export const XSFormCompanies = ({ search, setSearch, filteredCompanies, activeCompany, handleChangeActive, companyTypesList, setIsCompanyChanged, setIsNew, changedCompany,changedCompanyDispatch }: XSFormCompaniesComponent) => {
    const [editNotes, addEditNote, removeEditNote] = useNotifier()
    return (
        <>
            <Row style={{ margin: "10px 3px 0 3px" }}>
                <AddCompany
                    handleChangeActive={handleChangeActive}
                    addEditNote={addEditNote}
                    setIsNew={setIsNew}
                    companyTypesList={companyTypesList}
                    setIsCompanyChanged={setIsCompanyChanged} />
            </Row>
            <Row >
                <Col>
                    <XSSearchCompanies search={search} setSearch={setSearch} />
                </Col>
            </Row >
                    <XSListCompanies
                        filteredCompanies={filteredCompanies}
                        changedCompany={changedCompany} changedCompanyDispatch={changedCompanyDispatch}
                        handleChangeActive={handleChangeActive} activeCompany={activeCompany}
                        companyTypesList={companyTypesList}
                        setIsCompanyChanged={setIsCompanyChanged}
                    />
        </>
    )
}
