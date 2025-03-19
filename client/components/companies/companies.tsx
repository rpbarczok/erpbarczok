import '../../style.css'
import './companies.css'
import { useContext, useEffect, useState } from "react"
import { useAuth } from "react-oidc-context"
import { client } from "utils/openAPIClientAxios.js"
import { DataWithMeta } from "components/forms.jsx"
import { removeBeforeLastDigits } from "utils/removeBeforeLastDigits.js"
import { FormCompanies } from './form.companies.jsx'
import { useCompanyTypes } from '../resources/companyTypes/useCompanyTypes.js'
import { useContextThrowUndefined } from 'utils/contextUndefined.js'
import { PermissionContext, updateUserPermissions } from 'utils/permissionContext.js'
import { LoadingContext } from 'utils/loadingContext.js'

export interface Company {
    "name": string
    "companyType": string
    "abbr"?: string
    "www"?: string
}

export const emptyCompany: DataWithMeta<Company> = { "meta": { "location": 0, "etag": "" }, "data": { "name": "", "companyType": "default", "abbr": "", "www": "" } }

export const Companies = () => {
    const auth = useAuth()
    const [isCompanyChanged, setIsCompanyChanged] = useState<boolean>(true) // Flag: triggers a new GET /companies/ request
    const [companiesList, setCompaniesList] = useState<DataWithMeta<Company>[]>([]) // List of all Companies
    const [companyTypesList, setIsCompanyTypeChanged] = useCompanyTypes()
    const token = auth.user?.access_token
    const { permissions, setPermissions } = useContextThrowUndefined(PermissionContext)
    const { isLoading, setIsLoading } = useContextThrowUndefined(LoadingContext)

    useEffect(() => {
        if (isCompanyChanged) {
            setIsLoading(true)
            try {
                client.getCompanies(null, null, { headers: { 'Authorization': `Bearer ${token}` } })
                    .then(result => {
                        const newList = result?.data.map(row => {
                            const newRow: DataWithMeta<Company> = {
                                meta: {
                                    location: Number(removeBeforeLastDigits(row.meta.location)),
                                    etag: row.meta.etag
                                },
                                data: row.data
                            }
                            return (newRow)
                        })
                        setCompaniesList(newList)
                        updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                    })
            } catch (error) {
                throw error
            }
            setIsLoading(false)
            setIsCompanyChanged(false)
        }
    }, [isCompanyChanged])

    return (
        <>
            <FormCompanies
                companiesList={companiesList}
                companyTypesList={companyTypesList}
                setIsCompanyChanged={setIsCompanyChanged} />
        </>
    )
}
