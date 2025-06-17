
import { useEffect, useState } from "react"
import { useAuth } from "react-oidc-context"
import { useContextThrowUndefined } from "utils/contextUndefined.js"
import { LoadingContext } from "utils/loadingContext.js"
import { PermissionContext, updateUserPermissions } from "utils/permissionContext.js"
import { removeStringBeforeLastDigits } from "utils/removeStringBeforeLastDigits.js"
import { apiClient } from "utils/openAPIClientAxios.js"
import { GenericResource, Resource, ResourceDescription, ResourcePayloadAndDescription } from "./resourceList.js"
import { Country, isCountryDescription } from "./countries/CountriesInput.js"
import { isAddressTypeDescription } from "./addressTypes/AddressTypesInput.js"
import { isCompanyTypeDescription } from "./companyTypes/CompanyTypesInput.js"
import { isFieldDescription } from "./fields/Fields.js"

export function useResources(description: ResourceDescription<Resource>): [ResourcePayloadAndDescription<Resource>[], React.Dispatch<React.SetStateAction<boolean>>, React.Dispatch<React.SetStateAction<boolean>>] {
    const auth = useAuth()
    const token = auth.user?.access_token
    const { setIsLoading } = useContextThrowUndefined(LoadingContext)
    const [isResourceChanged, setIsResourceChanged] = useState(true)
    const [isActiveResourceChanged, setIsActiveResourceChanged] = useState(true)
    const [resourceList, setResourceList] = useState<ResourcePayloadAndDescription<Resource>[]>([])
    const { permissions, setPermissions } = useContextThrowUndefined(PermissionContext)

    useEffect(() => {

        async function getResource() {
            if (token) {
                setIsLoading(true)

                try {
                    const client = await apiClient
                    const result = isCountryDescription(description)
                        ? await client.paths['/countries/'].get(null, null, { headers: { Authorization: `Bearer ${token}` } })
                        : isAddressTypeDescription(description)
                            ? await client.paths['/address-types/'].get(null, null, { headers: { Authorization: `Bearer ${token}` } })
                            : isCompanyTypeDescription(description)
                                ? await client.paths['/company-types/'].get(null, null, { headers: { Authorization: `Bearer ${token}` } })
                                : isFieldDescription(description)
                                    ? await client.paths['/fields/'].get(null, null, { headers: { Authorization: `Bearer ${token}` } })
                                    : undefined
                    if (result === undefined) {
                        throw new Error('Entität nicht gefunden, bitte Entwickler kontaktieren.')
                    }
                    setIsLoading(false)
                    const newList = result.data.map(row => {
                        const newRow = {
                            description: description,
                            item: {
                                meta: {
                                    location: Number(removeStringBeforeLastDigits(row.meta.location)),
                                    etag: row.meta.etag
                                },
                                data: row.data as GenericResource | Country
                            }
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

        if (isResourceChanged || isActiveResourceChanged) {
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