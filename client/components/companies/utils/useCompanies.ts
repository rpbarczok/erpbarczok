
import { DataWithMeta } from "components/Pages.js";
import { Company } from "../CompanyPageBasis.js";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useContextThrowUndefined } from "utils/contextUndefined.js";
import { LoadingContext } from "utils/loadingContext.js";
import { PermissionContext, updateUserPermissions } from "utils/permissionContext.js";
import { apiClient } from "utils/openAPIClientAxios.js";
import { removeStringBeforeLastDigits } from "utils/removeStringBeforeLastDigits.js";

export function useCompanies(): [DataWithMeta<Company>[], React.Dispatch<React.SetStateAction<boolean>>] {
    const [companiesList, setCompaniesList] = useState<DataWithMeta<Company>[]>([])
    const [isCompanyChanged, setIsCompanyChanged] = useState<boolean>(true)
    const auth = useAuth()
    const token = auth.user?.access_token
    const { setIsLoading } = useContextThrowUndefined(LoadingContext)
    const { permissions, setPermissions } = useContextThrowUndefined(PermissionContext)
    
    useEffect(() => {
        if (isCompanyChanged) {
            setIsLoading(true)

            async function getCompanies() {
                if (token) {
                    try {
                        const client = await apiClient
                        const result = await client.getCompanies(null, null, { headers: { 'Authorization': `Bearer ${token}` } })
                        setIsLoading(false)
                        const newList = result.data.map(row => {
                            const newRow: DataWithMeta<Company> = {
                                meta: {
                                    location: Number(removeStringBeforeLastDigits(row.meta.location)),
                                    etag: row.meta.etag
                                },
                                data: row.data
                            }
                            return (newRow)
                        })
                        setCompaniesList(newList)
                        if (typeof result.headers.permissions === 'string') {
                            updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                        } else {
                            throw Error('Permissions header should be type string.')
                        }
                    } catch (error) {
                        setIsLoading(false)
                        throw Error(`Error while loading companies: ${error instanceof Error ? error.message : String(error)}`)
                    }
                }

            }

            void getCompanies()

            setIsCompanyChanged(false)
        }
    }, [isCompanyChanged])

    return [companiesList, setIsCompanyChanged]
}