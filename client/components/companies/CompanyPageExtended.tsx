import { Company } from './CompanyPageBasis.js'
import { CompanySMPage } from './companiesSM/CompanySMPage.js'
import { CompanyType } from '../resources/companyTypes/CompanyTypesInput.js'
import { CompanyXSPage } from './companiesXS/CompanyXSPage.js'
import { DataWithMeta } from '../Pages.jsx'
import { Row } from 'react-bootstrap'
import { FunctionComponent, useState } from 'react'
import { ChangedCompanyAction } from './utils/changedCompanyReducer.js'
import { useFilteredCompanyList } from './utils/useFilteredCompanies.js'
import { useActiveCompany } from './utils/useActiveCompany.js'


interface CompanyPageExtendedProps {
    companiesList: DataWithMeta<Company>[]
    setIsCompanyChanged: React.Dispatch<React.SetStateAction<boolean>>
    companyTypesList: DataWithMeta<CompanyType>[]
    changedCompany: DataWithMeta<Company>
    changedCompanyDispatch: React.ActionDispatch<[action: ChangedCompanyAction]>
}

export const CompanyPageExtended: FunctionComponent<CompanyPageExtendedProps> = (
    { companiesList,
        companyTypesList,
        setIsCompanyChanged,
        changedCompany, changedCompanyDispatch }) => {

    const [search, setSearch] = useState<string>('') // Content of the search input fiel
    const [activeCompany, changeActive] = useActiveCompany(changedCompanyDispatch)
    const [filteredCompaniesList, setIsNew] = useFilteredCompanyList(search, companiesList, activeCompany, changeActive)


    return (
        <>
            <Row className='d-none d-sm-flex flex-grow-1 flex-column' style={{ overflowY: 'scroll' }}>
                <CompanySMPage
                    search={search} setSearch={setSearch}
                    filteredCompaniesList={filteredCompaniesList}
                    activeCompany={activeCompany}
                    changeActive={changeActive}
                    companyTypesList={companyTypesList}
                    setIsCompanyChanged={setIsCompanyChanged}
                    setIsNew={setIsNew}
                    changedCompany={changedCompany} changedCompanyDispatch={changedCompanyDispatch}
                />
            </Row>
            <Row className='d-sm-none flex-grow-1 d-flex flex-column' style={{ overflowY: 'hidden' }}>
                <CompanyXSPage
                    search={search} setSearch={setSearch}
                    filteredCompaniesList={filteredCompaniesList}
                    activeCompany={activeCompany}
                    changeActive={changeActive}
                    companyTypesList={companyTypesList}
                    setIsCompanyChanged={setIsCompanyChanged}
                    setIsNew={setIsNew}
                    changedCompany={changedCompany} changedCompanyDispatch={changedCompanyDispatch}
                />
            </Row >
        </>
    )
}