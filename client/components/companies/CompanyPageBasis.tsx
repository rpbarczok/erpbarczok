import { useEffect, useState } from 'react'
import { useAuth } from 'react-oidc-context'
import { useContextThrowUndefined } from '../../utils/contextUndefined.js'
import { LoadingContext } from '../../utils/loadingContext.js'
import { apiClient } from '../../utils/openAPIClientAxios.js'
import { PermissionContext, updateUserPermissions } from '../../utils/permissionContext.js'
import { removeStringBeforeLastDigits } from '../../utils/removeStringBeforeLastDigits.js'
import { DataWithMeta } from '../Pages.jsx'
import { useCompanyTypes } from '../resources/companyTypes/useCompanyTypes.js'
import { CompanyPageExtended } from './CompanyPageExtended.jsx'

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
                if (token) {
                    try {
                        const client = await apiClient
                        const result = await client.getCompanies(null, null, { headers: { 'Authorization': `Bearer ${token}` } })
                        setIsLoading(false)
                        const newList = result.data.map(row => {
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
                        } else {
                            throw Error('Permissions header should be type string.')
                        }
                    } catch (error) {
                        setIsLoading(false)
                        throw Error(`Error while loading companies: ${error instanceof Error ? error.message : String(error)}`)
                    }
                }

            }

            void getCompanies()

            setIsCompanyChanged(false)
        }
    }, [isCompanyChanged])

    return (
        <CompanyPageExtended
            companiesList={companiesList}
            companyTypesList={companyTypesList}
            setIsCompanyChanged={setIsCompanyChanged} />
    )
}
