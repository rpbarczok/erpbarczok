import { apiClient } from '../../../utils/openAPIClientAxios.js'
import { DataWithMeta } from '../../../components/forms.jsx'
import { Field } from './Fields.js'
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
    const { isLoading, setIsLoading } = useContextThrowUndefined(LoadingContext)

    useEffect(() => {
        if (isFieldChanged) {
            setIsLoading(true)
            
            async function getFields() {
                const client = await apiClient
                client.getFields(null, null, { headers: { 'Authorization': `Bearer ${token}` } })
                .then(
                    result => {
                        const newList = result?.data.map(row => {
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
                        updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                        setIsLoading(false)
                    },
                    error => {
                        setIsLoading(false)
                        throw new Error(`Error while loading fields: ${error.message}`)
                    }

                )
            }

            getFields()

            setIsFieldChanged(false)
            
        }
    }, [isFieldChanged])

    return [listFields, setIsFieldChanged]
}