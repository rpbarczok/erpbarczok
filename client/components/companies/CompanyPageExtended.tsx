import { Company, emptyCompany } from './CompanyPageBasis.js'
import { CompanySMPage } from './companiesSM/CompanySMPage.js'
import { CompanyType } from '../resources/companyTypes/CompanyTypesInput.js'
import { CompanyXSPage } from './companiesXS/CompanyXSPage.js'
import { DataWithMeta } from '../Pages.jsx'
import { Row } from 'react-bootstrap'
import { FunctionComponent, useState } from 'react'
import { ChangedCompanyAction } from './utils/changedCompanyReducer.js'
import { useFilteredCompanyList } from './utils/useFilteredCompanies.js'
import { useAuth } from 'react-oidc-context'
import { PermissionContext, updateUserPermissions } from 'utils/permissionContext.js'
import { useContextThrowUndefined } from 'utils/contextUndefined.js'
import { LoadingContext } from 'utils/loadingContext.js'
import { apiClient } from 'utils/openAPIClientAxios.js'
import { removeStringBeforeLastDigits } from 'utils/removeStringBeforeLastDigits.js'


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
    const [activeCompany, setActiveCompany] = useState(emptyCompany)
    const [filteredCompaniesList, setIsNew] = useFilteredCompanyList(search, companiesList, activeCompany, changeActive)

    const auth = useAuth()
    const token = auth.user?.access_token
    const { permissions, setPermissions } = useContextThrowUndefined(PermissionContext)
    const { setIsLoading } = useContextThrowUndefined(LoadingContext)

    async function changeActive(active?: number) {
        if (token) {
            if (!active) {
                setActiveCompany(emptyCompany)
            } else {
                setIsLoading(true)
                try {
                    const client = await apiClient
                    const result = await client.getCompanyById(active, null, { headers: { Authorization: `Bearer ${token}` } })
                    setIsLoading(false)
                    if (typeof result.headers.location !== 'string') {
                        throw Error('Location header should be type string.')
                    }
                    if (typeof result.headers.etag !== 'string') {
                        throw Error('Etag header should be type string.')
                    }
                    const company = { 'meta': { 'location': Number(removeStringBeforeLastDigits(result.headers.location)), 'etag': result.headers.etag }, 'data': result.data }
                    setActiveCompany(company)
                    changedCompanyDispatch({type: 'companyChange', newValue: company})
                    if (typeof result.headers.permissions === 'string') {
                        updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                    } else {
                        throw Error('Permissions header should be type string.')
                    }
                } catch (error) {
                    setIsLoading(false)
                    throw Error(`Error while loading company: ${error instanceof Error ? error.message : String(error)}`)
                }
            }
        } else {
            throw Error('Bitte authentifizieren.')
        }
    }


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