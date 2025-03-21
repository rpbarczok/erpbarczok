import React from "react"
import { Col, Row } from "react-bootstrap"
import { XSSearchCompanies } from "./xs.search.companies.jsx"
import { DataWithMeta } from "components/forms.jsx"
import { Company } from "./companies.jsx"
import { XSListCompanies } from "./xs.list.companies.jsx"
import { AddCompany } from "./add.companies.jsx"
import { CompanyType } from "components/resources/companyTypes/companyTypes.js"
import { ChangedCompanyAction } from "./company.reducer.js"
import { Heading } from "components/headings/heading.jsx"
import { Note, Notes } from "components/notifiers/notifiers.jsx"
import { useNotifier } from "components/notifiers/useNotifier.js"
import { hasPermission } from "utils/hasPermission.js"
import { useContextThrowUndefined } from "utils/contextUndefined.js"
import { PermissionContext } from "utils/permissionContext.js"

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

export const XSFormCompanies = ({
    search,
    setSearch,
    filteredCompanies,
    activeCompany,
    handleChangeActive,
    companyTypesList,
    setIsCompanyChanged,
    setIsNew,
    changedCompany,
    changedCompanyDispatch }: XSFormCompaniesComponent) => {

    const [editNotes, addEditNote, removeEditNote] = useNotifier()
    const {permissions, setPermissions} = useContextThrowUndefined(PermissionContext)

    return (

        <Col className="flex-grow-1 d-flex flex-column" style={{ overflowY: "hidden" }}>
            <Heading title="Stammdaten: Kunden, Lieferanten, Spediteure" cssClass="stammForm" />
            <Row style={{ margin: "10px 3px 0 3px" }}>
                {hasPermission(['user'], permissions) ? <AddCompany
                    handleChangeActive={handleChangeActive}
                    addEditNote={addEditNote}
                    setIsNew={setIsNew}
                    companyTypesList={companyTypesList}
                    setIsCompanyChanged={setIsCompanyChanged}
                /> : '' }
            </Row>
            <Notes notes={editNotes} removeNote={removeEditNote}/>
            <XSSearchCompanies search={search} setSearch={setSearch} />
            <XSListCompanies
                filteredCompanies={filteredCompanies}
                changedCompany={changedCompany} changedCompanyDispatch={changedCompanyDispatch}
                handleChangeActive={handleChangeActive} activeCompany={activeCompany}
                companyTypesList={companyTypesList}
                setIsCompanyChanged={setIsCompanyChanged}
                addEditNote={addEditNote}
            />
        </Col>
    )
}
