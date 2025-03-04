import '../../style.css'
import './companies.css'
import React, { useState } from "react"
import { Row, Col, ButtonGroup, Button } from "react-bootstrap"
import { useAuth } from "react-oidc-context"
import { SMSearchCompanies } from './sm.search.companies.jsx'
import { DataWithMeta } from 'components/forms.jsx'
import { Company } from './companies.jsx'
import { SMListCompanies } from './sm.list.companies.jsx'
import { useNotifier } from 'components/notifiers/useNotifier.js'
import { CompanyType } from 'components/admin/companyTypes/companyTypes.js'
import { DeleteCompanies } from './delete.companies.jsx'
import { AddCompany } from './add.companies.jsx'
import { SMEditCompanies } from './sm.edit.companies.jsx'
import { ChangedCompanyAction } from './company.reducer.js'

interface CompaniesFormSMComponent {
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

export const SMFormCompanies = ({ search,
    setSearch,
    filteredCompanies,
    activeCompany,
    handleChangeActive,
    companyTypesList,
    setIsCompanyChanged,
    setIsNew,
    changedCompany,
    changedCompanyDispatch }: CompaniesFormSMComponent) => {

    const [editNotes, addEditNote, removeEditNote] = useNotifier()
    const auth = useAuth()

    const buttonGroupAddDelete = <>
        <AddCompany
            handleChangeActive={handleChangeActive}
            addEditNote={addEditNote}
            setIsNew={setIsNew}
            setIsCompanyChanged={setIsCompanyChanged}
            companyTypesList={companyTypesList}
        />
        <DeleteCompanies
            company={activeCompany}
            setIsCompanyChanged={setIsCompanyChanged}
            addNote={addEditNote}
        />
    </>

    return (
        <>
            <Row >
                <Col sm={5} md={4}>
                    <SMSearchCompanies search={search} setSearch={setSearch} />
                </Col>
                <Col sm={7} md={5}>
                    <SMListCompanies
                        filteredCompanies={filteredCompanies}
                        activeCompany={activeCompany} handleChangeActive={handleChangeActive}
                    />
                </Col>
                <Col className="d-none d-md-block" md={3}>
                    <ButtonGroup vertical style={{ padding: '10px 0 0' }}>
                        {buttonGroupAddDelete}
                    </ButtonGroup >
                </Col>

            </Row >
            <Row className="d-none d-sm-block d-md-none">
                {(auth.user?.scope as string).indexOf('user') !== -1 ? <ButtonGroup>{buttonGroupAddDelete}</ButtonGroup> : ''}
            </Row>
            <Row>
                <SMEditCompanies
                    key={activeCompany.meta.location}
                    company={activeCompany}
                    companyTypesList={companyTypesList}
                    setIsCompanyChanged={setIsCompanyChanged}
                    notes={editNotes} addNote={addEditNote} removeNote={removeEditNote}
                    changedCompany={changedCompany} changedCompanyDispatch={changedCompanyDispatch}
                />
            </Row>
        </>
    )
}
