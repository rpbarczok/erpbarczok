import { DataWithMeta } from '../Pages.jsx'
import { useCompanies } from './utils/useCompanies.js'
import { useResources } from 'components/resources/useResources.js'
import { CompanySMPage } from './companiesSM/CompanySMPage.js'
import { Row } from 'react-bootstrap'
import { CompanyXSPage } from './companiesXS/CompanyXSPage.js'
import { emptyCompanyTypeResource } from 'components/resources/companyTypes/CompanyTypesInput.js'
import { useState } from 'react'

export interface Company {
    'name': string
    'companyType': string
    'abbr'?: string
    'www'?: string
}

export const emptyCompany: DataWithMeta<Company> = { 'meta': { 'location': 0, 'etag': '' }, 'data': { 'name': '', 'companyType': 'default', 'abbr': '', 'www': '' } }

export const CompanyPageBasis = () => {
    const [companyTypesList] = useResources(emptyCompanyTypeResource)
    const [search, setSearch] = useState<string>('') // Content of the search input fiel
    const [
        filteredCompaniesList,
        activeCompany,
        changedCompany, 
        submitChangedCompany, 
        submitNewCompany, 
        deleteCompany,
        changeActive,
        changedCompanyDispatch
    ] = useCompanies(search)

    return (
        <>
            <Row className='d-none d-sm-flex flex-grow-1 flex-column' style={{ overflowY: 'scroll' }}>
                <CompanySMPage
                    search={search} setSearch={setSearch}
                    filteredCompaniesList={filteredCompaniesList}
                    activeCompany={activeCompany}
                    changeActive={changeActive}
                    companyTypesList={companyTypesList}
                    changedCompany={changedCompany} changedCompanyDispatch={changedCompanyDispatch}
                    submitChangedCompany={submitChangedCompany} submitNewCompany={submitNewCompany} deleteCompany={deleteCompany}
                />
            </Row>
            <Row className='d-sm-none flex-grow-1 d-flex flex-column' style={{ overflowY: 'hidden' }}>
                <CompanyXSPage
                    search={search} setSearch={setSearch}
                    filteredCompaniesList={filteredCompaniesList}
                    activeCompany={activeCompany}
                    changeActive={changeActive}
                    companyTypesList={companyTypesList}
                    changedCompany={changedCompany} changedCompanyDispatch={changedCompanyDispatch}
                    submitChangedCompany={submitChangedCompany} submitNewCompany={submitNewCompany} deleteCompany={deleteCompany}
                />
            </Row >
        </>
    )
}
