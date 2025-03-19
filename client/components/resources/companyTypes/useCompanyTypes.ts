import React, { useEffect, useState } from "react"
import { client } from "utils/openAPIClientAxios.js"
import { DataWithMeta } from "components/forms.jsx"
import { CompanyType } from "./companyTypes.js"
import { removeBeforeLastDigits } from "utils/removeBeforeLastDigits.js"
import { useAuth } from "react-oidc-context"
import { PermissionContext, updateUserPermissions } from "utils/permissionContext.js"
import { useContextThrowUndefined } from "utils/contextUndefined.js"
import { LoadingContext } from "utils/loadingContext.js"

export function useCompanyTypes(): [DataWithMeta<CompanyType>[], React.Dispatch<React.SetStateAction<boolean>>] {
    const [listCompanyTypes, setListCompanyTypes] = useState<DataWithMeta<CompanyType>[]>([])
    const [isCompanyTypeChanged, setIsCompanyTypeChanged] = useState<boolean>(true)
    const auth = useAuth()
    const token = auth.user?.access_token
    const { permissions, setPermissions } = useContextThrowUndefined(PermissionContext)
    const { isLoading, setIsLoading } = useContextThrowUndefined(LoadingContext)

    useEffect(() => {
        if (isCompanyTypeChanged) {
            setIsLoading(true)
            client.getCompanyTypes(null, null, { headers: { 'Authorization': `Bearer ${token}` } })
                .then(result => {
                    const newList = result?.data.map(row => {
                        const newRow: DataWithMeta<CompanyType> = {
                            meta: {
                                location: Number(removeBeforeLastDigits(row.meta.location)),
                                etag: row.meta.etag
                            },
                            data: row.data
                        }
                        return (newRow)
                    })
                    setListCompanyTypes(newList)
                    updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                })
            setIsLoading(false)
            setIsCompanyTypeChanged(false)
        }
    }, [isCompanyTypeChanged])

    return [listCompanyTypes, setIsCompanyTypeChanged]
}