import { apiClient } from '../../../utils/openAPIClientAxios.js'
import { CompanyType } from './CompanyTypesInput.jsx'
import { DataWithMeta } from '../../Pages.jsx'
import { LoadingContext } from '../../../utils/loadingContext.js'
import { PermissionContext, updateUserPermissions } from '../../../utils/permissionContext.js'
import { removeStringBeforeLastDigits } from '../../../utils/removeStringBeforeLastDigits.js'
import { useAuth } from 'react-oidc-context'
import { useContextThrowUndefined } from '../../../utils/contextUndefined.js'
import { useEffect, useState } from 'react'

export function useCompanyTypes(): [DataWithMeta<CompanyType>[], React.Dispatch<React.SetStateAction<boolean>>] {
    const [listCompanyTypes, setListCompanyTypes] = useState<DataWithMeta<CompanyType>[]>([])
    const [isCompanyTypeChanged, setIsCompanyTypeChanged] = useState<boolean>(true)
    const auth = useAuth()
    const token = auth.user?.access_token
    const { permissions, setPermissions } = useContextThrowUndefined(PermissionContext)
    const { setIsLoading } = useContextThrowUndefined(LoadingContext)

    useEffect(() => {
        if (isCompanyTypeChanged) {
            setIsLoading(true)

            async function getCompanyTypes() {
                const client = await apiClient
                client.getCompanyTypes(null, null, { headers: { 'Authorization': `Bearer ${token}` } })
                    .then(
                        result => {
                            setIsLoading(false)
                            const newList = result?.data.map(row => {
                                const newRow: DataWithMeta<CompanyType> = {
                                    meta: {
                                        location: Number(removeStringBeforeLastDigits(row.meta.location)),
                                        etag: row.meta.etag
                                    },
                                    data: row.data
                                }
                                return (newRow)
                            })
                            setListCompanyTypes(newList)
                            updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                        }, error => {
                            setIsLoading(false)
                            throw new Error(`Error while loading company types: ${error.message}`)
                        }
                    )
                }

                getCompanyTypes()
                
                setIsCompanyTypeChanged(false)
            }
        }, [isCompanyTypeChanged])

    return [listCompanyTypes, setIsCompanyTypeChanged]
}