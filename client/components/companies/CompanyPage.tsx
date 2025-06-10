import { DataWithMeta } from '../Pages.js'
import { useCompanies } from './utils/useCompanies.js'
import { useResources } from 'components/resources/useResources.js'
import { CompanySMPage } from './companiesSM/CompanySMPage.js'
import { Row } from 'react-bootstrap'
import { CompanyXSPage } from './companiesXS/CompanyXSPage.js'
import { CompanyType, companyTypeDescription } from 'components/resources/companyTypes/CompanyTypesInput.js'
import { useReducer, useState } from 'react'
import { changedCompanyReducer } from './utils/changedCompanyReducer.js'
import { useActiveCompany } from './utils/useActiveCompany.js'

export interface Company {
    'name': string
    'companyType': string
    'abbr'?: string
    'www'?: string
}

export const emptyCompany: DataWithMeta<Company> = { 'meta': { 'location': 0, 'etag': '' }, 'data': { 'name': '', 'companyType': 'default', 'abbr': '', 'www': '' } }

export const CompanyPage = () => {
    const [companyTypesList] = useResources<CompanyType>(companyTypeDescription)
    const [search, setSearch] = useState<string>('') // Content of the search input field
    const [changedCompany, changedCompanyDispatch] = useReducer(changedCompanyReducer, emptyCompany)
    const [activeCompany, changeActive] = useActiveCompany(changedCompanyDispatch)
    const [
        filteredCompaniesList,
        submitChangedCompany,
        submitNewCompany,
        deleteCompany
    ] = useCompanies(search, activeCompany, changeActive)

    
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
