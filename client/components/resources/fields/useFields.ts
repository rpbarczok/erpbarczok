import { apiClient } from '../../../utils/openAPIClientAxios.js'
import { DataWithMeta } from '../../Pages.jsx'
import { Field } from './Fields.jsx'
import { LoadingContext } from '../../../utils/loadingContext.js'
import { PermissionContext, updateUserPermissions } from '../../../utils/permissionContext.js'
import { removeStringBeforeLastDigits } from '../../../utils/removeStringBeforeLastDigits.js'
import { useAuth } from 'react-oidc-context'
import { useContextThrowUndefined } from '../../../utils/contextUndefined.js'
import { useEffect, useState } from 'react'

export function useFields(): [DataWithMeta<Field>[], React.Dispatch<React.SetStateAction<boolean>>] {
    const [listFields, setListFields] = useState<DataWithMeta<Field>[]>([])
    const [isFieldChanged, setIsFieldChanged] = useState<boolean>(true)
    const auth = useAuth()
    const token = auth.user?.access_token
    const { permissions, setPermissions } = useContextThrowUndefined(PermissionContext)
    const { setIsLoading } = useContextThrowUndefined(LoadingContext)

    useEffect(() => {
        if (isFieldChanged) {

            async function getFields() {
                if (token) {
                    setIsLoading(true)
                    const client = await apiClient
                    const result = await client.getFields(null, null, { headers: { 'Authorization': `Bearer ${token}` } })
                    setIsLoading(false)
                    const newList = result.data.map(row => {
                        const newRow: DataWithMeta<Field> = {
                            meta: {
                                location: Number(removeStringBeforeLastDigits(row.meta.location)),
                                etag: row.meta.etag
                            },
                            data: row.data
                        }
                        return (newRow)
                    })
                    setListFields(newList)
                    if (typeof result.headers.permissions === 'string') {
                        if (typeof result.headers.permissions === 'string') {
                            updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                        } else {
                            throw new Error("Permission header must be type 'string'")
                        }
                    }
                } else {
                    throw Error('Unauthorized')
                }

            }

            void getFields()

            setIsFieldChanged(false)

        }
    }, [isFieldChanged])

    return [listFields, setIsFieldChanged]
}