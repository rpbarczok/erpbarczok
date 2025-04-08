import { apiClient } from '../../utils/openAPIClientAxios.js'
import { CompanyPageExtended } from './CompanyPageExtended.jsx'
import { DataWithMeta } from '../Pages.jsx'
import { LoadingContext } from '../../utils/loadingContext.js'
import { PermissionContext, updateUserPermissions } from '../../utils/permissionContext.js'
import { removeStringBeforeLastDigits } from '../../utils/removeStringBeforeLastDigits.js'
import { useAuth } from 'react-oidc-context'
import { useCompanyTypes } from '../resources/companyTypes/useCompanyTypes.js'
import { useContextThrowUndefined } from '../../utils/contextUndefined.js'
import { useEffect, useState } from 'react'

export interface Company {
    'name': string
    'companyType': string
    'abbr'?: string
    'www'?: string
}

export const emptyCompany: DataWithMeta<Company> = { 'meta': { 'location': 0, 'etag': '' }, 'data': { 'name': '', 'companyType': 'default', 'abbr': '', 'www': '' } }

export const CompanyPageBasis = () => {
    const auth = useAuth()
    const [isCompanyChanged, setIsCompanyChanged] = useState<boolean>(true) // Flag: triggers a new GET /companies/ request
    const [companiesList, setCompaniesList] = useState<DataWithMeta<Company>[]>([]) // List of all Companies
    const [companyTypesList] = useCompanyTypes()
    const token = auth.user?.access_token
    const { permissions, setPermissions } = useContextThrowUndefined(PermissionContext)
    const { setIsLoading } = useContextThrowUndefined(LoadingContext)

    useEffect(() => {
        if (isCompanyChanged) {
            setIsLoading(true)

            async function getCompanies() {
                const client = await apiClient
                client.getCompanies(null, null, { headers: { 'Authorization': `Bearer ${token}` } })
                    .then(
                        result => {
                            setIsLoading(false)
                            const newList = result?.data.map(row => {
                                const newRow: DataWithMeta<Company> = {
                                    meta: {
                                        location: Number(removeStringBeforeLastDigits(row.meta.location)),
                                        etag: row.meta.etag
                                    },
                                    data: row.data
                                }
                                return (newRow)
                            })
                            setCompaniesList(newList)
                                                    if (typeof result.headers.permissions === 'string') {
                            updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                        }
                        },
                        error => {
                            setIsLoading(false)
                            throw new Error(`Error while loading companies: ${error.message}`)
                        }
                    )
            }

            void getCompanies()

            setIsCompanyChanged(false)
        }
    }, [isCompanyChanged])

    return (
        <>
            <CompanyPageExtended
                companiesList={companiesList}
                companyTypesList={companyTypesList}
                setIsCompanyChanged={setIsCompanyChanged} />
        </>
    )
}
