import { apiClient } from '../../utils/openAPIClientAxios.js'
import { changedCompanyReducer } from './changedCompanyReducer.js'
import { Company, emptyCompany } from './CompanyPageBasis.js'
import { CompanySMPage } from './CompanySMPage.jsx'
import { CompanyType } from '../resources/companyTypes/CompanyTypesInput.js'
import { CompanyXSPage } from './CompanyXSPage.jsx'
import { DataWithMeta } from '../Pages.jsx'
import { LoadingContext } from '../../utils/loadingContext.js'
import { PermissionContext, updateUserPermissions } from '../../utils/permissionContext.js'
import { removeStringBeforeLastDigits } from '../../utils/removeStringBeforeLastDigits.js'
import { Row } from 'react-bootstrap'
import { useAuth } from 'react-oidc-context'
import { useContextThrowUndefined } from '../../utils/contextUndefined.js'
import { useEffect, useReducer, useState } from 'react'

interface CompanyPageExtendedInterface {
    companiesList: DataWithMeta<Company>[]
    setIsCompanyChanged: React.Dispatch<React.SetStateAction<boolean>>
    companyTypesList: DataWithMeta<CompanyType>[]
}

export const CompanyPageExtended = (
    { companiesList,
        companyTypesList,
        setIsCompanyChanged }: CompanyPageExtendedInterface) => {

    const [search, setSearch] = useState<string>('') // Content of the search input field
    const [listFiltered, setListFiltered] = useState(companiesList)
    const [activeCompany, setActiveCompany] = useState<DataWithMeta<Company>>(emptyCompany)
    const [isNew, setIsNew] = useState<boolean>(false) // Flag: triggers an clearance of the search input
    const [changedCompany, changedCompanyDispatch] = useReducer(changedCompanyReducer, emptyCompany)
    const { permissions, setPermissions } = useContextThrowUndefined(PermissionContext)
    const { setIsLoading } = useContextThrowUndefined(LoadingContext)
    const auth = useAuth()
    const token = auth.user?.access_token

    useEffect(() => {

        const newList: DataWithMeta<Company>[] = companiesList.filter((company: DataWithMeta<Company>) => {
            if (!isNew) {
                if (company.data.abbr) {
                    if (company.data.name.toLowerCase().includes(search.toLowerCase()) || company.data.abbr.toLowerCase().includes(search.toLowerCase())) {
                        return company
                    }
                } else {
                    if (company.data.name.toLowerCase().includes(search.toLowerCase())) {
                        return company
                    }
                }
            } else {
                return company
            }
        })

        const changeActiveAsync = async () => {
            if (newList.length === 0) {
                await changeActive(0)
            } else {
                if (!newList.some((e) => e.meta.location === activeCompany.meta.location)) {
                    await changeActive(newList[0].meta.location)
                }
            }
        }

        void changeActiveAsync()

        setListFiltered(newList)
        setIsNew(false)
    }, [search, companiesList])

    async function changeActive(active: number) {
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
                    changedCompanyDispatch({ type: 'companyChange', newValue: company })
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
                    filteredCompanies={listFiltered}
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
                    filteredCompanies={listFiltered}
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