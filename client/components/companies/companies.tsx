import '../../style.css'
import './companies.css'
import { useEffect, useState } from "react"
import { useAuth } from "react-oidc-context"
import { client } from "utils/openAPIClientAxios.js"
import { DataWithMeta } from "components/forms.jsx"
import { removeBeforeLastDigits } from "utils/removeBeforeLastDigits.js"
import { FormCompanies } from './forms.companies.jsx'
import { useCompanyTypes } from './../../components/admin/companyTypes/useCompanyTypes.js'
import { Heading } from './../../components/headings/heading.jsx'

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

    useEffect(() => {
        if (isCompanyChanged) {
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
                    })
            } catch (error) {
                throw error
            }
            setIsCompanyChanged(false)
        }
    }, [isCompanyChanged])

    return (
        <>
            <Heading title="Stammdaten: Kunden, Lieferanten, Spediteure" cssClass="stammForm" />
            <FormCompanies
                companiesList={companiesList}
                companyTypesList={companyTypesList}
                setIsCompanyChanged={setIsCompanyChanged} />
        </>
    )
}
