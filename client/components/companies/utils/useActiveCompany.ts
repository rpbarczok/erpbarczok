import { useState } from "react"
import { Company, emptyCompany } from "../CompanyPage.js"
import { useAuth } from "react-oidc-context"
import { LoadingContext } from "utils/loadingContext.js"
import { useContextThrowUndefined } from "utils/contextUndefined.js"
import { apiClient } from "utils/openAPIClientAxios.js"
import { removeStringBeforeLastDigits } from "utils/removeStringBeforeLastDigits.js"
import { PermissionContext, updateUserPermissions } from "utils/permissionContext.js"
import { ChangedCompanyAction } from "./changedCompanyReducer.js"
import { DataWithMeta } from "components/Pages.js"

export function useActiveCompany(changedCompanyDispatch: React.ActionDispatch<[action: ChangedCompanyAction]>):
    [
        DataWithMeta<Company>,
        (active?: number) => Promise<void>
    ] {
    const [activeCompany, setActiveCompany] = useState(emptyCompany)
    const auth = useAuth()
    const token = auth.user?.access_token
    const { setIsLoading } = useContextThrowUndefined<{ setIsLoading: (isLoading: boolean) => void }>(LoadingContext)
    const { permissions, setPermissions } = useContextThrowUndefined<{ permissions: string[]; setPermissions: (permissions: string[]) => void }>(PermissionContext)

    async function changeActive(active?: number) {
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
                    changedCompanyDispatch({ type: 'companyChange', newValue: company })
                    if (typeof result.headers.permissions === 'string') {
                        updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                    } else {
                        throw new Error("Permission header must be type 'string'")
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