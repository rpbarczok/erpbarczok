import React, { useEffect, useState } from "react"
import { client } from "utils/openAPIClientAxios.js"
import { DataWithMeta } from "components/forms.jsx"
import { Field } from "./fields.js"
import { removeBeforeLastDigits } from "utils/removeBeforeLastDigits.js"
import { useAuth } from "react-oidc-context"
import { useContextThrowUndefined } from "utils/contextUndefined.js"
import { PermissionContext, updateUserPermissions } from "utils/permissionContext.js"
import { LoadingContext } from "utils/loadingContext.js"

export function useFields(): [DataWithMeta<Field>[], React.Dispatch<React.SetStateAction<boolean>>] {
    const [listFields, setListFields] = useState<DataWithMeta<Field>[]>([])
    const [isFieldChanged, setIsFieldChanged] = useState<boolean>(true)
    const auth = useAuth()
    const token = auth.user?.access_token
    const { permissions, setPermissions } = useContextThrowUndefined(PermissionContext)
    const { isLoading, setIsLoading } = useContextThrowUndefined(LoadingContext)

    useEffect(() => {
        if (isFieldChanged) {
            setIsLoading(true)
            client.getFields(null, null, { headers: { 'Authorization': `Bearer ${token}` } })
                .then(result => {
                    const newList = result?.data.map(row => {
                        const newRow: DataWithMeta<Field> = {
                            meta: {
                                location: Number(removeBeforeLastDigits(row.meta.location)),
                                etag: row.meta.etag
                            },
                            data: row.data
                        }
                        return (newRow)
                    })
                    setListFields(newList)
                    updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                })
            setIsLoading(false)
            setIsFieldChanged(false)
        }
    }, [isFieldChanged])

    return [listFields, setIsFieldChanged]
}