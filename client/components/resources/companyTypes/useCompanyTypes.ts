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
                if (token) {
                    const client = await apiClient
                    const result = await client.getCompanyTypes(null, null, { headers: { 'Authorization': `Bearer ${token}` } })
                    setIsLoading(false)
                    if (result.status === 200) {
                        const newList = result.data.map(row => {
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
                        if (typeof result.headers.permissions === 'string') {
                            updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                        } else {
                            throw new Error('No permissions header found')
                        }

                    }
                } else {
                    throw new Error('unauthorized')
                }
            }

            void getCompanyTypes()

            setIsCompanyTypeChanged(false)

        }
    }, [isCompanyTypeChanged])

    return [listCompanyTypes, setIsCompanyTypeChanged]
}