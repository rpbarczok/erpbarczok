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

        if (newList.length === 0) {
            changeActive(0)
        } else {
            if (!newList.some((e) => e.meta.location === activeCompany.meta.location)) {
                changeActive(newList[0].meta.location)
            }
        }

        setListFiltered(newList)
        setIsNew(false)
    }, [search, companiesList])

    async function changeActive(active: number) {
        if (active === 0 || active === undefined) {
            setActiveCompany(emptyCompany)
        } else {
            setIsLoading(true)
            const client = await apiClient
            return client.getCompanyById(active, null, { headers: { Authorization: `Bearer ${token}` } })
                .then(
                    result => {
                        if (result.data) {
                            const company = { 'meta': { 'location': Number(removeStringBeforeLastDigits(result.headers.location)), 'etag': result.headers.etag }, 'data': result.data }
                            setActiveCompany(company)
                            changedCompanyDispatch({ type: 'companyChange', newValue: company })
                        }
                        updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                        setIsLoading(false)
                    },
                    error => {
                        setIsLoading(false)
                        throw new Error(`Error while loading company: ${error.message}`)
                    }
                )
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