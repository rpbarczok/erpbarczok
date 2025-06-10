import { DataWithMeta } from "components/Pages.js"
import { useEffect, useState } from "react"
import { useAuth } from "react-oidc-context"
import { useContextThrowUndefined } from "utils/contextUndefined.js"
import { LoadingContext } from "utils/loadingContext.js"
import { PermissionContext, updateUserPermissions } from "utils/permissionContext.js"
import { removeStringBeforeLastDigits } from "utils/removeStringBeforeLastDigits.js"
import { ResourceDescription } from "./resourceList.js"
import { apiClient } from "utils/openAPIClientAxios.js"

export function useResources<T>(resource: ResourceDescription<T>): [DataWithMeta<T>[], React.Dispatch<React.SetStateAction<boolean>>, React.Dispatch<React.SetStateAction<boolean>>] {
    const auth = useAuth()
    const token = auth.user?.access_token
    const { setIsLoading } = useContextThrowUndefined(LoadingContext)
    const [isResourceChanged, setIsResourceChanged] = useState(true)
    const [isActiveResourceChanged, setIsActiveResourceChanged] = useState(true)
    const [resourceList, setResourceList] = useState<DataWithMeta<T>[]>([])
    const { permissions, setPermissions } = useContextThrowUndefined(PermissionContext)

    useEffect(() => {
        if (isResourceChanged || isActiveResourceChanged) {
            setIsLoading(true)

            async function getResource() {
                if (token) {
                    try {
                        const client = await apiClient
                        const result = await client.paths[resource.paths.all].get(null, null, { headers: { Authorization: `Bearer ${token}` } })
                        setIsLoading(false)
                        const newList = result.data.map(row => {
                            const newRow: DataWithMeta<T> = {
                                meta: {
                                    location: Number(removeStringBeforeLastDigits(row.meta.location)),
                                    etag: row.meta.etag
                                },
                                data: row.data as T
                            }
                            return newRow
                        })
                        setResourceList(newList)
                        if (typeof result.headers.permissions === 'string') {
                            updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                        } else {
                            throw new Error("Permission header must be type 'string'")
                        }
                    } catch (error) {
                        setIsLoading(false)
                        throw Error(`Error while loading resource: ${error instanceof Error ? error.message : String(error)}`)
                    }
                } else {
                    throw Error('Bitte authentifizieren')
                }
            }

            void getResource()
            if (isResourceChanged) {
                setIsResourceChanged(false)
            }
            if (isActiveResourceChanged) {
                setIsActiveResourceChanged(false)
            }

        }
    }, [isResourceChanged, isActiveResourceChanged])

    return [resourceList, setIsResourceChanged, setIsActiveResourceChanged]
}