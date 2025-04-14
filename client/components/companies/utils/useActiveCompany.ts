import { useAuth } from "react-oidc-context"
import { Company, emptyCompany } from "../CompanyPageBasis.js"
import { useState } from "react"
import { useContextThrowUndefined } from "utils/contextUndefined.js"
import { PermissionContext, updateUserPermissions } from "utils/permissionContext.js"
import { LoadingContext } from "utils/loadingContext.js"
import { apiClient } from "utils/openAPIClientAxios.js"
import { removeStringBeforeLastDigits } from "utils/removeStringBeforeLastDigits.js"
import { DataWithMeta } from "components/Pages.js"

export function useActiveCompany(): [DataWithMeta<Company>, (active?: number) => Promise<void> ] {
    const [activeCompany, setActiveCompany] = useState(emptyCompany)

    async function changeActive(active?: number) {
        const auth = useAuth()
        const token = auth.user?.access_token
        const { permissions, setPermissions } = useContextThrowUndefined(PermissionContext)
        const { setIsLoading } = useContextThrowUndefined(LoadingContext)
        if (token) {
            if (!active) {
                setActiveCompany(emptyCompany)
            } else {
                setIsLoading(true)
                try {
                    const client = await apiClient
                    const result = await client.getCompanyById(active, null, { headers: { Authorization: `Bearer ${token}` } })
                    setIsLoading(false)
                    if (typeof result.headers.location !== 'string') {
                        throw Error('Location header should be type string.')
                    }
                    if (typeof result.headers.etag !== 'string') {
                        throw Error('Etag header should be type string.')
                    }
                    const company = { 'meta': { 'location': Number(removeStringBeforeLastDigits(result.headers.location)), 'etag': result.headers.etag }, 'data': result.data }
                    setActiveCompany(company)
                    if (typeof result.headers.permissions === 'string') {
                        updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                    } else {
                        throw Error('Permissions header should be type string.')
                    }
                } catch (error) {
                    setIsLoading(false)
                    throw Error(`Error while loading company: ${error instanceof Error ? error.message : String(error)}`)
                }
            }
        } else {
            throw Error('Bitte authentifizieren.')
        }
        

    }

    return [activeCompany, changeActive]
}
